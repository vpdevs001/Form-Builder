"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Thank you for your response!";

  return (
    <div className="min-h-screen bg-[#060913] text-foreground flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-card/30 border border-primary/10 rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Submission received</h1>
        <p className="text-foreground/75 mb-6">{message}</p>
        <Button className="bg-primary" onClick={() => (window.location.href = "/")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
