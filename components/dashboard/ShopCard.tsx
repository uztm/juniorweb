import { Store } from "lucide-react";
import React from "react";

interface ShopCardProps {
  title: string;
  onClick?: () => void;
}

export default function ShopCard({ title, onClick }: ShopCardProps) {
  return (
    <a
      href="/dashboard/market"
      className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
          <Store className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Tap to explore the store
        </p>

        <button className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 hover:underline">
          Visit Shop →
        </button>
      </div>
    </a>
  );
}
