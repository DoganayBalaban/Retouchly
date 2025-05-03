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

const SignUpDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error("Sign Up Error:", error.message);
    else console.log("Sign Up Success:", data);
  };
  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google Sign Up Error:", error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Sign up</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <img
              src="/logo2.png"
              alt="logo"
              className="h-11 w-11 rounded-full object-cover"
            />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Sign up Retouchly
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              We just need a few details to get you started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                placeholder="Matt Welsh"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="hi@yourcompany.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                type="password"
                required
              />
            </div>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Create account"}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline" onClick={handleGoogleSignUp}>
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
