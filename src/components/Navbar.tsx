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

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) setUser(data.user);
      setLoading(false);
    })();
  }, []);

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Log Out Error:", error.message);
    } else {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header className="w-full bg-[#030304] p-2">
      <nav className="flex items-center justify-between p-4 text-white">
        {/* Logo + Sol Menü */}
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
        </div>

        {/* Sağ Menü */}
        <div className="flex items-center space-x-4">
          {!loading && !user && (
            <>
              <SignUpDialog />
              <SignInDialog />
            </>
          )}

          {user && (
            <button
              onClick={handleLogOut}
              className="p-2 hover:text-red-400 transition"
              title="Çıkış Yap"
            >
              <LogOut />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
