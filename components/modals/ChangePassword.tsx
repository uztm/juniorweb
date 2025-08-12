"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendSms = async () => {
    setLoading(true);
    try {
      // API chaqiruvi (SMS yuborish)
      await new Promise((res) => setTimeout(res, 1000)); // demo kechikish
      setStep(2);
    } catch (err) {
      console.error("SMS yuborishda xatolik", err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      // API chaqiruvi (OTP tekshirish)
      await new Promise((res) => setTimeout(res, 1000));
      if (otp === "1234") {
        // demo tekshiruv
        setStep(3);
      } else {
        alert("Kod noto‘g‘ri");
      }
    } catch (err) {
      console.error("Kod tekshirishda xatolik", err);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (password !== confirmPassword) {
      alert("Parollar mos kelmayapti");
      return;
    }
    setLoading(true);
    try {
      // API chaqiruvi (parolni o‘zgartirish)
      await new Promise((res) => setTimeout(res, 1000));
      alert("Parol muvaffaqiyatli o‘zgartirildi");
      setOpen(false);
      setStep(1);
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Parol o‘zgartirishda xatolik", err);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`
                flex items-center gap-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-md
                transition hover:shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500
                active:scale-95 cursor-pointer min-h-[70px]
              `}
          type="button"
        >
          <div
            className={`w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0`}
          >
            <KeyRound className="w-7 h-7" />
          </div>
          <span className="font-semibold text-lg text-gray-800 truncate">
            {t("profile.changePassword")}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 1 && "Parolni tiklash"}
            {step === 2 && "SMS kodni kiriting"}
            {step === 3 && "Yangi parolni o‘rnating"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Parolni tiklash uchun telefoningizga SMS kod yuboramiz.
            </p>
            <Button
              onClick={sendSms}
              disabled={loading}
              className="w-full bg-primary"
            >
              {loading ? "Yuborilmoqda..." : "Keyingisi"}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              placeholder="SMS kodni kiriting"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-lg"
            />
            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length === 0}
              className="w-full bg-primary"
            >
              {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Yangi parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Parolni tasdiqlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              onClick={changePassword}
              disabled={loading || !password || !confirmPassword}
              className={cn(
                "w-full",
                password && confirmPassword ? "bg-primary" : "bg-gray-300"
              )}
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
