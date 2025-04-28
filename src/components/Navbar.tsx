import React from "react";

import Link from "next/link";
import Image from "next/image";
import { User, User2, User2Icon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full p-5">
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
          <ul className="flex space-x-4 justify-center items-center">
            <li>
              <Link
                href="/pricing"
                className="p-4 rounded-4xl text-xl hover:bg-gray-700 transition duration-300"
              >
                Fiyatlandırma
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className="p-4 flex justify-center items-center gap-1 rounded-4xl text-xl hover:bg-gray-700 transition duration-300"
              >
                <User2 />
                Kayıt Ol
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
