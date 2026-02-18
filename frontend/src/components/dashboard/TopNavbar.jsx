// src/components/dashboard/TopNavbar.jsx
import React, { useState } from "react";
import {
  FaBrain,
  FaSearch,
  FaBell,
  FaSun,
  FaMoon,
  FaEllipsisV,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext"; // Import the hook

const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "luxury"; // Assuming 'luxury' is your dark theme
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="h-16 bg-base-100/80 backdrop-blur-md 
                border-b border-base-content/10 
                fixed top-0 left-0 right-0 z-40 
                flex items-center justify-between 
                px-4 sm:px-6"
    >
      {/* LEFT: Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-lg sm:text-xl font-bold text-base-content z-10"
      >
        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg text-primary">
          <FaBrain className="text-base sm:text-lg" />
        </div>
        <span className="hidden sm:inline">
          Algo<span className="text-primary">Selector</span>
        </span>
      </Link>

      {/* CENTER: Search (Always centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[60%] sm:w-[40%] max-w-md">
        <div
          className="flex items-center bg-base-200 border border-base-content/5 
                    rounded-full px-3 sm:px-4 py-1.5 sm:py-2 w-full
                    focus-within:border-primary/50 
                    focus-within:ring-2 focus-within:ring-primary/20 
                    transition-all"
        >
          <FaSearch className="text-base-content/40 mr-2 text-xs sm:text-sm" />
          <input
            type="text"
            placeholder="Search datasets, models..."
            className="bg-transparent border-none focus:outline-none 
                   text-base-content text-xs sm:text-sm w-full 
                   placeholder-base-content/40"
          />
        </div>
      </div>

      {/* RIGHT: Icons */}
      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 z-10 relative">
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Notification */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="relative h-8 w-8 sm:h-8 sm:w-8
             flex items-center justify-center
             rounded-lg
             bg-base-200/60 hover:bg-primary/10
             border border-base-content/5"
          >
            <FaBell className="text-sm text-base-content/70" />
            <span
              className="absolute top-1 right-1 w-2 h-2 
                   bg-red-800 rounded-full 
                   "
            />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-8 rounded-full 
              border border-base-content/10
              overflow-hidden
              ${isDark ? "bg-neutral" : "bg-blue-100"}`}
          >
            <motion.div
              className="absolute top-1 left-1 w-6 h-6 
               bg-white rounded-full shadow-md 
               flex items-center justify-center"
              animate={{ x: isDark ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {isDark ? (
                <FaMoon className="text-yellow-300 text-[10px]" />
              ) : (
                <FaSun className="text-orange-400 text-[10px]" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Three Dot Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden w-9 h-9 flex items-center justify-center 
               rounded-lg hover:bg-base-200 transition"
        >
          <FaEllipsisV className="text-sm text-base-content/70" />
        </button>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`absolute right-0 top-12 w-48 
                rounded-xl shadow-2xl p-2 space-y-1 sm:hidden
                border transition-all duration-200
                ${
                  isDark
                    ? "bg-gray-900 border-white/10 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
          >
            <button
              className={`flex items-center gap-3 w-full px-3 py-2 
                  rounded-lg transition
                  ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              <FaBell size={14} />
              <span className="text-sm">Notifications</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 w-full px-3 py-2 
                  rounded-lg transition
                  ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              {isDark ? (
                <FaMoon className="text-yellow-300 text-[10px]" />
              ) : (
                <FaSun className="text-orange-400 text-[10px]" />
              )}

              <span className="text-sm">Toggle Theme</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
