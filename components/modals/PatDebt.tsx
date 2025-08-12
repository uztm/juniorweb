"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/Services/api/apiService";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStudentContext } from "@/context/StudentContext";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StudentDebtor {
  invoiceId: string;
  leftoverAmount: number;
}

interface PaymentData {
  invoiceId: string;
  mustPaidAmount: number;
  payme?: { link: string };
  click?: { link: string };
  uzum?: { link: string };
  [key: string]: any;
}

export function PayDebts() {
  const { data } = useStudentContext(); // has data?.data.studentDebtors
  const studentDebtors: StudentDebtor[] = data?.data.studentDebtors || [];
  const { t } = useTranslation("common");

  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const promises = studentDebtors.map(async (debtor) => {
        const paymentRes = await api.get(
          `https://adminapi.pdp.uz/api/finance/v1/payment/${debtor.invoiceId}`
        );
        return {
          invoiceId: debtor.invoiceId,
          mustPaidAmount: paymentRes.data.data.invoiceInfo.mustPaidAmount,
          ...paymentRes.data.data,
        } as PaymentData;
      });

      const results = await Promise.all(promises);
      setInvoices(results);
    } catch (err) {
      console.error("Error fetching invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!selectedInvoice || !selectedMethod) return;
    const invoice = invoices.find((i) => i.invoiceId === selectedInvoice);
    const link = invoice?.[selectedMethod as keyof PaymentData]?.link;
    if (link) window.open(link, "_blank");
  };

  useEffect(() => {
    if (open && studentDebtors.length) {
      fetchInvoices();
    }
  }, [open, studentDebtors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`
                flex items-center gap-5 p-5 rounded-2xl bg-white border border-purple-200 shadow-md
                transition hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-purple-500
                active:scale-95 cursor-pointer min-h-[70px]
              `}
          type="button"
        >
          <div
            className={`w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0`}
          >
            <CreditCard className="w-7 h-7" />
          </div>
          <span className="font-semibold text-lg text-gray-800 truncate">
            {t("profile.makePayment")}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Qarzdorliklar</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center">Yuklanmoqda...</p>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div
                key={inv.invoiceId}
                className={cn(
                  "rounded-lg p-4 border cursor-pointer transition",
                  selectedInvoice === inv.invoiceId
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                )}
                onClick={() => {
                  setSelectedInvoice(inv.invoiceId);
                  setSelectedMethod(null);
                }}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">
                    {inv.mustPaidAmount.toLocaleString()} UZS
                  </p>
                  <Badge
                    variant={
                      selectedInvoice === inv.invoiceId ? "default" : "outline"
                    }
                  >
                    Invoice
                  </Badge>
                </div>

                {selectedInvoice === inv.invoiceId && (
                  <div className="mt-3 flex gap-3">
                    {["payme", "click", "uzum"].map((method) => (
                      <div
                        key={method}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMethod(method);
                        }}
                        className={cn(
                          "flex-1 flex items-center justify-center h-12 rounded-lg border transition cursor-pointer bg-white",
                          selectedMethod === method
                            ? "border-primary bg-primary/10"
                            : "border-gray-200"
                        )}
                      >
                        <Image
                          src={`/images/${method}.png`}
                          alt={method}
                          width={70}
                          height={24}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          className="w-full mt-4"
          onClick={handlePay}
          disabled={!selectedInvoice || !selectedMethod}
        >
          Davom etish
        </Button>
      </DialogContent>
    </Dialog>
  );
}
