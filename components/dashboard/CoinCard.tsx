"use client";

import { Coins } from "lucide-react";

type CoinCardProps = {
  className?: string;
  coin: number;
};

export default function CoinCard({ className, coin }: CoinCardProps) {
  return (
    <div
      className={`bg-[#ffb923] rounded-xl p-6 flex items-center gap-4 shadow-sm ${className}`}
    >
      <div className="text-white text-4xl bg-[#f7a900] p-3 rounded-full">
        <Coins />
      </div>
      <div>
        <p className="text-3xl font-bold text-black">{coin}</p>
        <p className="text-black font-medium">Coins</p>
      </div>
    </div>
  );
}
