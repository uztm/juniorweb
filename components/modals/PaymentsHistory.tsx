"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/Services/api/apiService";
import {
  Loader2,
  AlertCircle,
  CreditCard,
  DollarSign,
  XCircle,
  CheckCircle,
  Repeat,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { useStudentContext } from "@/context/StudentContext";
import { useTranslation } from "react-i18next";

type Payment = {
  id: string;
  amount: number;
  aim: string;
  invoiceNumber: string;
  timeTableName: string;
  groupName: string;
  paymentType: string;
  date: number;
  cashier: string;
  canceled: boolean;
};

export function PaymentsHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data } = useStudentContext();

  const studentId = data?.data.student.id;

  const fetch = async () => {
    if (!open) return;
    if (!studentId) return;
    try {
      const res = await api.get(
        `/api/education/v1/junior-app/payment-history/${studentId}`
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPayments(res.data.data);
      } else {
        setError("Ma'lumotlarni olishda xatolik yuz berdi");
      }
    } catch (e) {
      console.log(e);
    } finally {
      () => {
        setLoading(false);
      };
    }
  };
  useEffect(() => {
    fetch();
  }, [open]);

  const formatDate = (timestamp: number) =>
    format(new Date(timestamp), "dd MMM yyyy, HH:mm", { locale: uz });

  const formatAmount = (amount: number) =>
    amount.toLocaleString("uz-UZ", {
      style: "currency",
      currency: "UZS",
      maximumFractionDigits: 0,
    });

  const paymentTypeStyles: Record<
    string,
    { icon: React.ReactNode; color: string; bgColor: string }
  > = {
    naqd: {
      icon: <DollarSign className="w-7 h-7" />,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    card: {
      icon: <CreditCard className="w-7 h-7" />,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    plastik: {
      icon: <CreditCard className="w-7 h-7" />,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    default: {
      icon: <DollarSign className="w-7 h-7 text-gray-400" />,
      color: "text-gray-600",
      bgColor: "bg-gray-300/20",
    },
  };

  function getPaymentTypeProps(type: string) {
    const key = type.toLowerCase();
    return paymentTypeStyles[key] || paymentTypeStyles["default"];
  }
  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={fetch}
          className={`
                flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-md
                transition hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-green-500
                active:scale-95 cursor-pointer min-h-[70px]
              `}
          type="button"
        >
          <div
            className={`w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0`}
          >
            <History className="w-7 h-7" />
          </div>
          <span className="font-semibold text-lg text-gray-800 truncate">
            {t("profile.paymentHistory")}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <DialogHeader className="flex justify-between items-center mb-8">
          <DialogTitle className="text-4xl font-extrabold tracking-tight">
            To‘lovlar tarixi
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-700" />
            <span className="text-blue-700 text-2xl font-semibold">
              Yuklanmoqda...
            </span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20 text-red-600 font-bold gap-3">
            <AlertCircle className="w-9 h-9" />
            {error}
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-semibold text-2xl">
            To‘lovlar topilmadi.
          </div>
        )}

        <div
          className="
            w-full
            flex flex-col sm:flex-row
            sm:flex-wrap sm:justify-start
            gap-6
            overflow-x-auto
            snap-x snap-mandatory
            px-4
            sm:px-0
            py-2
          "
          style={{ scrollSnapType: "x mandatory" }}
        >
          {!loading &&
            !error &&
            payments.map((payment) => {
              const { icon, color, bgColor } = getPaymentTypeProps(
                payment.paymentType
              );
              const isCanceled = payment.canceled;
              const isExpanded = expandedId === payment.id;

              return (
                <div
                  key={payment.id}
                  className={`
                    snap-start
                    flex-shrink-0
                    w-72
                    sm:w-full
                    rounded-2xl
                    transition-transform
                    duration-300
                    bg-white
                    border
                    border-gray-100
                    ${
                      isCanceled
                        ? "opacity-60 line-through border-red-300"
                        : "border-gray-300 "
                    }
                  `}
                >
                  <button
                    aria-expanded={isExpanded}
                    aria-controls={`payment-details-${payment.id}`}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : payment.id)
                    }
                    className="w-full flex flex-row items-center justify-between p-6 cursor-pointer select-none focus:outline-none focus-visible:ring focus-visible:ring-blue-400"
                  >
                    {/* Иконка с кругом */}
                    <div
                      className={`flex items-center justify-center rounded-full w-12 h-12 md:w-16 md:h-16 ${bgColor} flex-shrink-0`}
                      aria-hidden="true"
                    >
                      <span className={color}>{icon}</span>
                    </div>

                    {/* Левый блок с основной инфой */}
                    <div className="flex-1 ml-6 min-w-0">
                      <p
                        className={`text-xs sm:text-xl font-semibold truncate ${
                          isCanceled ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {formatDate(payment.date)}
                      </p>
                      <p
                        className={`text-[10px] sm:text-lg mt-1 truncate ${
                          isCanceled ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {payment.aim} • {payment.groupName}
                      </p>
                      <p className="text-[10px] sm:text-sm text-gray-400 truncate mt-1">
                        Faktura № {payment.invoiceNumber}
                      </p>
                    </div>

                    {/* Справа сумма и статус */}
                    <div className="flex flex-col items-end ml-6 min-w-[130px]">
                      <p
                        className={`text-lg sm:text-2xl lg:text-3xl font-extrabold ${
                          isCanceled ? "text-red-600" : color
                        }`}
                      >
                        {formatAmount(payment.amount)}
                      </p>

                      <Badge
                        variant={isCanceled ? "destructive" : "outline"}
                        className="mt-3 flex items-center gap-2 px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide"
                      >
                        {isCanceled ? (
                          <>
                            <XCircle className="w-5 h-5" />
                            Bekor qilingan
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Tasdiqlangan
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Стрелка аккордеона */}
                    <svg
                      className={`ml-6 w-6 h-6 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Разворачивающийся блок с деталями */}
                  {isExpanded && (
                    <div
                      id={`payment-details-${payment.id}`}
                      className="px-6 pb-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl text-gray-700 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Soat jadvali
                          </p>
                          <p className="mt-1 text-base">
                            {payment.timeTableName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            To‘lov turi
                          </p>
                          <p className="mt-1 text-base capitalize">
                            {payment.paymentType}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Kassir
                          </p>
                          <p className="mt-1 text-base">{payment.cashier}</p>
                        </div>
                      </div>

                      {!isCanceled && (
                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2"
                          onClick={() =>
                            alert("To‘lovni qayta amalga oshirish")
                          }
                          aria-label={`To‘lovni qayta amalga oshirish: ${
                            payment.aim
                          }, ${formatAmount(payment.amount)}`}
                        >
                          <Repeat className="w-5 h-5" />
                          To‘lovni qayta amalga oshirish
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
