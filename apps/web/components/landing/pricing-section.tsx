"use client";

import React from "react";
import { Button } from "~/components/ui/button";

export function PricingSection() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$0",
      subtitle: "For new creators",
      features: [
        "Create up to 10 forms",
        "500 responses per month",
        "Basic form styling",
        "Public share links",
      ],
      cta: "Start free",
      highlight: "Best for learning",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9/mo",
      subtitle: "Most popular",
      features: [
        "Create up to 100 forms",
        "5,000 responses per month",
        "Custom branding and themes",
        "Password protected forms",
      ],
      cta: "Upgrade now",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49/mo",
      subtitle: "For teams & agencies",
      features: [
        "Unlimited forms",
        "20,000 responses per month",
        "Team access and roles",
        "Priority support",
      ],
      cta: "Talk to sales",
      highlight: "Scale with confidence",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#04050a] border-t border-primary/6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-[0.18em] mb-4">
            Pricing Plans
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Choose a plan that fits your form-building journey.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70 text-base sm:text-lg">
            From a free starter tier to a fully-managed enterprise experience, get the controls you
            need to create forms, collect responses, and scale with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-3xl border p-8 shadow-xl shadow-black/20 transition-all duration-300 ${
                plan.popular
                  ? "border-primary bg-[#09101f] shadow-primary/20"
                  : "border-primary/10 bg-card/30"
              }`}
            >
              {plan.popular ? (
                <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase text-primary tracking-[0.2em]">
                  Most Popular
                </div>
              ) : null}
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/60">
                  {plan.subtitle}
                </p>
                <h3 className="text-2xl font-extrabold text-white mt-3">{plan.name}</h3>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-white">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm text-foreground/50">
                  {plan.highlight || "Perfect for focused creators."}
                </p>
              </div>
              <ul className="space-y-3 mb-8 text-left text-sm text-foreground/70">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/95 text-white font-semibold">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 mx-auto max-w-3xl text-center text-foreground/60 text-sm leading-7">
          <p>
            All plans include secure SSL hosting, automatic form publishing, and easy sharing for
            every survey and quiz you build.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
