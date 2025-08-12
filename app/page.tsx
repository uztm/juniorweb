"use client";

import { useEffect } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = auth.getToken();
    if (!token) {
      router.push("/auth");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="bg-gray-200 w-full min-h-screen flex items-center justify-center">
      <Loader className="h-10 w-10 animate-spin text-gray-700" />
    </div>
  );
}
