"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sparkles,
  ShieldAlert,
  Swords,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type ThemeId = "naruto" | "deathnote" | "aot";

interface ThemeConfig {
  id: ThemeId;
  name: string;
  japanese: string;
  primaryColor: string;
  glowClass: string;
  bgGradient: string;
  borderClass: string;
  buttonClass: string;
  inputFocusClass: string;
  textMutedClass: string;
  accentTextClass: string;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  naruto: {
    id: "naruto",
    name: "Hidden Leaf",
    japanese: "木ノ葉隠れの里",
    primaryColor: "#ff6b00",
    glowClass: "shadow-[0_0_30px_rgba(255,107,0,0.2)] border-[#ff6b00]/30",
    bgGradient: "from-[#ff6b00]/10 via-black to-[#ff6b00]/5",
    borderClass: "border-[#ff6b00]/20 focus-within:border-[#ff6b00]",
    buttonClass:
      "bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)]",
    inputFocusClass: "focus-visible:ring-[#ff6b00] focus-visible:border-[#ff6b00]",
    textMutedClass: "text-[#a09786]",
    accentTextClass: "text-[#ff6b00]",
  },
  deathnote: {
    id: "deathnote",
    name: "Shinigami Realm",
    japanese: "死神界",
    primaryColor: "#990000",
    glowClass: "shadow-[0_0_30px_rgba(153,0,0,0.2)] border-[#990000]/30",
    bgGradient: "from-[#990000]/10 via-black to-[#990000]/5",
    borderClass: "border-[#990000]/20 focus-within:border-[#990000]",
    buttonClass:
      "bg-[#990000] hover:bg-[#990000]/90 text-white shadow-[0_0_15px_rgba(153,0,0,0.3)] hover:shadow-[0_0_25px_rgba(153,0,0,0.5)] font-mono",
    inputFocusClass: "focus-visible:ring-[#990000] focus-visible:border-[#990000] font-mono",
    textMutedClass: "text-zinc-500 font-mono",
    accentTextClass: "text-[#990000] font-mono",
  },
  aot: {
    id: "aot",
    name: "Survey Corps",
    japanese: "調査兵団",
    primaryColor: "#2e7d32",
    glowClass: "shadow-[0_0_30px_rgba(46,125,50,0.2)] border-[#2e7d32]/30",
    bgGradient: "from-[#2e7d32]/10 via-black to-[#2e7d32]/5",
    borderClass: "border-[#2e7d32]/20 focus-within:border-[#2e7d32]",
    buttonClass:
      "bg-[#2e7d32] hover:bg-[#2e7d32]/90 text-white shadow-[0_0_15px_rgba(46,125,50,0.3)] hover:shadow-[0_0_25px_rgba(46,125,50,0.5)]",
    inputFocusClass: "focus-visible:ring-[#2e7d32] focus-visible:border-[#2e7d32]",
    textMutedClass: "text-emerald-950/40 text-slate-400",
    accentTextClass: "text-[#2e7d32]",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  const [activeTheme, setActiveTheme] = useState<ThemeId>("naruto");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentTheme = THEMES[activeTheme];

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, firstName, lastName || undefined, password);
    } catch (err) {
      // Errors are caught and toasted in AuthProvider
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-foreground/60 text-sm font-mono">Forging your Shinobi account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-[#060913]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div
          className={`absolute top-[25%] left-[25%] w-100 h-100 rounded-full blur-[100px] transition-all duration-1000 ${
            activeTheme === "naruto"
              ? "bg-primary/10"
              : activeTheme === "deathnote"
                ? "bg-secondary/15"
                : "bg-accent/10"
          }`}
        />
        <div
          className={`absolute bottom-[25%] right-[25%] w-100 h-100 rounded-full blur-[100px] transition-all duration-1000 ${
            activeTheme === "naruto"
              ? "bg-primary/5"
              : activeTheme === "deathnote"
                ? "bg-secondary/10"
                : "bg-accent/5"
          }`}
        />
      </div>

      {/* Floating Theme Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {activeTheme === "naruto" && (
          <div className="absolute top-[20%] left-[10%] animate-float-slow opacity-30">
            <svg className="w-12 h-12 text-primary fill-current" viewBox="0 0 100 100">
              <path d="M50 0 L55 35 L90 35 L60 55 L75 90 L50 70 L25 90 L40 55 L10 35 L45 35 Z" />
            </svg>
          </div>
        )}
        {activeTheme === "deathnote" && (
          <div className="absolute bottom-[20%] right-[12%] animate-float-medium opacity-30">
            <svg className="w-10 h-10 text-secondary fill-current" viewBox="0 0 100 100">
              <path d="M50 15 C35 15, 20 25, 20 45 C20 70, 35 90, 50 90 C65 90, 80 70, 80 45 C80 25, 65 15, 50 15 M50 15 C52 8, 60 5, 65 8" />
            </svg>
          </div>
        )}
        {activeTheme === "aot" && (
          <div className="absolute top-[15%] right-[10%] animate-float-fast opacity-30">
            <svg className="w-14 h-14 text-accent fill-current" viewBox="0 0 100 100">
              <path d="M20 30 C30 25, 45 35, 45 50 C45 60, 35 75, 20 80 C25 70, 30 50, 20 30 Z" />
              <path
                d="M80 30 C70 25, 55 35, 55 50 C55 60, 65 75, 80 80 C75 70, 70 50, 80 30 Z"
                className="opacity-80 text-white"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-white via-primary/90 to-primary bg-clip-text text-transparent tracking-tight">
              Form<span className="text-primary font-extrabold">Craft</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className={`relative rounded-2xl bg-card/60 backdrop-blur-md border transition-all duration-500 overflow-hidden p-8 ${currentTheme.glowClass}`}
        >
          {/* Card Top Accent Bar */}
          <div
            className={`absolute top-0 inset-x-0 h-1 transition-all duration-500`}
            style={{ backgroundColor: currentTheme.primaryColor }}
          />

          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white font-heading">
                Sign Up
              </h2>
              <p
                className={`text-xs mt-1 transition-colors duration-500 ${currentTheme.textMutedClass}`}
              >
                Create your form craft guild account
              </p>
            </div>
            <div className="text-right select-none opacity-10 font-bold text-4xl hidden sm:block">
              {currentTheme.japanese.slice(0, 2)}
            </div>
          </div>

          {/* Theme Switcher Tabs inside Card */}
          <div className="grid grid-cols-3 gap-2 bg-[#060913]/60 border border-primary/5 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTheme("naruto")}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
                activeTheme === "naruto"
                  ? "bg-primary/20 text-[#ff6b00] border border-[#ff6b00]/30"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Leaf
            </button>
            <button
              onClick={() => setActiveTheme("deathnote")}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer font-mono ${
                activeTheme === "deathnote"
                  ? "bg-secondary/20 text-[#990000] border border-[#990000]/30"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              Realm
            </button>
            <button
              onClick={() => setActiveTheme("aot")}
              className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
                activeTheme === "aot"
                  ? "bg-accent/20 text-[#2e7d32] border border-[#2e7d32]/30"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <Swords className="w-3 h-3" />
              Corps
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-bold text-foreground/80">
                  First Name <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                  <Input
                    id="firstName"
                    type="text"
                    required
                    placeholder="Naruto"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`pl-10 bg-black/30 border border-white/5 text-sm rounded-xl py-5 text-white placeholder:text-foreground/20 focus:outline-none transition-all ${currentTheme.inputFocusClass}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-bold text-foreground/80">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Uzumaki"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`pl-10 bg-black/30 border border-white/5 text-sm rounded-xl py-5 text-white placeholder:text-foreground/20 focus:outline-none transition-all ${currentTheme.inputFocusClass}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground/80">
                Email Address <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="naruto@hokage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 bg-black/30 border border-white/5 text-sm rounded-xl py-5 text-white placeholder:text-foreground/20 focus:outline-none transition-all ${currentTheme.inputFocusClass}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-foreground/80">
                Password <span className="text-primary">*</span> (min 8 chars)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 bg-black/30 border border-white/5 text-sm rounded-xl py-5 text-white placeholder:text-foreground/20 focus:outline-none transition-all ${currentTheme.inputFocusClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/80 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className={`w-full py-5 rounded-xl text-sm font-extrabold transition-all duration-300 mt-6 cursor-pointer flex items-center justify-center gap-1.5 ${currentTheme.buttonClass}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Forging Soul...
                </>
              ) : (
                "Unleash Power"
              )}
            </Button>
          </form>

          {/* Footer inside Card */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className={`text-xs ${currentTheme.textMutedClass}`}>
              Already have an account?{" "}
              <Link
                href="/login"
                className={`font-bold hover:underline ${currentTheme.accentTextClass}`}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
