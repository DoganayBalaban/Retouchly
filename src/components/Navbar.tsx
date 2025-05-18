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
    <header className="w-full bg-[#121212 ] px-6 py-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between text-white">
        {/* Sol: Logo + Linkler */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
            <span className="text-2xl font-bold">RETOUCHLY</span>
          </Link>

          <Link
            href="/pricing"
            className="text-white text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
          >
            Fiyatlandırma
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base bg-black">
                  Araçlar
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white text-black p-4 rounded shadow-md ">
                  <ul className="grid gap-3 w-full">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/image-generation">Görsel Üretici</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/face-restoration">Yüz İyileştirme</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/background-remover">
                          Arka Plan Temizleyici
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Sağ: Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/history"
                className="text-white text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
              >
                Geçmiş
              </Link>
              <button
                onClick={handleLogOut}
                className="p-2 text-white transition hover:text-red-400 flex items-center gap-2  rounded-xl"
                title="Çıkış Yap"
              >
                Çıkış Yap
                <LogOut />
              </button>
            </>
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
