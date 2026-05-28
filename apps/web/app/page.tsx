import { Navbar } from "~/components/landing/navbar";
import { HeroSection } from "~/components/landing/hero-section";
import { FeaturesSection } from "~/components/landing/features-section";
import { AnimeThemesSection } from "~/components/landing/anime-themes-section";
import { HowItWorksSection } from "~/components/landing/how-it-works-section";
import { CTASection } from "~/components/landing/cta-section";
import { Footer } from "~/components/landing/footer";
import { ScrollWrapper } from "~/components/landing/client-wrapper";
import PricingSection from "~/components/landing/pricing-section";

export default function Home() {
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

        {/* 5. Pricing Section */}
        <PricingSection />

        {/* 6. CTA Section */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
