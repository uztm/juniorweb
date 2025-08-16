"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { crud } from "@/Services/api/apiService";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [step, setStep] = useState<"phone" | "password" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [smsCodeId, setSmsCodeId] = useState("");

  const [checkingPhone, setCheckingPhone] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const router = useRouter();

  // --- 1. Check phone number ---
  const checkPhoneNumber = async () => {
    if (!phoneNumber) return alert("Telefon raqamini kiriting");

    setCheckingPhone(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/login", {
        phoneNumber: `+998${phoneNumber}`,
      });

      if (!res.success) {
        const error = res.errors?.[0]?.errorMsg || "Noma’lum xatolik";
        alert("Xatolik: " + error);
      } else {
        console.log("Phone check success:", res.data);
        setStep("password");
      }
    } catch (e) {
      console.error("Phone check error:", e);
      alert("Xatolik yuz berdi");
    } finally {
      setCheckingPhone(false);
    }
  };

  // --- 2. Enter password ---
  const enterPassword = async () => {
    if (!password) return alert("Parolni kiriting");

    setCheckingPassword(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/enter-password", {
        phoneNumber: `+998${phoneNumber}`,
        password,
      });

      if (!res.success) {
        const error = res.errors?.[0]?.errorMsg || "Parol xato";
        alert("Xatolik: " + error);
      } else {
        console.log("Password accepted:", res.data);
        setSmsCodeId(res.data.smsCodeId);
        setStep("otp");
      }
    } catch (e) {
      console.error("Password error:", e);
      alert("Parol noto‘g‘ri");
    } finally {
      setCheckingPassword(false);
    }
  };

  // --- 3. Check OTP ---
  const checkOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return alert("Kodni to‘liq kiriting");

    setVerifyingOtp(true);
    try {
      const res = await crud.create("api/auth/v1/junior-app/chek-sms-code", {
        phoneNumber,
        smsCodeId,
        smsCode: code,
      });

      if (!res.success) {
        const error = res.errors?.[0]?.errorMsg || "Kod noto‘g‘ri";
        alert("Xatolik: " + error);
      } else {
        const token = res.data?.token;
        if (token) {
          auth.setToken(token);

          const studentId = res.data?.students?.[0]?.id;
          if (studentId) {
            auth.setStudentInfo({
              id: studentId,
              phoneNumber,
            });
          }

          router.push("/");
        } else {
          alert("Token topilmadi!");
        }
      }
    } catch (e) {
      console.error("OTP error:", e);
      alert("Noto‘g‘ri kod");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="bg-[#F2F2F2] w-full h-screen flex flex-col lg:flex-row p-4 gap-5">

      <span className=" absolute bottom-7 right-10 text-white text-sm">V 1.0.5</span>
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-5">
        <div className="w-full bg-white rounded-2xl flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-5 text-center">
            <img
              src="/assets/logo.png"
              className="w-[60%] max-w-[200px]"
              alt="Logo"
            />
            <p className="text-xl lg:text-2xl font-semibold">Kirish</p>

            {step === "phone" && (
              <>
                <p className="text-sm text-gray-600">
                  Telefon raqamingizni kiriting
                </p>
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

            {step === "password" && (
              <>
                <p className="text-sm text-gray-600">Parolingizni kiriting</p>
                <Input
                  placeholder="Parol"
                  type="password"
                  className="bg-[#F8F8F8] h-12 w-full border-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={enterPassword}
                  disabled={checkingPassword}
                  className="bg-[#416DFF] text-white font-bold h-12 w-full hover:bg-[#416DFF]"
                >
                  {checkingPassword ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Davom etish"
                  )}
                </Button>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="text-sm text-gray-600">
                  Tasdiqlash kodini kiriting
                </p>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-12 text-center text-lg border rounded-md"
                    />
                  ))}
                </div>
                <Button
                  onClick={checkOtp}
                  disabled={verifyingOtp}
                  className="bg-[#416DFF] text-white font-bold h-12 w-full hover:bg-[#416DF9]"
                >
                  {verifyingOtp ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Tasdiqlash"
                  )}
                </Button>
              </>
            )}

            <p className="text-sm text-gray-500">
              Parolni unutdingizmi?{" "}
              <span className="text-[#416DFF] font-medium cursor-pointer">
                Bosing
              </span>
            </p>
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl flex items-center px-5 py-4 gap-4">
          <img
            src="/assets/auth2.png"
            className="w-[60px] sm:w-[80px] lg:w-[25%] h-auto"
            alt="Join us"
          />
          <div className="text-base sm:text-lg lg:text-xl">
            <p className="text-[#000]">Bizni jamoaga qo’shiling</p>
            <p className="text-[#416DFF] font-bold">325+</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-[#416DFF] rounded-2xl flex items-center justify-center p-4">
        <img
          src="/assets/auth.png"
          className="w-[80%] max-w-[400px] md:max-w-[500px] h-auto lg:h-[90%] object-contain"
          alt="Auth Illustration"
        />
      </div>
    </div>
  );
}
