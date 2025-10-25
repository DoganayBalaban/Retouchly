"use client";
import HowToUse from "@/components/image-generation/HowToUse";
import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Fotoğraf Oluşturucu
        </h1>
        <p className="text-gray-600 text-sm">
          Fotoğraf oluşturmak için kullanılacak ayarları seçin ve fotoğrafı
          oluşturun.
        </p>
      </div>
      <section className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="w-full lg:w-1/2 max-w-2xl">
          {isAuthenticated ? (
            <Configurations />
          ) : (
            <div className="w-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Giriş Yapın
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  AI görsel üretme özelliğini kullanmak için giriş yapmanız
                  gerekiyor
                </p>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          )}
        </div>

        <main className="w-full lg:w-1/2 flex items-center justify-center">
          <GeneratedImages />
        </main>
      </section>
      <div className="mt-12">
        <HowToUse />
      </div>

      <AuthModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          window.location.reload(); // Sayfayı yenile
        }}
      />
    </div>
  );
};

export default page;
