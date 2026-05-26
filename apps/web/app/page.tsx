import { api } from "~/trpc/server";
import { Navbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero-section";
import { FeaturesSection } from "~/components/landing/features-section";
import { AnimeThemesSection } from "~/components/landing/anime-themes-section";
import { HowItWorksSection } from "~/components/landing/how-it-works-section";
import { CTASection } from "~/components/landing/cta-section";
import { Footer } from "~/components/landing/footer";
import { ScrollWrapper } from "~/components/landing/client-wrapper";

export default async function Home() {
  // Gracefully fetch server status; fallback if API isn't fully initialized
  let apiStatus = "Offline";
  try {
    const res = await api.health.getHealth.query();
    apiStatus = res.status || "Online";
  } catch (err) {
    console.error("tRPC health check failed during build:", err);
    apiStatus = "Degraded";
  }

  return (
    <>
      {/* Client Scroll Observer Hook */}
      <ScrollWrapper />

      <Navbar />

      <main className="min-h-screen">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Features Section */}
        <FeaturesSection />

        {/* 3. Anime Themes Section */}
        <AnimeThemesSection />

        {/* 4. How It Works Section */}
        <HowItWorksSection />

        {/* 5. CTA Section */}
        <CTASection />
      </main>

      <Footer />

      {/* Subtle Dynamic API Server Health Glow Badge in bottom right */}
      <div className="fixed bottom-4 left-4 z-40 bg-[#060913]/90 border border-primary/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg pointer-events-none select-none text-[9px] font-mono font-bold">
        <span className={`w-1.5 h-1.5 rounded-full ${
          apiStatus === "Online" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"
        }`} />
        <span className="text-foreground/50">SERVER:</span>
        <span className="text-primary">{apiStatus.toUpperCase()}</span>
      </div>
    </>
  );
}

