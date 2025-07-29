"use client";

import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  className?: string;
  attandanceAveragePercent: number;
}

export default function SummaryReport({
  className = "",
  attandanceAveragePercent,
}: Props) {
  const data = [
    { label: "Score", value: 83, color: "#1976d2" },
    { label: "Davomat", value: attandanceAveragePercent, color: "#f9a825" },
    { label: "Tasks", value: 55, color: "#00bcd4" },
  ];

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>
      <p className="text-lg font-semibold mb-4">Summary report</p>
      <div className="grid grid-cols-3  gap-6 justify-items-center">
        {data.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="w-18 h-18 md:w-24 md:h-24 lg:w-28 lg:h-28">
              <CircularProgressbar
                value={item.value}
                text={`${item.value} %`}
                strokeWidth={18}
                styles={buildStyles({
                  pathColor: item.color,
                  textColor: item.color,
                  trailColor: "#eee",
                  textSize: "18px",
                })}
              />
            </div>
            <p className="mt-3 font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
