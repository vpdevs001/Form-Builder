"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Wand2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export function HeroSection() {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Anime Particle Background/Chakra Aura */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[15%] w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-secondary/15 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[30%] w-125 h-125 rounded-full bg-accent/5 blur-[150px]" />
      </div>

      {/* Floating Anime Image Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Floating Naruto Rasengan */}
        <div className="absolute top-[22%] left-[6%] animate-float-slow hidden lg:block opacity-60">
          <div className="relative w-24 h-24 filter drop-shadow-[0_0_25px_rgba(255,107,0,0.5)]">
            <Image
              src="/images/naruto_rasengan.png"
              alt="Naruto Rasengan energy sphere"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Floating Death Note Apple */}
        <div className="absolute bottom-[28%] left-[8%] animate-float-medium hidden lg:block opacity-55">
          <div className="relative w-16 h-16 filter drop-shadow-[0_0_20px_rgba(153,0,0,0.6)]">
            <Image
              src="/images/deathnote_apple.png"
              alt="Death Note Ryuk's apple"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Floating AoT Wings of Freedom Emblem */}
        <div className="absolute top-[18%] right-[6%] animate-float-fast hidden lg:block opacity-45">
          <div className="relative w-28 h-28 filter drop-shadow-[0_0_20px_rgba(46,125,50,0.4)]">
            <Image
              src="/images/aot_wings.png"
              alt="Attack on Titan Wings of Freedom emblem"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Additional floating Rasengan — bottom right for balance */}
        <div className="absolute bottom-[22%] right-[10%] animate-float-slow hidden lg:block opacity-30">
          <div className="relative w-14 h-14 filter drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]">
            <Image
              src="/images/naruto_rasengan.png"
              alt="Rasengan glow"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 flex flex-col items-center">
        {/* Anime Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-pulse text-xs font-semibold text-primary tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Themed Form Builder
        </div>

        {/* Giant Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center tracking-tight leading-[1.1] max-w-5xl mb-8">
          Build Forms That Feel Like an{" "}
          <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent filter drop-shadow-[0_2px_20px_rgba(255,107,0,0.2)]">
            Anime Adventure
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-foreground/75 text-center max-w-3xl mb-10 leading-relaxed font-medium">
          Ditch those plain, clinical surveys. Instantly craft legendary forms with customizable{" "}
          <span className="text-primary font-semibold">Naruto</span>,{" "}
          <span className="text-secondary font-semibold">Death Note</span>, and{" "}
          <span className="text-accent font-semibold">Attack on Titan</span> visual themes. 100%
          free, no jutsu required.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-md sm:max-w-none">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-extrabold text-base py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] hover:scale-[1.02] transition-all duration-300 group">
              Start Building — It&apos;s Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            onClick={handleScrollToFeatures}
            variant="outline"
            className="w-full sm:w-auto border-foreground/20 hover:border-primary/50 text-foreground/80 hover:text-primary hover:bg-primary/5 font-extrabold text-base py-6 px-8 rounded-xl transition-all duration-300"
          >
            Explore Features
          </Button>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative w-full max-w-5xl aspect-16/10 sm:aspect-video rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group scroll-animate transition-all duration-1000">
          {/* Neon outline glowing header */}
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-accent z-20" />

          {/* Glass header buttons */}
          <div className="absolute top-4 left-6 flex items-center gap-2 z-20">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
            <span className="text-xs text-foreground/40 font-mono ml-4 select-none">
              formcraft.io/templates/hidden-leaf-exam
            </span>
          </div>

          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero_visual.png"
              alt="FormCraft Anime Form Builder Mockup Interface"
              fill
              priority
              className="object-cover object-top opacity-90 group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
          </div>

          {/* Absolute decorative overlay representing the tool editor grid */}
          <div className="absolute inset-0 bg-linear-to-t from-[#060913] via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Bouncing scroll indicator */}
        <button
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-16 flex flex-col items-center gap-2 text-foreground/40 hover:text-primary transition-colors group cursor-pointer"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll Down</span>
          <ChevronDown className="w-5 h-5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
