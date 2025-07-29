"use client";

import { Star } from "lucide-react";


export default function ReytingCard({ className = "" }) {
  return (
    <div className={`bg-[#dceaff] rounded-xl p-6 flex items-center gap-4 shadow-sm ${className}`}>
      <div className="text-blue-500 text-4xl">
        <Star />
      </div>
      <div>
        <p className="text-3xl font-bold text-black">50</p>
        <p className="text-blue-600 font-medium">Reyting</p>
      </div>
    </div>
  );
}
