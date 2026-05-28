"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Youtube, Instagram, Linkedin, Sparkles } from "lucide-react";
import { SOCIAL_LINKS } from "~/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Custom SVG for X (formerly Twitter)
  const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <footer className="bg-[#04060d] border-t border-primary/10 pt-16 pb-12 relative overflow-hidden font-sans">
      {/* Subtle anime watermarks */}
      <div className="absolute top-[20%] right-[5%] w-32 h-32 opacity-[0.03] pointer-events-none select-none hidden lg:block">
        <Image src="/images/aot_wings.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="absolute bottom-[30%] left-[4%] w-16 h-16 opacity-[0.04] pointer-events-none select-none hidden lg:block">
        <Image src="/images/naruto_rasengan.png" alt="" fill className="object-contain" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-max">
              <div className="relative w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,0,0.2)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-white via-primary/90 to-primary bg-clip-text text-transparent">
                Form<span className="text-primary font-extrabold">Craft</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/70 leading-relaxed max-w-sm font-medium">
              Create gorgeous, anime-themed forms matching the aesthetics of Naruto, Death Note, and Attack on Titan. Collect data, maintain secure submissions, and track insights flawlessly.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-card/60 border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-card/60 border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-card/60 border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-card/60 border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-card/60 border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4 font-medium">
            <h4 className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="text-foreground/60 hover:text-primary transition-colors">Features</a>
              </li>
              <li>
                <a href="#themes" className="text-foreground/60 hover:text-primary transition-colors">Anime Themes</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-foreground/60 hover:text-primary transition-colors">How It Works</a>
              </li>
              <li>
                <Link href="/templates" className="text-foreground/60 hover:text-primary transition-colors">Form Templates</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4 font-medium">
            <h4 className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/docs" className="text-foreground/60 hover:text-primary transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/guide" className="text-foreground/60 hover:text-primary transition-colors">Shinobi Guides</Link>
              </li>
              <li>
                <Link href="/support" className="text-foreground/60 hover:text-primary transition-colors">Expedition Support</Link>
              </li>
              <li>
                <Link href="/status" className="text-foreground/60 hover:text-primary transition-colors">System Status</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4 font-medium">
            <h4 className="text-xs font-mono font-bold tracking-widest text-primary uppercase">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms of Summon</Link>
              </li>
              <li>
                <Link href="/security" className="text-foreground/60 hover:text-primary transition-colors">Shinobi Security</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright info */}
        <div className="border-t border-primary/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-foreground/40 font-bold">
          <div>
            &copy; {currentYear} FormCraft. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built by Ved Pandey for the Web Dev Cohort</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
}
