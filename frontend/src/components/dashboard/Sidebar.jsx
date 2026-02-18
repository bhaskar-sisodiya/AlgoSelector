import React, { useState } from "react";
import {
  FaDatabase,
  FaCogs,
  FaBrain,
  FaChartLine,
  FaSearch,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import LogoutModal from "./LogoutModal"; // <--- UNCOMMENTED

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation(); 
  const navigate = useNavigate(); // Needed for redirect

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { icon: FaDatabase, label: "Dataset Upload", path: "/dashboard/upload" },
    { icon: FaCogs, label: "Preprocessing", path: "/dashboard/preprocessing" },
    { icon: FaBrain, label: "Algorithm Selection", path: "/dashboard" }, 
    { icon: FaSearch, label: "Meta-Insights", path: "/dashboard/insights" },
    {
      icon: FaChartLine,
      label: "Explainability",
      path: "/dashboard/explainability",
    },
    { icon: FaBell, label: "Monitoring", path: "/dashboard/monitoring" },
  ];

  const handleLogoutConfirm = () => {
  // 1️⃣ Remove stored JWT
  localStorage.removeItem("access_token");

  // 2️⃣ Close modal
  setShowLogoutConfirm(false);

  // 3️⃣ Redirect to login page
  navigate("/auth", { replace: true });
};


  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 border-r border-white/10 
              h-[calc(100vh-4rem)] 
              flex flex-col 
              transition-all duration-300"
      >
        {/* 1. Minimize Button */}
        <div className="p-4 flex justify-end border-b border-white/5">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* 2. Menu Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-2 px-3 custom-scrollbar">
          {menuItems.map((item, idx) => {
            // Check if this item is active
            const isActive = location.pathname === item.path;

            return (
              <Link
                to={item.path} 
                key={idx}
                className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="text-xl shrink-0">
                  <item.icon />
                </div>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. Bottom Section: System Status & Profile */}
        <div className="p-4 border-t border-white/10 space-y-4 bg-black/20">
          {/* System Status */}
          <div
            className={`rounded-xl border border-white/5 ${isCollapsed ? "p-2 flex justify-center bg-green-900/20" : "p-3 bg-gradient-to-br from-primary/10 to-purple-900/20"}`}
          >
            {isCollapsed ? (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            ) : (
              <>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                  System Status
                </h4>
                <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  ONLINE
                </div>
              </>
            )}
          </div>

          {/* User Account Section */}
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10 rounded-full 
                bg-gradient-to-br from-primary to-purple-600 
                flex items-center justify-center 
                text-white font-bold text-sm 
                shadow-lg ring-2 ring-primary/30"
            >
              BS
              {/* Online Status Dot */}
              <span
                className="absolute bottom-0 right-0 
                      w-3 h-3 bg-green-500 
                      rounded-full border-2 border-gray-900"
              />
            </motion.div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Bhaskar S.
                </p>
                <p className="text-xs text-primary font-medium">Pro Plan</p>
              </div>
            )}

            {!isCollapsed && (
              <motion.button
                onClick={() => setShowLogoutConfirm(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center 
                  rounded-lg hover:bg-red-500/10 
                  text-gray-400 hover:text-red-400 
                  transition-all"
              >
                <FaSignOutAlt size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* RENDER MODAL HERE */}
      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogoutConfirm} 
      />
    </>
  );
};

export default Sidebar;