"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import SignUpDialog from "./SignUpDialog";
import SignInDialog from "./SignInDialog";
import toast from "react-hot-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
    <header className="w-full bg-[#121212] px-4 py-3">
      <nav className="mx-auto max-w-7xl flex items-center justify-between text-white relative">
        {/* Sol: Hamburger mobilde */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-gray-700"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Sol: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo2.png" alt="logo" width={40} height={40} />
          {!isMobile && <span className="text-2xl font-bold">RETOUCHLY</span>}
        </Link>

        {/* Orta: Desktop'da Fiyatlandırma ve Araçlar menüsü */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-white text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
            >
              Fiyatlandırma
            </Link>

            {/* Araçlar dropdown */}
            <div className="relative group">
              <button className="text-white text-base p-3 rounded-xl hover:bg-[#1A1A1A]">
                Araçlar
              </button>
              <div className="absolute hidden group-hover:block bg-[#121212] border border-gray-700 rounded shadow-md mt-1 w-48 z-50">
                <Link
                  href="/image-generation"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Görsel Üretici
                </Link>
                <Link
                  href="/face-restoration"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Yüz İyileştirme
                </Link>
                <Link
                  href="/background-remover"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Arka Plan Temizleyici
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sağ: Auth butonları */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <SignInDialog />
              <SignUpDialog />
            </>
          ) : (
            <>
              {!isMobile && (
                <Link
                  href="/history"
                  className="text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
                >
                  Geçmiş
                </Link>
              )}
              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 p-2 rounded hover:text-red-400"
              >
                Çıkış Yap <LogOut />
              </button>
            </>
          )}
        </div>

        {/* Mobilde Menü Açılır */}
        {menuOpen && isMobile && (
          <div className="absolute top-full left-0 w-full bg-[#121212] border-t border-gray-700 p-4 z-50">
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/pricing"
                  className="block px-2 py-1 hover:bg-gray-700 rounded"
                >
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link
                  href="/image-generation"
                  className="block px-2 py-1 hover:bg-gray-700 rounded"
                >
                  Görsel Üretici
                </Link>
              </li>
              <li>
                <Link
                  href="/face-restoration"
                  className="block px-2 py-1 hover:bg-gray-700 rounded"
                >
                  Yüz İyileştirme
                </Link>
              </li>
              <li>
                <Link
                  href="/background-remover"
                  className="block px-2 py-1 hover:bg-gray-700 rounded"
                >
                  Arka Plan Temizleyici
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    href="/history"
                    className="block px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Geçmiş
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
