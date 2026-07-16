"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  Activity
} from "lucide-react";

export default function Auth() {
  const router = useRouter();
  const { login, register, loginWithGoogle, resetPassword } = useAuth();
  
  // Tabs: 'signin' | 'signup' | 'forgot'
  const [view, setView] = useState<"signin" | "signup" | "forgot">("signin");
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Sign in failed. Check credentials.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess("A reset link has been dispatched to your email address (simulated).");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/20">
        <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-3xl shadow-xl transition-all">
          {/* Logo Heading */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="mt-4 text-2xl font-black text-foreground">
              {view === "signin" && "Welcome Back"}
              {view === "signup" && "Create Student Profile"}
              {view === "forgot" && "Reset Password"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {view === "signin" && "Sign in to access your dashboard, quiz scores & badges."}
              {view === "signup" && "Start tracking your learning streak and saving flashcards."}
              {view === "forgot" && "Input your registered email to request a reset link."}
            </p>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl text-xs flex items-start space-x-2">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Google Sign-in Option (for Sign-in / Sign-up) */}
          {view !== "forgot" && (
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 border border-border hover:bg-muted font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-40"
            >
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          {view !== "forgot" && (
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative px-3 bg-card text-[10px] uppercase font-bold text-muted-foreground">
                Or email credentials
              </span>
            </div>
          )}

          {/* FORMS */}
          <form className="mt-6 space-y-4" onSubmit={
            view === "signin" ? handleSignIn : 
            view === "signup" ? handleSignUp : 
            handleForgotPassword
          }>
            {/* Display Name for Sign Up */}
            {view === "signup" && (
              <div className="relative rounded-xl border border-border bg-card p-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition">
                <label className="block text-[9px] uppercase font-black text-muted-foreground/80 px-2">Name</label>
                <div className="flex items-center">
                  <User className="h-4 w-4 text-muted-foreground ml-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-0 py-1.5 px-2.5 text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="relative rounded-xl border border-border bg-card p-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition">
              <label className="block text-[9px] uppercase font-black text-muted-foreground/80 px-2">Email Address</label>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-muted-foreground ml-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-transparent border-0 py-1.5 px-2.5 text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Password Field (for Sign-in / Sign-up) */}
            {view !== "forgot" && (
              <div className="relative rounded-xl border border-border bg-card p-1.5 focus-within:ring-2 focus-within:ring-primary/50 transition">
                <div className="flex justify-between items-center px-2">
                  <label className="block text-[9px] uppercase font-black text-muted-foreground/80">Password</label>
                  {view === "signin" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-[9px] font-bold text-primary hover:underline focus:outline-none"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-muted-foreground ml-2.5 shrink-0" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 py-1.5 px-2.5 text-xs text-foreground focus:outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
            >
              <span>
                {loading ? "Processing..." : 
                 view === "signin" ? "Sign In" : 
                 view === "signup" ? "Sign Up" : 
                 "Send Reset Link"}
              </span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Toggle Footnotes */}
          <div className="text-center text-xs mt-6">
            {view === "signin" && (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => { setView("signup"); resetMessages(); }}
                  className="font-bold text-primary hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            )}

            {view === "signup" && (
              <p className="text-muted-foreground">
                Already registered?{" "}
                <button
                  onClick={() => { setView("signin"); resetMessages(); }}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}

            {view === "forgot" && (
              <p className="text-muted-foreground">
                Recall your password?{" "}
                <button
                  onClick={() => { setView("signin"); resetMessages(); }}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            
            <p className="text-[10px] text-muted-foreground/80 mt-4 bg-muted/50 p-2 rounded-lg leading-tight">
              💡 **Demo Mode Hint:** You can login immediately using **student@biocyclehub.edu** (any password) to load initial achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
