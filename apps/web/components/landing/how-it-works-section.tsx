"use client";

import React from "react";
import Image from "next/image";
import { PlusCircle, Palette, Share2, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Design Layout",
      subtitle: "CREATE",
      description:
        "Build your questions with our simple visual creator. Choose text inputs, dropdown selections, slider evaluations, and required checkpoints.",
      icon: <PlusCircle className="w-6 h-6 text-[#ff6b00]" />,
      accentColor: "border-[#ff6b00]/30 hover:border-[#ff6b00]/70",
      glowBg: "bg-[#ff6b00]/5",
      badgeColor: "bg-[#ff6b00] text-white shadow-[0_0_10px_rgba(255,107,0,0.4)]",
      characterImage: "/images/naruto_character.png",
      characterAlt: "Naruto in Nine-Tails Chakra Mode",
    },
    {
      number: "02",
      title: "Anime Synthesis",
      subtitle: "CUSTOMIZE",
      description:
        "Choose a theme to skin your form. Set security guardrails with submission limits, passwords, and custom notifications.",
      icon: <Palette className="w-6 h-6 text-[#990000]" />,
      accentColor: "border-[#990000]/30 hover:border-[#990000]/70",
      glowBg: "bg-[#990000]/5",
      badgeColor: "bg-[#990000] text-white shadow-[0_0_10px_rgba(153,0,0,0.4)]",
      characterImage: "/images/deathnote_character.png",
      characterAlt: "Ryuk the Shinigami",
    },
    {
      number: "03",
      title: "Deploy & Track",
      subtitle: "SHARE",
      description:
        "Publish with a single click. Share your form link and watch live analytics as responses roll in.",
      icon: <Share2 className="w-6 h-6 text-[#2e7d32]" />,
      accentColor: "border-[#2e7d32]/30 hover:border-[#2e7d32]/70",
      glowBg: "bg-[#2e7d32]/5",
      badgeColor: "bg-[#2e7d32] text-white shadow-[0_0_10px_rgba(46,125,50,0.4)]",
      characterImage: "/images/aot_character.png",
      characterAlt: "Attack on Titan warrior",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden border-t border-primary/5">
      {/* Decorative linears */}
      <div className="absolute top-[40%] right-[-10%] w-75 h-75 rounded-full bg-primary/2 blur-[100px] pointer-events-none" />

      {/* Decorative anime background images */}
      <div className="absolute top-[10%] left-[-3%] w-40 h-40 opacity-[0.06] pointer-events-none select-none hidden lg:block">
        <Image
          src="/images/aot_wings.png"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      <div className="absolute bottom-[10%] right-[-2%] w-28 h-28 opacity-[0.08] pointer-events-none select-none hidden lg:block animate-float-slow">
        <Image
          src="/images/naruto_rasengan.png"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 scroll-animate">
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">
            Simple Execution
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
            How It{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed font-medium">
            FormCraft turns every step into an intuitive 3-part creation loop. Build, customize, and
            share with confidence.
          </p>
        </div>

        {/* 3 Step List with Connections */}
        <div className="relative">
          {/* Horizontal connectors (Desktop only) */}
          <div className="absolute top-16.25 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-primary/15 z-0 hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => {
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center text-center p-8 rounded-2xl bg-card/60 backdrop-blur-xs border transition-all duration-300 group scroll-animate overflow-hidden ${step.accentColor} ${step.glowBg}`}
                >
                  {/* Character watermark background */}
                  <div className="absolute bottom-0 right-0 w-32 h-40 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700 pointer-events-none select-none z-0">
                    <Image
                      src={step.characterImage}
                      alt={step.characterAlt}
                      fill
                      className="object-contain object-bottom-right"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Circle Step Number Badge */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg mb-6 z-10 transition-transform duration-300 group-hover:scale-105 ${step.badgeColor}`}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                    {step.icon}
                  </div>

                  <span className="text-[10px] font-mono text-primary/80 block tracking-widest uppercase font-bold mb-2 relative z-10">
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl font-extrabold text-white mb-4 tracking-tight relative z-10">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed font-medium relative z-10">
                    {featureHighlights(idx, step.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Quick helper to bold certain key phrases inside steps
function featureHighlights(idx: number, desc: string) {
  if (idx === 0) {
    return (
      <>
        Build your questions with our simple{" "}
        <span className="text-white font-semibold">visual creator</span>. Choose text inputs,
        dropdown selections, <span className="text-white font-semibold">slider evaluations</span>,
        and required checkpoints.
      </>
    );
  } else if (idx === 1) {
    return (
      <>
        Choose a theme to skin your form. Set{" "}
        <span className="text-white font-semibold">security guardrails</span> with submission
        limits, <span className="text-white font-semibold">passwords</span>, and custom notify
        mailers.
      </>
    );
  } else {
    return (
      <>
        Publish with a <span className="text-white font-semibold">single click</span>. Share your
        form link and view <span className="text-white font-semibold">live analytics</span> as
        responses roll in.
      </>
    );
  }
}
