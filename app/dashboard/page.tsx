"use client";

import React, { useEffect, useState } from "react";
import SummaryReport from "@/components/dashboard/summaryReport";
import { DashboardCalendar } from "@/components/dashboard/dashboardCalendar";
import ReytingCard from "@/components/dashboard/ReytingCard";
import CoinCard from "@/components/dashboard/CoinCard";
import { auth } from "@/lib/auth";
import { api } from "@/Services/api/apiService";
import { LessonResponse } from "@/types/StudentInfo";
import { Newspaper } from "lucide-react";
import { DashboardLessons } from "@/components/dashboard/lessons";
import { Skeleton } from "@/components/ui/skeleton";
import HomeTasks from "@/components/dashboard/homeTasks";

export default function Page() {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedId = auth.getStudentId();
    if (storedId) {
      setId(storedId);
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
    <div className="w-full min-h-screen p-5 flex flex-col gap-5">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-5 items-stretch">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-5">
          {loading ? (
            <Skeleton className="w-full h-32 rounded-xl" />
          ) : (
            data && (
              <SummaryReport
                attandanceAveragePercent={data.data.attendanceAveragePercent}
              />
            )
          )}

          <div className="flex flex-col sm:flex-row gap-5">
            {loading ? (
              <Skeleton className="flex-1 h-24 rounded-xl" />
            ) : (
              <ReytingCard className="flex-1 h-full" />
            )}

            {loading ? (
              <Skeleton className="flex-1 h-24 rounded-xl" />
            ) : (
              data && (
                <CoinCard
                  coin={data.data.activeCoin}
                  className="flex-1 h-full"
                />
              )
            )}
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="lg:w-[340px] w-full">
          <div className="h-full flex flex-col">
            {loading ? (
              <Skeleton className="h-[400px] w-full rounded-xl" />
            ) : (
              <DashboardCalendar className="flex-1 h-full min-h-[100%]" />
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-5 items-stretch">
        {/* News Card */}
        <div className="flex-1 flex flex-col gap-5">
          {loading ? (
            <Skeleton className="w-full h-32 rounded-xl" />
          ) : (
            <div className="w-full h-full bg-white rounded-xl shadow-sm flex items-center justify-center">
              <div className="flex items-center justify-center gap-4">
                <Newspaper size={38} color="#00BEC1" />
                <p className="text-2xl font-bold text-[#00BEC1]">
                  So’nggi <br /> Yangiliklar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Lessons */}
        <div className="lg:w-[340px] w-full">
          <div className="h-full flex flex-col">
            {loading ? (
              <Skeleton className="h-[300px] w-full rounded-xl" />
            ) : (
              <DashboardLessons className="flex-1 h-full min-h-[100%]" />
            )}
          </div>
        </div>
      </div>

      <p className=" font-bold text-2xl">Home tasks</p>
      <HomeTasks />
      <HomeTasks />
      <HomeTasks />
      <HomeTasks />
      <HomeTasks />
      <HomeTasks />
    </div>
  );
}
