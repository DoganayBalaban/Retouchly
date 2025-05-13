"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpDialog = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error("Kayıt sırasında hata oluştu.");
      console.error("Sign Up Error:", error.message);
    } else {
      toast.success("Kayıt başarılı! Mailinizi kontrol edin.");
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Google ile kayıt başarısız.");
      console.error("Google Sign Up Error:", error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Kayıt Ol</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-full border">
            <img
              src="/logo2.png"
              alt="logo"
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center">
              Retouchly'e Kayıt Ol
            </DialogTitle>
            <DialogDescription className="text-center">
              Başlamak için sadece birkaç bilgiye ihtiyacımız var.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input
                placeholder="Doğanay Balaban"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Hesap Oluştur"}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:flex-1 before:h-px before:bg-border after:flex-1 after:h-px after:bg-border">
          <span className="text-xs text-muted-foreground">veya</span>
        </div>

        <Button variant="outline" onClick={handleGoogleSignUp}>
          Google ile Devam Et
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Kayıt olarak{" "}
          <a className="underline hover:no-underline" href="#">
            Kullanım Şartları'nı
          </a>{" "}
          kabul etmiş olursunuz.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
