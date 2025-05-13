import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignInDialog = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("Giriş başarısız!");
    } else {
      toast.success("Giriş başarılı!");
      router.refresh(); // Navbar güncellensin
      router.push("/");
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error("Google ile oturum açılamadı.");
      console.error("Google Auth Error:", error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black">
          Giriş Yap
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <img src="/logo2.png" alt="logo" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Tekrar Hoş Geldiniz
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Hesabınıza giriş yapmak için bilgilerinizi girin.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Şifre</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox />
              <Label>Beni hatırla</Label>
            </div>
            <a className="text-sm underline" href="#">
              Şifremi unuttum?
            </a>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader className="animate-spin" /> : "Giriş Yap"}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:flex-1 before:h-px before:bg-border after:flex-1 after:h-px after:bg-border">
          <span className="text-xs text-muted-foreground">veya</span>
        </div>

        <Button variant="outline" onClick={handleGoogleAuth}>
          Google ile Giriş Yap
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
