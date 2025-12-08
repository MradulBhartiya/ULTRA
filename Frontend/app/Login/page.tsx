"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../Database/supabase-client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const {setIsLoggedin} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // -----------------------------
    // LOGIN USER
    // -----------------------------
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setErrorMsg(loginError.message);
      setLoading(false);
      return;
    }

    // -----------------------------
    // GET USER SAFELY
    // -----------------------------
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    const user = userData.user;

    // -----------------------------
    // INSERT LOGIN ACTIVITY
    // -----------------------------
    const { error: activityError } = await supabase
      .from("user_activity")
      .insert({
        user_id: user.id,
      });

    if (activityError) {
      console.error("Activity insert error:", activityError.message);
    }

    // -----------------------------
    // REDIRECT AFTER LOGIN
    // -----------------------------
    setIsLoggedin(true);
    router.push("/Dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[url('/Background.png')] bg-cover bg-center">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-4xl shadow-2xl shadow-gray-400/60 
          border border-white/60 px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row gap-10">

          {/* Left Section */}
          <div className="md:w-1/2 flex flex-col justify-center gap-4">
            <h1 className="text-3xl font-semibold text-gray-800">Exercise Analyzer</h1>

            <p className="text-sm text-gray-600 leading-relaxed">
              Login to access your{" "}
              <span className="font-semibold text-blue-600">workout analyzer dashboard</span>{" "}
              and track your form, accuracy, and muscle engagement.
            </p>

            <div className="mt-4 inline-flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-300">
                <div className="text-center text-xs">
                  <div className="font-semibold text-gray-800">Avg</div>
                  <div className="text-green-500 font-bold text-sm">84%</div>
                </div>
              </div>
              <span className="text-xs text-gray-500">Sample accuracy from previous workouts.</span>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Login</h2>
            <p className="text-sm text-gray-500 mb-5">Enter your credentials to continue.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 text-sm
                    outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 text-sm
                    outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="••••••••"
                />
              </div>

              {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-full bg-blue-600 text-white text-sm font-semibold py-2.5
                  shadow-md hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <button
              onClick={() => router.push("/Signup")}
              className="mt-4 text-xs text-blue-600 hover:underline self-center"
            >
              Don’t have an account? Create one
            </button>

            <button
              onClick={() => router.push("/")}
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 self-center"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
