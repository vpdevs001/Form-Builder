"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden border-t border-primary/5">
      {/* Anime Action Speed Lines (Stylized background SVGs) */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-primary fill-none stroke-current">
          <line x1="0" y1="50" x2="40" y2="50" strokeWidth="0.1" />
          <line x1="100" y1="50" x2="60" y2="50" strokeWidth="0.1" />
          <line x1="50" y1="0" x2="50" y2="40" strokeWidth="0.1" />
          <line x1="50" y1="100" x2="50" y2="60" strokeWidth="0.1" />
          <line x1="0" y1="0" x2="35" y2="35" strokeWidth="0.15" />
          <line x1="100" y1="100" x2="65" y2="65" strokeWidth="0.15" />
          <line x1="100" y1="0" x2="65" y2="35" strokeWidth="0.15" />
          <line x1="0" y1="100" x2="35" y2="65" strokeWidth="0.15" />
        </svg>
      </div>

      {/* Floating anime decorations — section level */}
      <div className="absolute top-[15%] left-[5%] w-20 h-20 opacity-[0.07] pointer-events-none select-none hidden lg:block animate-float-medium">
        <Image src="/images/deathnote_apple.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-[15%] right-[5%] w-16 h-16 opacity-[0.10] pointer-events-none select-none hidden lg:block animate-float-slow">
        <Image src="/images/naruto_rasengan.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden bg-gradient-to-br from-[#1a1005] via-[#0d0702] to-[#060913] border border-primary/20 shadow-[0_0_40px_rgba(255,107,0,0.15)] text-center scroll-animate">
          {/* Subtle Orange/Crimson Chakra Glow in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

          {/* Wings of Freedom watermark emblem in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-[0.04] pointer-events-none select-none">
            <Image src="/images/aot_wings.png" alt="" fill className="object-contain" aria-hidden="true" />
          </div>

          {/* Sparkle badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            No Credit Card Required
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Ready to Summon{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Next Form?
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Join the ranks of elite shinobi form builders. Skin your questions, set secure protections, and analyze responses with legendary aesthetics.
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <Link href="/signup" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold text-base py-7 px-8 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.35)] hover:shadow-[0_0_30px_rgba(255,107,0,0.55)] transition-all group duration-300">
                Summon FormCraft Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs font-mono text-foreground/40">
            DEDICATE YOUR HEART TO GREATER DATA INSIGHTS
          </div>
        </div>
      </div>
    </section>
  );
}
