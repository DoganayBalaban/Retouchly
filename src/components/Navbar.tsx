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
              <a className="bg-white text-black text-xl p-4 rounded-4xl hover:bg-gray-200 transition cursor-pointer flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
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
