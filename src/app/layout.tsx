import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Retouchly",
  description: "A simple image retouching tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen ">
        <Navbar />
        <main className="flex-grow">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "",
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </main>
        <Footer />
      </body>
    </html>
  );
}
