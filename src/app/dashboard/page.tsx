"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/sign-in"); // Giriş yoksa yönlendir
      } else {
        setUser(data.user); // Kullanıcı varsa state'e kaydet
      }
      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return <div>Yükleniyor...</div>; // İstersen güzel bir loader koyarsın
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hoş geldin, {user?.email}</p>
    </div>
  );
}
