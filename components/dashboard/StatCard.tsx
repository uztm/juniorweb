import { Progress } from "../ui/progress";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string; // Tailwind text color
  bgColor: string; // Tailwind background color
  progress?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor,
  progress,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      {/* Icon & progress */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        {progress !== undefined && (
          <span className="text-xs font-semibold text-gray-500">{progress}%</span>
        )}
      </div>

      {/* Value */}
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      )}
    </div>
  );
}
