// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// Supabase will be imported dynamically
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("Oturum alınamadı.");
        router.push("/sign-in");
      } else {
        toast.success("Giriş başarılı!");
        router.refresh(); // Navbar güncellensin
        router.push("/");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin w-12 h-12 flex items-center justify-center text-center" />
    </div>
  );
}
