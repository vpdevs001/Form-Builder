"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";

const characters = [
  {
    name: "Ninja",
    image: "/images/naruto_character.png",
    color: "#e76f51",
    alt: "Naruto-inspired ninja character looking lost",
  },
  {
    name: "Titan",
    image: "/images/aot_character.png",
    color: "#c1666b",
    alt: "Attack on Titan-inspired warrior confused",
  },
  {
    name: "Detective",
    image: "/images/deathnote_character.png",
    color: "#06d6d6",
    alt: "Death Note-inspired detective searching",
  },
];

export default function NotFoundPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  useEffect(() => {
    // Rotate through characters
    const interval = setInterval(() => {
      setSelectedCharacter((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = characters[selectedCharacter]!;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#060913] via-[#0a0e1a] to-[#060913] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Floating anime decorative images */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Rasengan — top left */}
        <div className="absolute top-[12%] left-[8%] w-20 h-20 opacity-20 animate-float-slow hidden md:block">
          <Image
            src="/images/naruto_rasengan.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Death Note Apple — top right */}
        <div className="absolute top-[18%] right-[10%] w-14 h-14 opacity-15 animate-float-medium hidden md:block">
          <Image
            src="/images/deathnote_apple.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Wings of Freedom — bottom right */}
        <div className="absolute bottom-[12%] right-[8%] w-24 h-24 opacity-[0.08] animate-float-fast hidden md:block">
          <Image
            src="/images/aot_wings.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Extra Rasengan — bottom left */}
        <div className="absolute bottom-[20%] left-[12%] w-12 h-12 opacity-10 animate-float-fast hidden lg:block">
          <Image
            src="/images/naruto_rasengan.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl text-center space-y-8">
        {/* 404 Header */}
        <div className="space-y-3">
          <h1 className="text-8xl md:text-9xl font-black bg-linear-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <p className="text-lg text-primary font-bold tracking-widest uppercase">Page Not Found</p>
        </div>

        {/* Character Display */}
        <div className="flex justify-center py-8">
          <div
            className="transition-all duration-500 transform hover:scale-110 relative w-48 h-48 md:w-64 md:h-64"
            style={{
              filter: `drop-shadow(0 0 30px ${current.color}80)`,
            }}
          >
            <Image
              src={current.image}
              alt={current.alt}
              fill
              className="object-contain transition-opacity duration-500"
              priority
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Oops! Looks like you wandered off the map
          </h2>
          <p className="text-lg text-foreground/70 max-w-md mx-auto">
            This page doesn&apos;t exist. Our anime-inspired friends are just as confused as you
            are! Let&apos;s get you back on track.
          </p>
        </div>

        {/* Character Selector */}
        <div className="flex justify-center gap-3 py-4">
          {characters.map((char, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCharacter(idx)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCharacter === idx
                  ? `bg-${char.color} text-foreground shadow-lg`
                  : "bg-foreground/10 text-foreground/60 hover:bg-foreground/20"
              }`}
              style={
                selectedCharacter === idx
                  ? {
                      backgroundColor: char.color,
                      boxShadow: `0 0 20px ${char.color}80`,
                    }
                  : {}
              }
            >
              {char.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
          >
            Go Back
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-shadow"
          >
            Return Home
          </Button>
        </div>

        {/* Fun fact */}
        <div className="pt-8 border-t border-foreground/10">
          <p className="text-sm text-foreground/50 italic">
            Fun fact: Even fictional heroes get lost sometimes. But they always find their way back!
            🎌
          </p>
        </div>
      </div>
    </div>
  );
}
