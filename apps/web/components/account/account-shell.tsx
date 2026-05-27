"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Form<span className="text-primary">Craft</span>
          </span>
        </Link>

        <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-lg">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-foreground/60"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to dashboard
          </Button>
          <h1 className="text-2xl font-extrabold text-white">{title}</h1>
          <p className="text-sm text-foreground/60 mt-1 mb-6">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
