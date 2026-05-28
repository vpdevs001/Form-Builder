"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Copy,
  Shield,
  Mail,
  BarChart3,
  Settings,
  Share2,
  Layers,
  KeyRound,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { FEATURES } from "~/lib/constants";

// -------------------------------------------------------------
// FEATURE 1 MOCKUP: 10+ Field Types
// -------------------------------------------------------------
function FieldsMockup() {
  const [rating, setRating] = useState(4);
  const [inputText, setInputText] = useState("Uzumaki Naruto");

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-foreground/60">Form Fields Editor</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-primary/10 text-[10px] font-mono text-primary font-bold">
          10+ Active
        </span>
      </div>

      <div className="space-y-4 py-4 grow justify-center flex flex-col">
        {/* Field 1: Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80 flex items-center justify-between">
            <span>Shinobi Full Name</span>
            <span className="text-primary font-mono text-[9px]">* Required</span>
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#060913]/60 border border-primary/25 rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/80 transition-all font-medium"
            placeholder="e.g. Uchiha Sasuke"
          />
        </div>

        {/* Field 2: Star Rating */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Chakra Mastery Level</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none group"
              >
                <Sparkles
                  className={`w-5 h-5 transition-all ${
                    star <= rating
                      ? "text-primary fill-primary scale-110"
                      : "text-foreground/20 hover:text-primary/45"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-mono text-primary/80 ml-2 font-bold">
              {rating}/5 Rank
            </span>
          </div>
        </div>

        {/* Field 3: Multiple Choice */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Desired Shinobi Rank</label>
          <div className="grid grid-cols-3 gap-2">
            {["Genin", "Chunin", "Hokage"].map((rank) => (
              <div
                key={rank}
                className={`border rounded-md p-1.5 text-center text-[10px] font-bold cursor-pointer transition-all ${
                  rank === "Hokage"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/10 bg-[#060913]/30 text-foreground/60"
                }`}
              >
                {rank}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-foreground/40 font-mono text-center">
        Interactive Mock — Feel free to click!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 2 MOCKUP: Anime Themes
// -------------------------------------------------------------
function ThemesMockup() {
  const [activeTheme, setActiveTheme] = useState<"naruto" | "deathnote" | "aot">("naruto");

  const getThemeStyles = () => {
    switch (activeTheme) {
      case "naruto":
        return {
          bg: "bg-[#1c1209] border-[#ff6b00]/30 shadow-[#ff6b00]/5",
          accentText: "text-[#ff6b00]",
          labelText: "text-[#f4ebd0]/90 font-sans",
          inputBg: "bg-[#0b0704] border-[#ff6b00]/30 text-[#f4ebd0]",
          btn: "bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold animate-chakra",
          badge: "Hidden Leaf Scroll",
        };
      case "deathnote":
        return {
          bg: "bg-[#100505] border-[#990000]/30 shadow-[#990000]/5",
          accentText: "text-[#990000]",
          labelText: "text-[#f4ebd0]/80 font-serif tracking-wide",
          inputBg: "bg-[#050000] border-[#990000]/30 text-white font-serif",
          btn: "bg-[#990000] hover:bg-[#990000]/90 text-white font-bold font-serif tracking-wider animate-shinigami",
          badge: "Death Notebook Theme",
        };
      case "aot":
        return {
          bg: "bg-[#0e1710] border-[#2e7d32]/30 shadow-[#2e7d32]/5",
          accentText: "text-[#2e7d32]",
          labelText: "text-[#f4ebd0]/90 font-sans uppercase tracking-wider text-xs",
          inputBg: "bg-[#040805] border-[#2e7d32]/35 text-[#f4ebd0]",
          btn: "bg-[#2e7d32] hover:bg-[#2e7d32]/90 text-white font-semibold animate-survey",
          badge: "Survey Corps Canvas",
        };
    }
  };

  const s = getThemeStyles();

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-4">
        <div className="flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-foreground/60">Live Theme Sandbox</span>
        </div>
        <span className="text-[10px] font-mono text-foreground/40">Tab Switcher</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#060913]/60 p-1 rounded-lg border border-primary/15 mb-4">
        {(["naruto", "deathnote", "aot"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTheme(t)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTheme === t
                ? "bg-primary text-white shadow-md"
                : "text-foreground/60 hover:text-foreground/80 hover:bg-primary/5"
            }`}
          >
            {t === "naruto" ? "Leaf" : t === "deathnote" ? "Death Note" : "Corps"}
          </button>
        ))}
      </div>

      {/* Theme Canvas Preview */}
      <div
        className={`p-4 rounded-lg border transition-all duration-500 grow flex flex-col justify-center ${s.bg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-mono font-bold tracking-wider ${s.accentText}`}>
            {s.badge}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div>
            <label
              className={`block text-[11px] mb-1 font-semibold transition-all duration-500 ${s.labelText}`}
            >
              Who is your favorite character?
            </label>
            <input
              type="text"
              readOnly
              value={
                activeTheme === "naruto"
                  ? "Kakashi-sensei"
                  : activeTheme === "deathnote"
                    ? "L"
                    : "Levi Ackerman"
              }
              className={`w-full text-xs rounded px-2.5 py-1.5 border focus:outline-none transition-all duration-500 ${s.inputBg}`}
            />
          </div>
          <button
            className={`w-full py-1.5 text-xs rounded transition-all duration-500 cursor-pointer ${s.btn}`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 3 MOCKUP: Real-time Analytics
// -------------------------------------------------------------
function AnalyticsMockup() {
  const [submissions, setSubmissions] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubmissions((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-4">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-foreground/60">Live response insights</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#060913]/50 border border-primary/10 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-mono text-foreground/40 mb-1">
            Total Submissions
          </span>
          <span className="text-xl font-extrabold font-mono text-primary tracking-tight">
            {submissions.toLocaleString()}
          </span>
        </div>
        <div className="bg-[#060913]/50 border border-primary/10 rounded-lg p-3 text-center">
          <span className="block text-[10px] font-mono text-foreground/40 mb-1">
            Completion Rate
          </span>
          <span className="text-xl font-extrabold font-mono text-accent tracking-tight">96.4%</span>
        </div>
      </div>

      {/* Mock Analytics Chart */}
      <div className="grow flex flex-col justify-end bg-[#060913]/40 border border-primary/10 rounded-lg p-3 min-h-25">
        <div className="flex items-end justify-between gap-2 h-20 px-2">
          {/* Bar 1 */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-primary/20 border-t-2 border-primary rounded-t h-[45%] animate-pulse" />
            <span className="text-[8px] font-mono text-foreground/40">Mon</span>
          </div>
          {/* Bar 2 */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-primary/30 border-t-2 border-primary rounded-t h-[65%]" />
            <span className="text-[8px] font-mono text-foreground/40">Tue</span>
          </div>
          {/* Bar 3 */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-primary/50 border-t-2 border-primary rounded-t h-[90%] animate-pulse" />
            <span className="text-[8px] font-mono text-foreground/40">Wed</span>
          </div>
          {/* Bar 4 */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-primary/40 border-t-2 border-primary rounded-t h-[75%]" />
            <span className="text-[8px] font-mono text-foreground/40">Thu</span>
          </div>
          {/* Bar 5 */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full bg-primary/60 border-t-2 border-primary rounded-t h-[80%]" />
            <span className="text-[8px] font-mono text-foreground/40">Fri</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 4 MOCKUP: Publish & Share
// -------------------------------------------------------------
function ShareMockup() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "formcraft.io/s/hidden-leaf-survey";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-4">
        <div className="flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-foreground/60">Share Gateway</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] font-mono font-bold uppercase tracking-wider">
          Public
        </span>
      </div>

      <div className="grow flex flex-col justify-center gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground/80 block">Public Link</span>
          <div className="flex bg-[#060913]/60 border border-primary/20 rounded-lg p-1 items-center justify-between">
            <span className="text-xs font-mono text-primary/95 px-2 select-all overflow-hidden text-ellipsis whitespace-nowrap max-w-50">
              {shareUrl}
            </span>
            <Button
              onClick={handleCopy}
              size="sm"
              className="bg-primary hover:bg-primary/90 h-8 text-white text-[10px] font-bold cursor-pointer rounded px-3"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Mock QR Code representation */}
        <div className="flex items-center gap-4 bg-[#060913]/30 border border-primary/10 rounded-lg p-3">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 relative shrink-0">
            {/* Simple Mock QR Code via Grid SVG */}
            <svg viewBox="0 0 10 10" className="w-full h-full text-black fill-current">
              <path d="M0 0 h3 v3 h-3 z M7 0 h3 v3 h-3 z M0 7 h3 v3 h-3 z M4 4 h2 v2 h-2 z M4 0 h2 v2 h-2 z M0 4 h2 v2 h-2 z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold block text-foreground/90">
              Auto-Generated QR
            </span>
            <span className="text-[9px] text-foreground/50 block font-mono">
              Download high-res PNG for flyers or scrolls.
            </span>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-foreground/40 font-mono text-center">
        Click Copy Link to test the clipboard function!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 5 MOCKUP: Shinigami Shield Protection
// -------------------------------------------------------------
function ShieldMockup() {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");

  const handleUnlock = () => {
    if (password.toLowerCase() === "apple") {
      setIsLocked(false);
    }
  };

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-4">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-xs font-mono text-foreground/60">Shinigami Security Settings</span>
        </div>
        <span className="text-[9px] font-mono text-secondary font-bold">Throttling Active</span>
      </div>

      {isLocked ? (
        <div className="grow flex flex-col justify-center items-center gap-3 py-4">
          <KeyRound className="w-10 h-10 text-secondary animate-bounce" />
          <span className="text-xs font-bold text-center text-foreground/90">
            This form is protected by L
          </span>
          <div className="flex gap-2 w-full max-w-50">
            <input
              type="password"
              placeholder="Type 'apple' to unlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#060913]/60 border border-secondary/35 rounded px-2 py-1 text-xs text-center text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-secondary"
            />
            <Button
              onClick={handleUnlock}
              size="sm"
              className="bg-secondary hover:bg-secondary/90 text-white font-bold text-[10px] px-2 h-7"
            >
              OK
            </Button>
          </div>
          <span className="text-[9px] text-foreground/40 font-mono italic">
            Hint: Ryuk loves these!
          </span>
        </div>
      ) : (
        <div className="grow flex flex-col justify-center gap-3 py-2">
          <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-xs font-bold">Security Cleared — Form Open</span>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground/60 border-b border-primary/5 pb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Expiry Timer
              </span>
              <span className="text-primary font-bold">12 Days left</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground/60 border-b border-primary/5 pb-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Throttling
              </span>
              <span className="text-primary font-bold">1 Submit/IP</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsLocked(true);
              setPassword("");
            }}
            className="text-[9px] text-secondary hover:underline text-center font-mono cursor-pointer mt-1"
          >
            Re-lock Panel
          </button>
        </div>
      )}
      <div className="text-[9px] text-foreground/40 font-mono text-center">
        Interactive Security Vault Mockup
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FEATURE 6 MOCKUP: Survey Corps Broadcasts
// -------------------------------------------------------------
function BroadcastsMockup() {
  const [emails, setEmails] = useState<
    Array<{ id: number; name: string; subject: string; time: string }>
  >([
    { id: 1, name: "Armin Arlert", subject: "Colossal Insights Form Completed", time: "Just Now" },
    { id: 2, name: "Mikasa Ackerman", subject: "Dedicate your heart Survey", time: "3m ago" },
  ]);

  useEffect(() => {
    const names = ["Levi Ackerman", "Erwin Smith", "Jean Kirstein", "Hange Zoë"];
    const subjects = [
      "Survey Corps Registration details",
      "Strategic Expedition response",
      "Wall Rose census report",
      "Titan Research questionnaire",
    ];

    const interval = setInterval(() => {
      const newEmail = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)] || "Levi Ackerman",
        subject:
          subjects[Math.floor(Math.random() * subjects.length)] ||
          "Survey Corps Registration details",
        time: "Just Now",
      };
      setEmails((prev) => {
        const next = [newEmail, ...prev];
        return next.slice(0, 2);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-card/40 border border-primary/20 rounded-xl p-6 flex flex-col justify-between font-sans shadow-lg shadow-black/30 min-h-75">
      <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-4">
        <div className="flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-xs font-mono text-foreground/60">Wings of Freedom Mailer</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[8px] font-mono font-bold uppercase tracking-wider">
          Online
        </span>
      </div>

      <div className="grow space-y-3 justify-center flex flex-col">
        <span className="text-xs font-bold text-foreground/80 block">Inbox Notifications</span>

        <div className="space-y-2">
          {emails.slice(0, 2).map((email) => (
            <div
              key={email.id}
              className="bg-[#060913]/60 border-l-2 border-accent/10 border-y border-r p-2.5 rounded-r-md transition-all duration-500 hover:bg-[#060913]/90 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-accent">{email.name}</span>
                <span className="text-[8px] font-mono text-foreground/40">{email.time}</span>
              </div>
              <span className="text-[10px] text-foreground/80 block font-medium truncate">
                {email.subject}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[9px] text-foreground/40 font-mono text-center">
        Form submissions trigger automated real-time dispatch!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export function FeaturesSection() {
  const getMockup = (id: string) => {
    switch (id) {
      case "fields":
        return <FieldsMockup />;
      case "themes":
        return <ThemesMockup />;
      case "analytics":
        return <AnalyticsMockup />;
      case "share":
        return <ShareMockup />;
      case "security":
        return <ShieldMockup />;
      case "notifications":
        return <BroadcastsMockup />;
      default:
        return <div className="w-full h-64 bg-card/50 border border-primary/20 rounded-xl" />;
    }
  };

  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case "orange":
        return "bg-primary/10 text-primary border-primary/20";
      case "red":
        return "bg-secondary/15 text-secondary border-secondary/20";
      case "green":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden border-t border-primary/5">
      <div className="absolute inset-y-0 right-0 w-100 bg-secondary/3 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-112.5 bg-primary/3 blur-[150px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 scroll-animate">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
            Form Building at a{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Championship Level
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed font-medium">
            Explore powerful features that help you launch beautiful forms, keep entries secure, and
            uncover visual insights.
          </p>
        </div>

        {/* Feature Rows */}
        <div className="space-y-28">
          {FEATURES.map((feature, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={feature.id}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 scroll-animate ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Text Side */}
                <div className="flex-1 space-y-6">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getBadgeColorClass(feature.badgeColor)}`}
                  >
                    {feature.badge}
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-base text-foreground/75 leading-relaxed font-medium">
                    {feature.description}
                  </p>

                  <ul className="space-y-3 font-medium">
                    {feature.details.map((detail, dIdx) => (
                      <li
                        key={dIdx}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <div className="relative shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mockup Side */}
                <div className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-4/3 rounded-2xl p-1 bg-linear-to-tr from-primary/15 via-secondary/10 to-accent/15 group shadow-2xl hover:scale-[1.01] transition-transform duration-300">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs rounded-2xl z-0" />
                  <div className="relative z-10 w-full h-full rounded-2xl bg-[#060913]/90 overflow-hidden p-2 flex items-center justify-center">
                    {getMockup(feature.id)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
