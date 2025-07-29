"use client";

import { Calendar, Cpu } from "lucide-react";
import * as React from "react";

export function DashboardLessons({ className = "" }: { className?: string }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div
      className={` w-ful flex items-center justify-center gap-4 l ${className}`}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <div className="w-full rounded-xl shadow-sm bg-white  h-[120px] p-5">
        <p className=" font-bold text-2xl">Paython</p>
        <div className=" flex items-center justify-start gap-3">
          <Calendar color="#0029AD" size={18} />
          <p>07.07.2025 13:00</p>
        </div>
        <div className=" flex items-center justify-start gap-3">
          <Cpu color="#0029AD" size={18} />
          <p>Mentor Ismi</p>
        </div>
      </div>
      <div className="w-full rounded-xl shadow-sm bg-white  h-[120px] p-5">
        <p className=" font-bold text-2xl">Paython</p>
        <div className=" flex items-center justify-start gap-3">
          <Calendar color="#0029AD" size={18} />
          <p>07.07.2025 13:00</p>
        </div>
        <div className=" flex items-center justify-start gap-3">
          <Cpu color="#0029AD" size={18} />
          <p>Mentor Ismi</p>
        </div>
      </div>
    </div>
  );
}
