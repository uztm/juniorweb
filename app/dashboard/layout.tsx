// app/dashboard/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { StudentContext } from "@/context/StudentContext";
import Sidebar from "@/components/common/sidebar";
import { auth } from "@/lib/auth";
import { api } from "@/Services/api/apiService";
import { LessonResponse } from "@/types/StudentInfo";

import "../../i18n";
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

  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const student = auth.getStudentInfo();

    if (student) {
      setId(student.id);
      setPhone(student.phoneNumber);
    } else {
      console.error("Student ID not found in local storage.");
    }
  }, []);

  const getStudentInfo = async () => {
    if (!id) {
      console.error("Student ID is not set.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `api/education/v1/junior-app/info-student/${id}`
      );
      setData(response.data);
      console.log("Student Info:", response);
    } catch (error) {
      console.error("Failed to fetch student info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getStudentInfo();
    }
  }, [id]);

  return (
    <StudentContext.Provider value={{ data, loading, phone }}>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen z-40">
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            toggleMenu={toggleMenu}
          />
        </div>

        <div className="fixed w-full top-0 left-0 z-40 flex md:hidden">
          <Navbar />
        </div>

        <main
          className={`flex-1 overflow-y-auto transition-all pt-[80px] md:pt-0 duration-300 ease-in-out ${
            isCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </StudentContext.Provider>
  );
}
