"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";
import { Loader } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/sign-in");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Görsel Yükle</h1>
      <ImageUploader />
    </div>
  );
}
