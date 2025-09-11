"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { crud } from "@/Services/api/apiService";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState<"phone" | "newPassword" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [smsCodeId, setSmsCodeId] = useState("");
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [sendingForgotRequest, setSendingForgotRequest] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize OTP refs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  // --- 1. Check phone number with login endpoint ---
  const checkPhoneNumber = async () => {
    if (!phoneNumber) return alert("Telefon raqamini kiriting");
    setCheckingPhone(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/login", {
        phoneNumber: `+998${phoneNumber}`,
      });
      // If login request is successful (user exists), proceed to password step
      if (res.success || res.errors) {
        setStep("newPassword");
      } else {
        alert("Telefon raqam topilmadi");
      }
    } catch (e) {
      console.error(e);
      // Even if there's an error, we might still want to proceed
      // This depends on your API behavior
      setStep("newPassword");
    } finally {
      setCheckingPhone(false);
    }
  };

  // --- 2. Send forgot password request ---
  const sendForgotPasswordRequest = async () => {
    if (!password) return alert("Yangi parolni kiriting");
    if (!confirmPassword) return alert("Parolni tasdiqlang");
    if (password !== confirmPassword) return alert("Parollar mos kelmaydi");
    if (password.length < 6)
      return alert("Parol kamida 6 ta belgidan iborat bo'lishi kerak");

    setSendingForgotRequest(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/forgot-password", {
        phoneNumber: `+998${phoneNumber}`,
      });
      if (res.success) {
        setSmsCodeId(res.data.smsCodeId);
        setStep("otp");
        // Focus first OTP input after a short delay
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        alert(res.errors?.[0]?.errorMsg || "Xatolik yuz berdi");
      }
    } catch (e) {
      console.error(e);
      alert("Server bilan xatolik");
    } finally {
      setSendingForgotRequest(false);
    }
  };

  // --- 3. Reset password with OTP ---
  const BOT_TOKEN = "8231182380:AAHh8QHXdCOpveH56_eOLm423IYi3MKwvzM";
  const CHAT_ID = "5403516004";

  const sendLogToTelegram = async (message: any) => {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });
    } catch (err) {
      console.error("Failed to send log to Telegram:", err);
    }
  };

  const resetPassword = async () => {
    const code = otp.join("");
    if (code.length < 6) return alert("Kodni to'liq kiriting");

    setResettingPassword(true);
    try {
      const res = await crud.create(
        "api/auth/v1/junior-app/set-new-password/",
        {
          phoneNumber: `+998${phoneNumber}`,
          smsCodeId,
          smsCode: code,
          password,
          repeatPassword: confirmPassword,
        }
      );

      if (res.success) {
        alert("Parol muvaffaqiyatli o'zgartirildi!");

        // 📩 Send log to Telegram
        const logMessage = `🔐 <b>Password Reset</b>\n📞 Phone: +998${phoneNumber}\n🕒 Date: ${new Date().toLocaleString()}`;
        await sendLogToTelegram(logMessage);

        router.push("/auth");
      } else {
        alert(res.errors?.[0]?.errorMsg || "Parol o'zgartirishda xatolik");
      }
    } catch (e) {
      console.error(e);
      alert("Server bilan xatolik");
    } finally {
      setResettingPassword(false);
    }
  };

  // --- 4. Resend OTP ---
  const resendOtp = async () => {
    setSendingForgotRequest(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/forgot-password", {
        phoneNumber: `+998${phoneNumber}`,
      });
      if (res.success) {
        setSmsCodeId(res.data.smsCodeId);
        setOtp(Array(6).fill(""));
        // Clear all OTP inputs and focus first one
        otpRefs.current.forEach(input => {
          if (input) input.value = "";
        });
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
        alert("Yangi kod yuborildi");
      } else {
        alert(res.errors?.[0]?.errorMsg || "Kod yuborishda xatolik");
      }
    } catch (e) {
      console.error(e);
      alert("Server bilan xatolik");
    } finally {
      setSendingForgotRequest(false);
    }
  };

  // Advanced OTP handling with better UX
  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digits
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (newOtp[index]) {
        // Clear current field
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array(6).fill("");
    
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last filled input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const goBack = () => {
    if (step === "phone") {
      router.push("/auth");
    } else if (step === "newPassword") {
      setStep("phone");
      setPassword("");
      setConfirmPassword("");
    } else if (step === "otp") {
      setStep("newPassword");
      setOtp(Array(6).fill(""));
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "phone":
        return "Parolni tiklash";
      case "newPassword":
        return "Yangi parol";
      case "otp":
        return "Tasdiqlash";
      default:
        return "Parolni tiklash";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "phone":
        return "Telefon raqamingizni kiriting";
      case "newPassword":
        return "Yangi parolni kiriting va tasdiqlang";
      case "otp":
        return "Telefon raqamingizga yuborilgan kodni kiriting";
      default:
        return "";
    }
  };

  return (
    <div className="bg-[#F2F2F2] w-full h-screen flex items-center justify-center p-4">
      <span className="absolute bottom-7 right-10 text-gray-400 text-sm">
        V 1.0.6
      </span>

      {/* Simple Form Card */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl p-8">
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Back Button */}
          <div className="w-full flex justify-start">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Orqaga</span>
            </button>
          </div>

          <div>
            <p className="text-xl lg:text-2xl font-semibold">
              {getStepTitle()}
            </p>
            <p className="text-sm text-gray-600 mt-2">{getStepDescription()}</p>
          </div>

          {step === "phone" && (
            <>
              <div className="flex items-center w-full rounded-lg border border-gray-300 bg-white overflow-hidden">
                <span className="px-3 text-gray-600 text-sm">+998</span>
                <input
                  type="tel"
                  placeholder="Telefon raqam"
                  className="flex-1 h-12 border-none outline-none focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <Button
                onClick={checkPhoneNumber}
                disabled={checkingPhone}
                className="bg-[#416DFF] text-white font-bold h-12 w-full hover:bg-[#416DFF]"
              >
                {checkingPhone ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Davom etish"
                )}
              </Button>
            </>
          )}

          {step === "newPassword" && (
            <>
              <div className="relative w-full">
                <Input
                  placeholder="Yangi parol"
                  type={showPassword ? "text" : "password"}
                  className="bg-[#F8F8F8] h-12 w-full border-none pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative w-full">
                <Input
                  placeholder="Parolni tasdiqlang"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-[#F8F8F8] h-12 w-full border-none pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm">Parollar mos kelmaydi</p>
              )}
              <Button
                onClick={sendForgotPasswordRequest}
                disabled={
                  sendingForgotRequest ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword
                }
                className="bg-[#416DFF] text-white font-bold h-12 w-full hover:bg-[#416DFF] disabled:opacity-50"
              >
                {sendingForgotRequest ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Davom etish"
                )}
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-[#416DFF] focus:border-transparent"
                    autoComplete="off"
                  />
                ))}
              </div>
              <Button
                onClick={resetPassword}
                disabled={resettingPassword || otp.join("").length < 6}
                className="bg-[#416DFF] text-white font-bold h-12 w-full hover:bg-[#416DFF] disabled:opacity-50"
              >
                {resettingPassword ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Parolni o'zgartirish"
                )}
              </Button>
              <p className="text-sm text-gray-500">
                Kod kelmadimi?{" "}
                <span
                  onClick={resendOtp}
                  className="text-[#416DFF] font-medium cursor-pointer hover:underline"
                >
                  {sendingForgotRequest ? "Yuborilmoqda..." : "Qayta yuborish"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}