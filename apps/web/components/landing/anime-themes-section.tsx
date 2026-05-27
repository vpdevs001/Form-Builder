"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Eye, Swords, ShieldAlert } from "lucide-react";
import { ANIME_THEMES } from "~/lib/constants";
import { Button } from "~/components/ui/button";

export function AnimeThemesSection() {
  const getIcon = (id: string) => {
    switch (id) {
      case "naruto":
        return <Sparkles className="w-5 h-5 text-[#ff6b00]" />;
      case "deathnote":
        return <ShieldAlert className="w-5 h-5 text-[#990000]" />;
      case "aot":
        return <Swords className="w-5 h-5 text-[#2e7d32]" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <section id="themes" className="py-24 relative overflow-hidden bg-[#060913]/40 border-t border-primary/5">
      {/* Decorative side beams */}
      <div className="absolute top-[20%] left-0 w-80 h-80 rounded-full bg-accent/4 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-80 h-80 rounded-full bg-[#ff6b00]/3 blur-[100px] pointer-events-none" />

      {/* Floating anime accent images */}
      <div className="absolute top-[8%] right-[4%] w-20 h-20 opacity-[0.07] pointer-events-none select-none hidden lg:block animate-float-slow">
        <Image src="/images/naruto_rasengan.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-[10%] left-[3%] w-16 h-16 opacity-[0.06] pointer-events-none select-none hidden lg:block animate-float-medium">
        <Image src="/images/deathnote_apple.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="absolute top-[50%] left-[6%] w-24 h-24 opacity-[0.04] pointer-events-none select-none hidden xl:block animate-float-fast">
        <Image src="/images/aot_wings.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 scroll-animate">
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">Custom Aesthetics</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 tracking-tight leading-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Visual Universe
            </span>
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed font-medium">
            Morph your forms instantly. Empower respondent answers through deep theme immersion that honors the legendary visual signatures of iconic sagas.
          </p>
        </div>

        {/* 3 Columns Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ANIME_THEMES.map((theme) => {
            return (
              <div
                key={theme.id}
                className={`relative group rounded-2xl bg-card border border-primary/10 hover:border-transparent transition-all duration-500 overflow-hidden flex flex-col justify-between scroll-animate min-h-[460px] p-6 hover:${theme.glowClass} hover:-translate-y-2`}
              >
                {/* Visual Background Theme Gradients */}
                <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} opacity-60 z-0`} />
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15 group-hover:scale-105 transition-transform duration-700 pointer-events-none z-0"
                  style={{ backgroundImage: `url(${theme.bgImage})` }}
                />

                {/* Character image watermark accent */}
                <div className="absolute bottom-0 right-0 w-36 h-44 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-700 pointer-events-none select-none z-0">
                  <Image
                    src={theme.id === "naruto" ? "/images/naruto_character.png" : theme.id === "deathnote" ? "/images/deathnote_character.png" : "/images/aot_character.png"}
                    alt=""
                    fill
                    className="object-contain object-bottom"
                    aria-hidden="true"
                  />
                </div>

                {/* Huge Watermark Japanese Text */}
                <div className="absolute top-4 right-4 text-7xl font-extrabold select-none opacity-4 font-heading text-white pointer-events-none z-0">
                  {theme.japanese.slice(0, 2)}
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 space-y-5">
                  {/* Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center">
                        {getIcon(theme.id)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs text-foreground/40 font-mono block tracking-wider">{theme.japanese}</span>
                        <h3 className="text-lg font-bold text-white tracking-tight">{theme.name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm font-bold text-foreground tracking-wide italic">
                    &ldquo;{theme.tagline}&rdquo;
                  </p>

                  {/* Description */}
                  <p className="text-xs text-foreground/75 leading-relaxed font-medium">
                    {theme.description}
                  </p>

                  {/* Field list preview template widgets */}
                  <div className="space-y-2 bg-black/30 border border-white/5 rounded-xl p-3.5 mt-2">
                    <span className="text-[9px] font-mono text-foreground/40 block tracking-widest uppercase mb-1">
                      Included Field Skins:
                    </span>
                    <div className="space-y-1.5">
                      {theme.fieldsPreview.map((field, fIdx) => (
                        <div 
                          key={fIdx} 
                          className="flex items-center justify-between py-1 px-2.5 rounded bg-black/20 border border-white/5 text-[10px] font-mono text-foreground/80 font-bold"
                        >
                          <span>{field}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            theme.id === "naruto" 
                              ? "bg-[#ff6b00]" 
                              : theme.id === "deathnote" 
                              ? "bg-[#990000]" 
                              : "bg-[#2e7d32]"
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-foreground/40 tracking-wider">PRESET ACTIVE</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-xs font-bold gap-1 cursor-pointer transition-colors duration-300 ${theme.accentClass}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview Theme
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
