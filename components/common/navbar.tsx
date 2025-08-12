"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Award,
  Shield,
  Store,
  User,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogOutDialog } from "./logoutdialog";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Yutuqlar", href: "/dashboard/achievements", icon: Award },
  { label: "Xavfsizlik", href: "/dashboard/security", icon: Shield },
  { label: "Market", href: "/dashboard/market", icon: Store },
  { label: "Profil", href: "/dashboard/profile", icon: User },
];

export default function AdvancedNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <div className="w-full py-2 h-[80px] border-b border-gray-200 bg-white flex items-center justify-between px-6 relative z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <img
          src="/assets/logo.png"
          className="w-[50%] max-w-[180px] h-auto"
          alt="Logo"
        />
      </Link>

      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="relative w-7 h-7">
          <Menu
            size={28}
            className={cn(
              "absolute inset-0 transition-all duration-300",
              isOpen
                ? "opacity-0 rotate-180 scale-75"
                : "opacity-100 rotate-0 scale-100"
            )}
          />
          <X
            size={28}
            className={cn(
              "absolute inset-0 transition-all duration-300",
              isOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-180 scale-75"
            )}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      >
        {/* Slide-in Menu */}
        <div
          className={cn(
            "absolute inset-0 bg-white flex flex-col transition-all duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Top bar */}
          <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
            <Link href="/" onClick={toggleMenu}>
              <img
                src="/assets/logo.png"
                className="w-[40%] max-w-[120px] h-auto"
                alt="Logo"
              />
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-2 max-w-md mx-auto">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMenu}
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 text-lg font-medium",
                      isActive
                        ? "bg-blue-50 text-blue-600 focus:ring-blue-500"
                        : "hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-500"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-blue-600" : "text-gray-600"
                      )}
                    />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Logout button */}
            <div className="w-full flex items-center mt-6">
              <LogOutDialog width="w-[90%]" />
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              © 2025 PDP Jubior
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
