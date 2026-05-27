"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function FormWorkspaceNav({ formId }: { formId: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/dashboard/forms/${formId}/settings`, label: "Details" },
    { href: `/dashboard/forms/${formId}/builder`, label: "Questions" },
    { href: `/dashboard/forms/${formId}/responses`, label: "Responses" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold border transition-colors",
            pathname === tab.href
              ? "bg-primary/15 border-primary/30 text-primary"
              : "border-white/10 text-foreground/70 hover:text-white hover:border-white/20",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
