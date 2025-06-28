"use client";

import { useRef, useCallback } from "react";
import { Film, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainSideBarLinks, GenresSideBarLinks } from "@/constants/sidebar";
import useOutsideClick from "@/utils/useOutsideClick";

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

  useOutsideClick<HTMLDivElement>(sideBarRef, handleOutsideClick);

 return (
  <>
    {/* Sidebar */}
    <div
      ref={sideBarRef}
      tabIndex={-1}
      aria-expanded={sideBarOpen}
      className={`h-screen overflow-auto no-scrollbar fixed left-0 top-0 w-64 sm:w-72 flex flex-col justify-between pb-4 z-50 transition-transform duration-300 ease-in-out
        bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-lg border-r border-white/10 shadow-xl ${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 w-full border-b border-white/10 mb-4 bg-black/20 backdrop-blur-md">
        <Link href="/" className="group">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-netflix flex items-center justify-center rounded-sm shadow-md group-hover:scale-105 transition-transform duration-300">
              <Film size={20} className="group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <span className="text-xl font-semibold text-netflix-red group-hover:text-netflix-red-light tracking-tight transition-all duration-300">
              zeniX.
            </span>
          </div>
        </Link>

        <button
          onClick={() => setSideBarOpen(false)}
          className="h-8 w-8 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-sm transition-all duration-300"
          aria-label="Close sidebar"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Links */}
      <div className="space-y-1 px-4">
        {MainSideBarLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link href={link.path} key={link.id} onClick={() => setSideBarOpen(false)} className="block group">
              <div
                className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium transition-all duration-300 
                  ${
                    isActive
                      ? "bg-netflix-red/10 text-netflix-red border-l-4 border-netflix-red"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Genre Links */}
      <div className="space-y-1 px-4 mt-6">
        <p className="text-xs text-white/50 uppercase mb-3 tracking-wider">Genres</p>
        {GenresSideBarLinks.map((genre) => {
          const isActive = pathname === genre.path;
          return (
            <Link href={genre.path} key={genre.id} onClick={() => setSideBarOpen(false)} className="block group">
              <div
                className={`px-3 py-2 text-sm transition-all duration-300 
                  ${
                    isActive
                      ? "bg-netflix-red/10 text-netflix-red border-l-4 border-netflix-red"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
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
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300"
        onClick={() => setSideBarOpen(false)}
      />
    )}
  </>
);

};

export default SideBar;
