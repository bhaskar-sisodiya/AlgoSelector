// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // <--- THIS IS CRITICAL
import TopNavbar from "../components/dashboard/TopNavbar";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); 
  // Default collapsed on mobile

  return (
    <div className="min-h-screen bg-base-200 text-base-content relative overflow-x-hidden">

      <TopNavbar />

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 z-40
          h-[calc(100vh-4rem)]
          transition-all duration-300
          ${isSidebarCollapsed ? "w-20" : "w-64"}
        `}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() =>
            setIsSidebarCollapsed(!isSidebarCollapsed)
          }
        />
      </div>

      {/* Overlay ONLY when expanded on mobile */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setIsSidebarCollapsed(true)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main Content */}
      <main
        className={`
          pt-20 pb-10 transition-all duration-300
          ${isSidebarCollapsed ? "pl-20" : "pl-0 md:pl-64"}
        `}
      >
        <div className="p-6 max-w-[1600px] mx-auto min-h-[calc(100vh-6rem)]">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;
