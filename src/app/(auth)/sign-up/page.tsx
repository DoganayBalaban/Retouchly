// // app/auth/sign-up/page.tsx
"use client";
// import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// import Link from "next/link";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSignUp = async () => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     if (error) console.error("Sign Up Error:", error.message);
//     else console.log("Sign Up Success:", data);
//     router.push("/sign-in");
//   };

//   const handleSignUpWithGoogle = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       if (error) throw error;
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Yeni hesap oluşturun
//           </h2>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4">
//             <div className="text-sm text-red-700">{error}</div>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
//           <div className="space-y-2">
//             {" "}
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 E-posta
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 placeholder="E-posta adresi"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Şifre
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 placeholder="Şifre"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
//             >
//               {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
//             </button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <button
//             onClick={handleSignUpWithGoogle}
//             disabled={loading}
//             className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
//           >
//             {" "}
//             <span className="mr-2">
//               <svg width="20" height="20" viewBox="0 0 20 20">
//                 <g fill="none">
//                   <path
//                     d="M17.876 10.284c0-.574-.052-1.127-.147-1.657H10v3.132h4.399a3.76 3.76 0 01-1.63 2.467v2.05h2.64c1.544-1.421 2.435-3.515 2.435-5.992z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M10 18c2.208 0 4.061-.73 5.413-1.974l-2.64-2.05c-.73.49-1.669.776-2.773.776-2.13 0-3.933-1.437-4.577-3.366H2.7v2.116C4.043 15.983 6.869 18 10 18z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.423 11.386a4.8 4.8 0 01-.25-1.5c0-.522.09-1.028.25-1.5V6.269H2.7C2.256 7.39 2 8.662 2 10c0 1.338.256 2.61.7 3.731l2.723-2.345z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M10 5.134c1.2 0 2.274.412 3.123 1.222l2.344-2.344C13.863 2.531 12.01 1.8 10 1.8c-3.132 0-5.957 2.016-7.3 5.469l2.723 2.345C6.067 6.571 7.87 5.134 10 5.134z"
//                     fill="#EA4335"
//                   />
//                 </g>
//               </svg>
//             </span>
//             Google ile Kayıt Ol
//           </button>
//         </div>

//         <div className="text-sm text-center">
//           Zaten bir hesabınız var mı?{" "}
//           <Link
//             href="/sign-in"
//             className="font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Giriş Yap
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error("Sign Up Error:", error.message);
    else console.log("Sign Up Success:", data);
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error("Sign In Error:", error.message);
    else console.log("Sign In Success:", data);
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Log Out Error:", error.message);
    else console.log("çıkış yapıldı");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login Page</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn} style={{ marginLeft: 10 }}>
        Sign In
      </button>
      <button onClick={handleLogOut} style={{ marginLeft: 10 }}>
        çıkış yap
      </button>
    </div>
  );
}
