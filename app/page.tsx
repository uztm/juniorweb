"use client";

import { useEffect } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="bg-red-200 w-full min-h-screen">
      Bosh sahifa
      <Button onClick={() => auth.removeToken()}>Remove token</Button>
    </div>
  );
}
