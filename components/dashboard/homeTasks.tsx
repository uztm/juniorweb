import { Check } from "lucide-react";
import React from "react";

export default function HomeTasks() {
  return (
    <div className=" w-full h-[100px] bg-white shadow-sm rounded-xl flex items-center gap-3 justify-between">
      <div className="h-full flex items-center gap-3 justify-start pl-2">
        <div className="w-3 h-[60%] bg-red-500 rounded-4xl"></div>

        <p className=" text-2xl font-semibold">Paython</p>
      </div>

      <div className="h-full flex items-center gap-3 justify-start pr-2">
        <p>05.07.2025</p>
        <div className=" p-2 bg-green-500 rounded-full ">
          <Check className="w-full h-full text-white" />
        </div>
      </div>
    </div>
  );
}
