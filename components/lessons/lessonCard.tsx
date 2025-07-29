import React from "react";
import { Card } from "../ui/card";
import { Calendar } from "lucide-react";

export default function LessonCard() {
  return (
    <div className="flex items-center justify-start w-full bg-white p-2 rounded-lg shadow-md gap-4">
      <div className="w-1/8 flex flex-col items-center justify-center">
        <div className="bg-[#F0F6FF] p-2 rounded-xl">
          <Calendar className="h-8 w-8 text-[#416DFF]" />
        </div>

        <p className=" text-sm font-semibold">30-iyun</p>
        <p className=" text-sm font-light text-muted-foreground">13:00</p>
      </div>
      <div className="w-6/8 gap-1 flex flex-col">
        <p className=" font-bold text-xl text-[#416DFF]">Frontend</p>
        <p className=" text-sm text-muted-foreground">HTML va CSS asoslari , mening birinchi proyektim!</p>
        <p className=" font-semibold">Mentor ismi</p>
      </div>
    </div>
  );
}
