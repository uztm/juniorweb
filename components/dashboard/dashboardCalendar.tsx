"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export function DashboardCalendar({ className = "" }: { className?: string }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm w-ful flex items-center justify-center l ${className}`}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        className="flex-grow"
      />
    </div>
  );
}
