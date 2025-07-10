"use client";

import { useRef, useCallback } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainSideBarLinks, GenresSideBarLinks } from "@/constants/sidebar";
import useOutsideClick from "@/utils/useOutsideClick";
import ZeniXLogo from "@/components/ui/ZeniXLogo";

interface SideBarProps {
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ sideBarOpen, setSideBarOpen }) => {
  const pathname = usePathname();
  const sideBarRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(() => {
    setSideBarOpen(false);
  }, [setSideBarOpen]);

  useOutsideClick<HTMLDivElement>(sideBarRef, handleOutsideClick);  return (
  <>
    {/* Sidebar */}
    <div
      ref={sideBarRef}
      tabIndex={-1}
      aria-expanded={sideBarOpen}
      className={`h-screen overflow-auto no-scrollbar fixed left-0 top-0 w-64 sm:w-72 flex flex-col justify-between pb-4 z-50 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        bg-gradient-to-b from-black/95 via-black/85 to-black/75 backdrop-blur-xl border-r border-white/10 ${
          sideBarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } no-box-shadow clean-blur`}
      style={{
        transitionProperty: 'transform, opacity, visibility',
        visibility: sideBarOpen ? 'visible' : 'hidden',
        transitionDelay: sideBarOpen ? '0ms' : '200ms'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 w-full border-b border-white/10 mb-4 bg-black/20 subtle-blur-bg">
        <Link href="/" className="group">
          <div className="flex items-center space-x-2">
            <ZeniXLogo size="md" className="group-hover:scale-110 transition-all duration-300 ease-out" />
            <span className="text-xl font-bold text-red-600 group-hover:text-red-500 tracking-tight transition-all duration-300 group-hover:scale-105">
              zeniX
            </span>
          </div>
        </Link>

        <button
          onClick={() => setSideBarOpen(false)}
          className="h-8 w-8 flex items-center justify-center hover:bg-black/30 text-white/80 hover:text-white transition-all duration-300"
          aria-label="Close sidebar"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Links */}
      <div className="space-y-1 px-4">
        {MainSideBarLinks.map((link, index) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              href={link.path} 
              key={link.id} 
              onClick={() => setSideBarOpen(false)} 
              className="block group"
              style={{
                animationDelay: sideBarOpen ? `${index * 50}ms` : '0ms'
              }}
            >
              <div
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-black/40 text-red-500"
                      : "text-white/80 hover:bg-black/20 hover:text-white"
                  }`}
              >
                <link.icon size={18} className={`transition-all duration-200 ${isActive ? 'text-red-500' : ''}`} />
                <span className="transition-all duration-200">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Genre Links */}
      <div className="space-y-1 px-4 mt-6">
        <p className="text-xs text-white/50 uppercase mb-3 tracking-wider font-semibold">Genres</p>
        {GenresSideBarLinks.map((genre, index) => {
          const isActive = pathname === genre.path;
          return (
            <Link 
              href={genre.path} 
              key={genre.id} 
              onClick={() => setSideBarOpen(false)} 
              className="block group"
              style={{
                animationDelay: sideBarOpen ? `${(MainSideBarLinks.length + index) * 50}ms` : '0ms'
              }}
            >
              <div
                className={`px-4 py-2.5 text-sm rounded transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-black/40 text-red-500"
                      : "text-white/80 hover:bg-black/20 hover:text-white"
                  }`}
              >
                <span className="transition-all duration-200 font-medium">
                  {genre.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>

    {/* Overlay */}
    {sideBarOpen && (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-500 ease-out"
        onClick={() => setSideBarOpen(false)}
        style={{
          opacity: sideBarOpen ? 1 : 0,
          visibility: sideBarOpen ? 'visible' : 'hidden'
        }}
      />
    )}
  </>
);

};

export default SideBar;
