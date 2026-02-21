"use client";
import AuthModal from "@/components/AuthModal";
import Configurations from "@/components/text-to-speech/Configurations";
import GeneratedAudio from "@/components/text-to-speech/GeneratedAudio";
import { supabase } from "@/lib/supabase";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TextToSpeechPage = () => {
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
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Text to Speech
        </h1>
        <p className="text-gray-600 text-sm">
          Select voice settings, type text, and generate human-like speech with
          AI.
        </p>
      </div>
      <section className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="w-full lg:w-1/2 max-w-2xl">
          {isAuthenticated ? (
            <Configurations />
          ) : (
            <div className="w-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sign In
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  You need to sign in to use the AI text-to-speech feature.
                </p>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        <main className="w-full lg:w-1/2 flex items-center justify-center">
          <GeneratedAudio />
        </main>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          window.location.reload(); // Reload page
        }}
      />
    </div>
  );
};

export default TextToSpeechPage;
