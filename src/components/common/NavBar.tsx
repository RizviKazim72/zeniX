"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Heart, User, Film, LogOut, X } from "lucide-react";
import SideBar from "./SideBar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import UserAvatar from "@/components/ui/UserAvatar";
import ZeniXLoader from "@/components/ui/ZeniXLoader";
import ZenixLogo from "@/components/ui/ZeniXLogo";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";

/**
 * 🧭 NavBar Component
 * Main navigation bar with search, user menu, aur sidebar
 * Responsive design with loading states
 */
const NavBar = () => {
  // State management
  const [search, setSearch] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Hooks
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isLoading, loadingText, navigate } = useNavigationLoading();

  // 🖱️ Outside click handler for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔍 Search handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`, "Searching for content...");
      setSearch("");
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`, "Searching for content...");
      setSearch("");
    }
  };

  // 🚪 Logout handler
  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <>
      {/* 🔄 Navigation Loading Overlay */}
      {isLoading && (
        <ZeniXLoader 
          isLoading={isLoading}
          loadingText={loadingText}
          variant="navigation"
        />
      )}

      <header className="w-full h-16 px-4 sm:px-6 md:px-8 fixed top-0 z-50 text-white 
                        flex items-center justify-between bg-gradient-to-br from-black/60 
                        via-black/40 to-black/20 backdrop-blur-lg backdrop-saturate-150 
                        border-b border-white/10 shadow-md">
        
        {/* 🎮 LEFT: Menu Button + Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSideBarOpen(true)}
            className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-white/20 
                      backdrop-blur-md border border-white/10 rounded-sm transition-all 
                      duration-300 cursor-pointer"
          >
            <Menu size={20} />
          </button>

          <button 
            onClick={() => navigate('/', 'Loading Home...')}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <span className="heading-card text-netflix-red group-hover:text-netflix-red-light 
                           transition-colors duration-300">
              zeniX.
            </span>
          </button>
        </div>

        {/* 🔍 MIDDLE: Search Bar */}
        <div className="hidden sm:flex items-center flex-1 mx-6 max-w-xl px-4 py-3 
                       bg-black/40 border border-white/20 backdrop-blur-md shadow-lg 
                       transition-all duration-300 hover:bg-black/60 hover:border-netflix-red/50 
                       focus-within:border-netflix-red focus-within:shadow-netflix 
                       focus-within:bg-black/80 rounded-lg group cursor-text">
          
          <button 
            onClick={handleSearchSubmit}
            className="text-white/70 group-focus-within:text-netflix-red transition-colors 
                      duration-300 hover:text-netflix-red cursor-pointer"
          >
            <Search size={18} />
          </button>
          
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, TV shows..."
            className="ml-3 flex-1 bg-transparent outline-none placeholder:font-netflix 
                      placeholder:text-white/60 font-netflix text-white text-sm 
                      focus:placeholder:text-white/40 transition-all duration-300"
          />
          
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="p-1 hover:bg-white/10 rounded-full transition-all duration-200 cursor-pointer"
            >
              <X size={16} className="text-white/60 hover:text-netflix-red transition-colors duration-300" />
            </button>
          )}
        </div>

        {/* 👤 RIGHT: Authentication Section */}
        <div className="flex items-center space-x-2">
          
          {/* Watchlist Button - sirf authenticated users ke liye */}
          {isAuthenticated && user && (
            <button
              onClick={() => navigate('/myspace?tab=watchlist', 'Loading Watchlist...')}
              className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-white/20 
                        backdrop-blur-md border border-white/10 transition-all duration-300 
                        rounded-[3px] cursor-pointer"
            >
              <Heart size={18} />
            </button>
          )}

          {isAuthenticated && user ? (
            // User Menu Dropdown
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 
                          transition-all duration-300"
              >
                <UserAvatar 
                  user={{
                    name: user.fullName,
                    email: user.email,
                    profileImage: user.avatar
                  }} 
                  size="md" 
                />
              </button>

              {/* 📋 Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-md 
                              border border-white/10 rounded-lg shadow-lg py-2 z-50">
                  
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-white heading-card">{user.fullName}</p>
                    <p className="text-gray-400 body-tiny">{user.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/myspace', 'Loading Personal Space...');
                    }}
                    className="flex items-center space-x-2 px-3 py-2 body-small text-white 
                              hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <User size={16} />
                    <span>My Space</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile', 'Loading Profile Settings...');
                    }}
                    className="flex items-center space-x-2 px-3 py-2 body-small text-white 
                              hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 body-small text-white hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/login', 'Accessing Login...')}
                className="px-3 py-2 body-small text-white hover:text-netflix-red transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register', 'Creating Account...')}
                className="px-3 py-2 body-small bg-netflix-red text-white rounded hover:bg-netflix-red-dark transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 📱 Sidebar Component */}
      <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
    </>
  );
};

export default NavBar;
