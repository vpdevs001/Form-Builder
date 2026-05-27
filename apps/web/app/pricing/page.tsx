"use client";

import { Navbar } from "~/components/landing/navbar";
import PricingSection from "~/components/landing/pricing-section";
import { Footer } from "~/components/landing/footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#060913]">
      <Navbar />
      <main className="pt-24">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
