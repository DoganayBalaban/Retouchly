// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { LogOut, Menu } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import type { User } from "@supabase/supabase-js";
// import SignUpDialog from "./SignUpDialog";
// import SignInDialog from "./SignInDialog";
// import toast from "react-hot-toast";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import { useIsMobile } from "@/hooks/use-mobile";
// const Navbar = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();
//   const isMobile = useIsMobile();
//   const [menuOpen, setMenuOpen] = useState(false);
//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );
//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     (async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (!error) setUser(data.user);
//     })();
//   }, []);

//   const handleLogOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Log Out Error:", error.message);
//     } else {
//       toast.success("Başarıyla çıkış yapıldı.");
//       setUser(null);
//       router.push("/");
//     }
//   };

//   return (
//     <header className="w-full bg-[#121212] px-4 py-3">
//       <nav className="mx-auto max-w-7xl flex items-center justify-between text-white relative">
//         {/* Sol: Hamburger mobilde */}
//         {isMobile && (
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-2 rounded hover:bg-gray-700"
//             aria-label="Menu"
//           >
//             <Menu size={24} />
//           </button>
//         )}

//         {/* Sol: Logo */}
//         <Link href="/" className="flex items-center gap-3">
//           <Image src="/logo2.png" alt="logo" width={40} height={40} />
//           {!isMobile && <span className="text-2xl font-bold">RETOUCHLY</span>}
//         </Link>

//         {/* Orta: Desktop'da Fiyatlandırma ve Araçlar menüsü */}
//         {!isMobile && (
//           <NavigationMenu className="flex items-center gap-6">
//             <NavigationMenuList>
//               <NavigationMenuItem>
//                 <Link
//                   href="/pricing"
//                   className="text-white text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
//                   legacyBehavior
//                   passHref
//                 >
//                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//                     Fiyatlandırma
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem>

//               {/* Araçlar dropdown */}
//               <NavigationMenuItem className="relative group">
//                 <NavigationMenuTrigger>Araçlar</NavigationMenuTrigger>
//                 <NavigationMenuContent className="absolute hidden group-hover:block bg-[#121212] border border-gray-700 rounded shadow-md mt-1 w-48 z-50">
//                   <Link
//                     href="/image-generation"
//                     className="block px-4 py-2 hover:bg-gray-700"
//                   >
//                     <NavigationMenuLink
//                       className={navigationMenuTriggerStyle()}
//                     >
//                       Görsel Üretici
//                     </NavigationMenuLink>
//                   </Link>
//                   <Link
//                     href="/face-restoration"
//                     className="block px-4 py-2 hover:bg-gray-700"
//                   >
//                     <NavigationMenuLink
//                       className={navigationMenuTriggerStyle()}
//                     >
//                       Yüz İyileştirme
//                     </NavigationMenuLink>
//                   </Link>
//                   <Link
//                     href="/background-remover"
//                     className="block px-4 py-2 hover:bg-gray-700"
//                   >
//                     <NavigationMenuLink
//                       className={navigationMenuTriggerStyle()}
//                     >
//                       Arka Plan Temizleyici
//                     </NavigationMenuLink>
//                   </Link>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//             </NavigationMenuList>
//           </NavigationMenu>
//         )}

