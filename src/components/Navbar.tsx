import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="flex justify-between items-center p-4 bg-[#030304] text-white">
        <Link
          href="/"
          className="text-2xl font-thin flex justify-center items-center gap-4"
        >
          <div>
            <Image src="/logo2.png" alt="logo" width={75} height={75} />
          </div>
          <h1 className="text-3xl font-bold tracking-wider">RETOUCHLY</h1>
        </Link>
        <div className="flex space-x-4 justify-center items-center">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/pricing"
                className="p-4 rounded-4xl text-xl hover:bg-gray-700 transition duration-300"
              >
                Fiyatlandırma
              </Link>
            </li>
          </ul>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <a className="bg-white text-black text-xl p-4 rounded-4xl hover:bg-gray-200 transition cursor-pointer">
                Google ile Giriş Yap
              </a>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
