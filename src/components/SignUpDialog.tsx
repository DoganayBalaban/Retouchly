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
  const [open, setOpen] = useState(false);
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
      toast.error("An error occurred during registration.");
      console.error("Sign Up Error:", error.message);
    } else {
      // Dialog'u kapat ve doğrulama sayfasına yönlendir
      setOpen(false);
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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
      toast.error("Registration with Google failed.");
      console.error("Google Sign Up Error:", error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign Up</Button>
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
              Sign Up to Retouchly
            </DialogTitle>
            <DialogDescription className="text-center">
              We just need a few details to get you started.
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
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:flex-1 before:h-px before:bg-border after:flex-1 after:h-px after:bg-border">
          <span className="text-xs text-muted-foreground">or</span>
        </div>

        <Button variant="outline" onClick={handleGoogleSignUp}>
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms of Service
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
