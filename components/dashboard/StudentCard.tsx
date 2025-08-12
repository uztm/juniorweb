"use client";

import { useStudentContext } from "@/context/StudentContext";
import React from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Phone, BookOpenCheck, CalendarDays, Clock, Star, TrendingUp, Award, Target, CheckCircle2, XCircle, User } from 'lucide-react';

export default function StudentCard() {
  const { data, loading, phone } = useStudentContext();

  if (loading || !data) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border border-gray-200 bg-white shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-full sm:w-64"></div>
                  <div className="h-4 bg-gray-200 rounded w-full sm:w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-full sm:w-32"></div>
                </div>
                <div className="w-full sm:w-24 h-16 bg-gray-200 rounded-lg"></div>
              </div>
              {/* Stats skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              {/* Progress skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    student,
    lesson,
    group,
    activeCoin,
    lessonStartTime,
    lessonEndTime,
    attendanceAveragePercent,
    moduleBarchart,
  } = data.data;

  const formatDate = (dateArr: [number, number, number]) => {
    const [year, month, day] = dateArr;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getAttendanceStatus = (attendance: string) => {
    return attendance === "ABSENT" 
      ? { variant: "destructive" as const, icon: XCircle, text: "Absent" }
      : { variant: "default" as const, icon: CheckCircle2, text: "Present" };
  };

  const attendanceStatus = getAttendanceStatus(lesson.attendance);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {student.photoId ? (
                <div className="relative">
                  <Image
                    src={`https://your-image-url/${student.photoId}`}
                    alt="Student"
                    width={80}
                    height={80}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm">
                    <div className="w-full h-full rounded-full bg-green-500"></div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-semibold shadow-md">
                    {student.fullName[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm">
                    <div className="w-full h-full rounded-full bg-green-500"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <span className="truncate">{student.fullName}</span>
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1 sm:mt-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{phone}</span>
                </p>
              </div>
              
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1 text-sm font-medium w-fit">
                {group}
              </Badge>
            </div>

            {/* Coins */}
            <div className="w-full sm:w-auto">
              <div className="bg-gray-900 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">{activeCoin}</span>
                </div>
                <p className="text-xs font-medium text-gray-300">Active Coins</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                    <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lesson Date</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{formatDate(lesson.lessonDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shadow-sm ${
                    attendanceStatus.variant === "destructive" 
                      ? "bg-red-600" 
                      : "bg-green-600"
                  }`}>
                    <attendanceStatus.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attendance</p>
                    <p className={`text-sm sm:text-base font-semibold truncate ${
                      attendanceStatus.variant === "destructive" ? "text-red-600" : "text-green-600"
                    }`}>
                      {attendanceStatus.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Start Time</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{lessonStartTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">End Time</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{lessonEndTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Average */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Attendance Average</h3>
                    <p className="text-sm text-gray-600">Overall performance metric</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {attendanceAveragePercent}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Success Rate</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress 
                  value={attendanceAveragePercent} 
                  className="h-3 sm:h-4 bg-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Progress */}
          <Card className="border border-gray-200 bg-gray-50 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Module Progress</h3>
                  <p className="text-sm text-gray-600">Track your learning journey</p>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {moduleBarchart.map((module, index) => (
                  <div key={module.timeTableId} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                            {module.timeTableName}
                          </h4>
                          <p className="text-xs text-gray-500">Learning Module</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{module.averagePercentage}%</p>
                        <div className="flex items-center gap-1 justify-start sm:justify-end">
                          <Award className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">Progress</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress 
                        value={module.averagePercentage} 
                        className="h-2 sm:h-3 bg-gray-200"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
