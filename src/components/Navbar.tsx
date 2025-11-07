"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, History } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      toast.success("Successfully logged out.");
      setUser(null);
      router.push("/");
    }
  };

  const getUserInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const tools = [
    { name: "Image Generator", href: "/image-generation" },
    { name: "Face Restoration", href: "/face-restoration" },
    { name: "Background Remover", href: "/background-remover" },
    { name: "Image Editor", href: "/image-overlay" },
  ];

  return (
    <header className="w-full bg-[#121212]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile Menu */}
        {isMobile ? (
          <div className="flex items-center justify-between w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Menu size={24} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#121212] text-white border-r border-white/10 w-[280px]"
              >
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo2.png" alt="logo" width={32} height={32} />
                    <span className="text-xl font-bold">RETOUCHLY</span>
                  </Link>

                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/pricing"
                      className="px-3 py-2 hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
                    >
                      Pricing
                    </Link>

                    <div className="flex flex-col gap-1">
                      <h3 className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Tools
                      </h3>
                      {tools.map((tool) => (
                        <SheetClose asChild key={tool.href}>
                          <Link
                            href={tool.href}
                            className="px-3 py-2 hover:bg-white/10 rounded-md text-sm transition-colors"
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
                          className="px-3 py-2 hover:bg-white/10 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <History size={16} />
                          History
                        </Link>
                      </SheetClose>
                    )}
                  </nav>

                  {user && (
                    <Button
                      variant="ghost"
                      className="justify-start px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleLogOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo2.png" alt="logo" width={36} height={36} />
            </Link>

            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <SignInDialog />
                  <SignUpDialog />
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full hover:bg-white/10 p-0"
                    >
                      <Avatar className="h-9 w-9 border-2 border-white/20">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#1a1a1a] border-white/10 text-white"
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                      <Link href="/history" className="flex items-center gap-2">
                        <History size={16} />
                        History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogOut}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Navigation */
          <>
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo2.png"
                alt="logo"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                RETOUCHLY
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors rounded-md hover:bg-white/10"
                      asChild
                    >
                      <Link href="/pricing">Pricing</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 h-auto font-medium">
                      Tools
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[220px] gap-1 p-2">
                        {tools.map((tool) => (
                          <li key={tool.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={tool.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">
                                  {tool.name}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {!user ? (
                <div className="flex items-center gap-3">
                  <SignInDialog />
                  <SignUpDialog />
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-white/10 p-0 transition-all hover:ring-2 hover:ring-white/20"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.email || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                          {getUserInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#1a1a1a] border-white/10 text-white shadow-xl"
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                      <Link href="/history" className="flex items-center gap-2">
                        <History size={16} />
                        History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogOut}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
