// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("Oturum alınamadı.");
        router.push("/sign-in");
      } else {
        toast.success("Giriş başarılı!");
        router.refresh(); // Navbar güncellensin
        router.push("/dashboard");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <p className="text-center mt-10">Giriş yapılıyor, lütfen bekleyin...</p>
  );
}
