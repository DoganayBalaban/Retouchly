"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email adresi bulunamadı");
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    setResending(false);

    if (error) {
      toast.error("Email gönderilemedi. Lütfen tekrar deneyin.");
      console.error("Resend Error:", error.message);
    } else {
      toast.success("Doğrulama emaili tekrar gönderildi!");
      setCountdown(60); // 60 saniye beklet
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-card">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Email Adresinizi Doğrulayın</h1>
            <p className="text-muted-foreground">
              Kayıt işleminiz başarıyla tamamlandı!
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <p className="text-sm text-center">
            <span className="font-semibold">{email || "Email adresinize"}</span>{" "}
            bir doğrulama maili gönderdik.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Hesabınızı aktifleştirmek için lütfen mailinizi kontrol edin ve
            doğrulama linkine tıklayın. Ardından tekrar giriş yapın.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendEmail}
            disabled={resending || countdown > 0}
          >
            {resending
              ? "Gönderiliyor..."
              : countdown > 0
              ? `Tekrar gönder (${countdown}s)`
              : "Doğrulama Emailini Tekrar Gönder"}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Yükleniyor...
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