//         {/* Sağ: Auth butonları */}
//         <div className="flex items-center gap-3">
//           {!user ? (
//             <>
//               <SignInDialog />
//               <SignUpDialog />
//             </>
//           ) : (
//             <>
//               {!isMobile && (
//                 <Link
//                   href="/history"
//                   className="text-base hover:bg-[#1A1A1A] p-3 rounded-xl"
//                 >
//                   Geçmiş
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogOut}
//                 className="flex items-center gap-2 p-2 rounded hover:text-red-400"
//               >
//                 Çıkış Yap <LogOut />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Mobilde Menü Açılır */}
//         {menuOpen && isMobile && (
//           <div className="absolute top-full left-0 w-full bg-[#121212] border-t border-gray-700 p-4 z-50">
//             <ul className="flex flex-col gap-4">
//               <li>
//                 <Link
//                   href="/pricing"
//                   className="block px-2 py-1 hover:bg-gray-700 rounded"
//                 >
//                   Fiyatlandırma
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/image-generation"
//                   className="block px-2 py-1 hover:bg-gray-700 rounded"
//                 >
//                   Görsel Üretici
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/face-restoration"
//                   className="block px-2 py-1 hover:bg-gray-700 rounded"
//                 >
//                   Yüz İyileştirme
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/background-remover"
//                   className="block px-2 py-1 hover:bg-gray-700 rounded"
//                 >
//                   Arka Plan Temizleyici
//                 </Link>
//               </li>
//               {user && (
//                 <li>
//                   <Link
//                     href="/history"
//                     className="block px-2 py-1 hover:bg-gray-700 rounded"
//                   >
//                     Geçmiş
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

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

  const tools = [
    { name: "Görsel Üretici", href: "/image-generation" },
    { name: "Yüz İyileştirme", href: "/face-restoration" },
    { name: "Arka Plan Temizleyici", href: "/background-remover" },
  ];

  return (
    <header className="w-full bg-[#121212] px-4 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between text-black">
        {/* Mobile Menu */}
        {isMobile ? (
          <div className="flex items-center justify-between w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu size={24} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#121212] text-white border-r border-gray-200"
              >
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo2.png" alt="logo" width={32} height={32} />
                    <span className="text-xl font-bold ">RETOUCHLY</span>
                  </Link>

                  <nav className="flex flex-col gap-4 ">
                    <Link
                      href="/pricing"
                      className="px-2 py-2 hover:bg-gray-100 rounded-md text-white hover:text-[#121212]"
                    >
                      Fiyatlandırma
                    </Link>

                    <div className="flex flex-col gap-1">
                      <h3 className="px-2 font-medium mb-1 text-white ">
                        Araçlar
                      </h3>
                      {tools.map((tool) => (
                        <SheetClose asChild key={tool.href}>
                          <Link
                            href={tool.href}
                            className="px-4 py-2 hover:bg-gray-100 rounded-md text-sm text-white hover:text-[#121212]"
                          >
                            {tool.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    {user && (
                      <SheetClose asChild>
                        <Link
                          href="/history"
                          className="px-2 py-2 hover:bg-gray-100 rounded-md text-white hover:text-[#121212]"
                        >
                          Geçmiş
                        </Link>
                      </SheetClose>
                    )}
                  </nav>

                  {user && (
                    <Button
                      variant="ghost"
                      className="justify-start px-2 text-red-600 hover:text-red-700 hover:bg-gray-100"
                      onClick={handleLogOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo2.png" alt="logo" width={40} height={40} />
            </Link>

            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <SignInDialog />
                  <SignUpDialog />
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                  onClick={handleLogOut}
                >
                  <LogOut size={20} />
                  <span className="sr-only">Çıkış Yap</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Navigation */
          <>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo2.png" alt="logo" width={40} height={40} />
              <span className="text-2xl font-bold text-white">RETOUCHLY</span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="">
                <NavigationMenuItem className="">
                  <Link href="/pricing" passHref>
                    <NavigationMenuLink className="bg-[#121212] text-white">
                      Fiyatlandırma
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-[#121212] text-white">
                    Araçlar
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {tools.map((tool) => (
                        <li key={tool.href}>
                          <NavigationMenuLink asChild className="">
                            <Link
                              href={tool.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 text-black focus:bg-gray-100"
                            >
                              {tool.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <SignInDialog />
                  <SignUpDialog />
                </>
              ) : (
                <>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <Link href="/history" legacyBehavior passHref>
                          <NavigationMenuLink className="bg-[#121212] text-white">
                            Geçmiş
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    onClick={handleLogOut}
                  >
                    Çıkış Yap <LogOut size={16} />
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
