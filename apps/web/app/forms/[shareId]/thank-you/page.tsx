"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getFormTheme } from "~/lib/form-themes";
import { cn } from "~/lib/utils";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Thank you for your response!";
  const theme = getFormTheme(searchParams.get("theme"));

  return (
    <div className={cn("min-h-screen text-foreground flex items-center justify-center p-4 relative overflow-hidden", theme.bg)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none", theme.glow)} />
      <div className="absolute top-12 left-8 w-24 h-24 opacity-25 pointer-events-none">
        <Image src={theme.decorImage} alt="" fill className="object-contain" aria-hidden />
      </div>
      <div className={cn("relative z-10 max-w-xl w-full rounded-2xl border backdrop-blur-md p-10 text-center", theme.card)}>
        <div className="relative w-28 h-28 mx-auto mb-6">
          <Image
            src={theme.characterImage}
            alt=""
            fill
            className="object-contain"
            aria-hidden
          />
        </div>
        <p className={cn("text-xs uppercase tracking-[0.25em] mb-3", theme.accentText)}>
          {theme.japanese}
        </p>
        <h1 className="text-3xl font-bold mb-4">Submission received</h1>
        <p className="text-foreground/75 mb-8">{message}</p>
        <Button className={theme.button} onClick={() => (window.location.href = "/")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
