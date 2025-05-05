"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import SignUpDialog from "./SignUpDialog";
import SignInDialog from "./SignInDialog";
import toast from "react-hot-toast";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Auth değişimlerini dinle
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // İlk mount anında kullanıcıyı kontrol et
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    })();
  }, []);

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Log Out Error:", error.message);
    } else {
      toast.success("Başarıyla çıkış yapıldı.");
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header className="w-full bg-[#030304] p-2">
      <nav className="flex items-center justify-between p-4 text-white">
        {/* Sol - Logo + Fiyatlandırma */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-4 text-2xl font-thin">
            <Image src="/logo2.png" alt="logo" width={75} height={75} />
            <h1 className="text-3xl font-bold tracking-wider">RETOUCHLY</h1>
          </Link>

          <Link
            href="/pricing"
            className="rounded-4xl p-4 text-xl transition duration-300 hover:bg-gray-700"
          >
            Fiyatlandırma
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="rounded-4xl p-4 text-xl transition duration-300 hover:bg-gray-700"
            >
              Getting started
            </Link>
          )}
        </div>

        {/* Sağ - Auth alanı */}
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogOut}
              className="p-2 hover:text-red-400 transition"
              title="Çıkış Yap"
            >
              <LogOut />
            </button>
          ) : (
            <>
              <SignUpDialog />
              <SignInDialog />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
