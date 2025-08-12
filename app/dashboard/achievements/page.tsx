"use client";

import React, { useEffect, useState } from "react";

import { Loader2, AlertCircle } from "lucide-react";
import { useStudentContext } from "@/context/StudentContext";
import { api } from "@/Services/api/apiService";

type Achievement = {
  id: string;
  name: string;
  date: string;
  coinsEarned: number;
  description?: string;
};

export default function AchievementsPage() {
  const { data } = useStudentContext();
  const studentId = data?.data.student.id;

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;

    async function fetchAchievements() {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(
          `api/education/v1/student-coin-exchange/get-all-by-student-id/${studentId}`
        );

        if (!res.status || res.status < 200 || res.status >= 300) {
          throw new Error(`Server error: ${res.status}`);
        }

        setAchievements(res.data);
      } catch (err: any) {
        setError(err.message || "Noma'lum xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [studentId]);

  if (!studentId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertCircle className="w-10 h-10 text-red-500 mr-2" />
        <p className="text-lg font-medium text-red-600">
          Talaba ID mavjud emas.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin mr-2" />
        <p className="text-lg font-medium text-gray-700">Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertCircle className="w-10 h-10 text-red-500 mr-2" />
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        <p className="text-xl font-semibold mb-2">
          Hozircha hech qanday yutuq yo'q
        </p>
        <p>O‘qishni davom ettiring va tangalar to‘plang!</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Mening yutuqlarim</h1>
      <ul className="space-y-4">
        {achievements.map(({ id, name, date, coinsEarned, description }) => (
          <li
            key={id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold truncate">{name}</h2>
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            {description && (
              <p className="text-gray-600 mb-2 line-clamp-3">{description}</p>
            )}
            <div className="flex items-center gap-2 font-semibold text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="none"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{coinsEarned} tanga</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
