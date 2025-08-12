"use client";

import React from "react";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  Coins,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";

import { useStudentContext } from "@/context/StudentContext";
import StatCard from "@/components/dashboard/StatCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import ShopCard from "@/components/dashboard/ShopCard";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/utils/formatMoney";
import { Card, CardContent } from "@/components/ui/card";
import { PayDebtsAlertBtn } from "@/components/modals/AlertPayDebtBtn";

export default function DashboardPage() {
  const { data, loading, phone } = useStudentContext();
  const { t } = useTranslation("common");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">{t("dashboard.noData")}</p>
        </div>
      </div>
    );
  }

  const {
    student,
    lesson,
    activeCoin,
    moduleBarchart,
    attendanceAveragePercent,
    group,
    allDebtor,
  } = data.data;

  const todayLessonDate = lesson?.lessonDate
    ? new Date(
        lesson.lessonDate[0],
        lesson.lessonDate[1] - 1,
        lesson.lessonDate[2]
      )
    : null;

  const totalModuleCoins = moduleBarchart.reduce((sum, m) => sum + m.coins, 0);
  const averagePerformance =
    moduleBarchart.reduce((sum, m) => sum + m.averagePercentage, 0) /
    moduleBarchart.length;

  const maxDebt = data.data.allDebtor;
  const debtPercent = data?.data.allDebtor
    ? Math.min((data.data.allDebtor / maxDebt) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-9xl mx-auto p-6 space-y-8">
        {data && data.data.allDebtor > 0 && (
          <Card
            className="border-l-4 border-red-500 bg-red-50 shadow-md"
            aria-live="polite"
          >
            <CardContent className="flex flex-col md:flex-row justify-between items-center gap-6 p-6">
              <div className="flex items-center gap-5 flex-wrap md:flex-nowrap max-w-full">
                <ShieldAlert className="h-12 w-12 text-red-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-[clamp(1.5rem,2vw,2.5rem)] font-extrabold text-red-700 leading-tight truncate max-w-full">
                    {formatMoney(data.data.allDebtor)} UZS
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-red-600 max-w-lg break-words">
                    {t("dashboard.debtAlert", { count: data.data.allDebtor })}
                  </p>
                  <p className="text-xs sm:text-sm text-red-500 max-w-lg break-words mt-1">
                    {t("dashboard.debtAlertDescription")}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-72">
                <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${debtPercent}%` }}
                    className="bg-red-600 h-3 transition-all duration-500 ease-in-out"
                  />
                </div>
                <PayDebtsAlertBtn/>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hero */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-gray-200  transition-all hover:shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={student.photoId || "https://github.com/shadcn.png"}
                  alt={student.fullName}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center bg-green-500 rounded-full border-2 border-white">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {student.fullName}
                </h1>
                <div className="mt-1 flex flex-col text-sm text-gray-600 gap-1">
                  {phone && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" /> {phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> {group}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{activeCoin}</p>
                <p className="text-sm text-gray-500">
                  {t("dashboard.activeCoins")}
                </p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">
                  {attendanceAveragePercent}%
                </p>
                <p className="text-sm text-gray-500">
                  {t("dashboard.attendance")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        {todayLessonDate && (
          <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="h-6 w-6" /> {t("dashboard.todaysLesson")}
                </h2>
                <p className="text-blue-100">
                  {format(todayLessonDate, "EEEE, dd MMM yyyy")}
                </p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  {/* <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(
                      new Date(`1970-01-01T${lesson.lessonDate}`),
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {format(new Date(`1970-01-01T${lesson.lessonDate}`), "HH:mm")}
                  </span> */}
                  <span className="flex items-center gap-2">
                    <Coins className="h-4 w-4" /> {lesson.coin}{" "}
                    {t("dashboard.coinsEarned")}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    lesson.status === "TUGAGAN"
                      ? "bg-green-500/20 text-white border border-green-400"
                      : lesson.status === "in-progress"
                      ? "bg-yellow-500/20 text-yellow-100 border border-yellow-400"
                      : "bg-gray-200/20 text-gray-700 border border-gray-400"
                  }`}
                >
                  {lesson.status === "TUGAGAN" && (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  {lesson.status.charAt(0).toUpperCase() +
                    lesson.status.slice(1)}
                </span>
                <p className="text-xs mt-2 text-blue-100">
                  {t("dashboard.attendance")}: {lesson.attendance}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ShopCard title="PDP Junior Store" />
          <StatCard
            title={t("dashboard.totalCoinsEarned")}
            value={totalModuleCoins}
            subtitle={t("dashboard.fromModules")}
            icon={Award}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title={t("dashboard.averagePerformance")}
            value={`${Math.round(averagePerformance)}%`}
            subtitle={t("dashboard.acrossSubjects")}
            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-purple-100"
            progress={averagePerformance}
          />
          <StatCard
            title={t("dashboard.attendanceRate")}
            value={`${attendanceAveragePercent}%`}
            subtitle={t("dashboard.thisSemester")}
            icon={CheckCircle2}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
            progress={attendanceAveragePercent}
          />
        </div>

        {/* Modules */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("dashboard.modulePerformance")}
            </h2>
            <span className="text-sm text-gray-500">
              {moduleBarchart.length} active modules
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleBarchart.map((module) => (
              <ModuleCard key={module.timeTableId} module={module} />
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        {/* <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalModuleCoins}
              </p>
              <p className="text-sm text-gray-500">Total Coins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(averagePerformance)}%
              </p>
              <p className="text-sm text-gray-500">Grade Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allDebtor}</p>
              <p className="text-sm text-gray-500">Pending Assignments</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
