// app/dashboard/layout.tsx
"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/common/sidebar";
import Navbar from "@/components/common/navbar";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Your user dashboard",
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-40">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          toggleMenu={toggleMenu}
        />
      </div>

      <div
        className={`fixed top-0 z-30 h-[100px] transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "left-16 w-[calc(100vw-4rem)]"
            : "left-64 w-[calc(100vw-16rem)]"
        }`}
      >
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 p-6 overflow-y-auto pt-[100px] transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
