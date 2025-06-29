"use client"

import { useState , useRef} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useOutsideClick } from "@/utils";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  icon: LucideIcon;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ title, options, selected, onSelect, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  })

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary border border-bg-tertiary rounded-md transition-all duration-200 cursor-pointer hover:scale-105 hover:border-netflix-red/50"
      >
        <Icon size={16} className="text-netflix-red" />
        <span className="text-text-secondary text-sm font-medium">{title}</span>
        <ChevronDown size={14} className={`text-text-muted transition-all duration-200 ${isOpen ? 'rotate-180 text-netflix-red' : 'group-hover:text-text-primary'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-56 bg-bg-secondary border border-bg-tertiary rounded-md overflow-hidden z-50 shadow-glass backdrop-blur-md"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-bg-tertiary hover:text-text-primary cursor-pointer ${
                  selected === option.value 
                    ? 'text-netflix-red bg-bg-tertiary' 
                    : 'text-text-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
