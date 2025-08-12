"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  History,
  KeyRound,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useStudentContext } from "@/context/StudentContext";
import { formatMoney } from "@/utils/formatMoney";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { PaymentsHistory } from "@/components/modals/PaymentsHistory";
import { PayDebts } from "@/components/modals/PatDebt";
import { PayDebtsAlertBtn } from "@/components/modals/AlertPayDebtBtn";
import { ChangePasswordModal } from "@/components/modals/ChangePassword";

export default function ProfilePage() {
  const { data } = useStudentContext();
  const { t } = useTranslation("common");

  const maxDebt = 1_000_000;
  const debtPercent = data?.data.allDebtor
    ? Math.min((data.data.allDebtor / maxDebt) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Debt alert */}
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
                <PayDebtsAlertBtn />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="flex flex-col lg:flex-row items-center gap-10 p-8">
            <Avatar className="w-28 h-28 border-4 border-gray-300 shadow-md flex-shrink-0">
              <AvatarImage
                src={
                  data?.data.student.photoId
                    ? `/api/photo/${data.data.student.photoId}`
                    : undefined
                }
                alt={data?.data.student.fullName}
              />
              <AvatarFallback className="text-4xl font-extrabold bg-gray-200 text-gray-700">
                {data?.data.student.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-grow min-w-0">
              <h1
                className="text-[clamp(1.75rem,3vw,3rem)] font-bold text-gray-900 leading-tight truncate"
                title={data?.data.student.fullName}
              >
                {data?.data.student.fullName}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-gray-600 font-medium text-base sm:text-lg truncate">
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{data?.data.group}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
          <ChangePasswordModal />
          <PaymentsHistory />
          <PayDebts />
        </div>
      </div>
    </div>
  );
}
