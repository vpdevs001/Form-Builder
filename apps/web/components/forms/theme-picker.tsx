"use client";

import { FORM_THEME_OPTIONS, type FormThemeName } from "~/lib/form-themes";
import { cn } from "~/lib/utils";

interface ThemePickerProps {
  value: FormThemeName;
  onChange: (theme: FormThemeName) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {FORM_THEME_OPTIONS.map((theme) => {
        const selected = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all cursor-pointer",
              selected ? `${theme.border} ring-2 ring-offset-2 ring-offset-[#060913]` : "border-white/10 hover:border-white/20",
            )}
          >
            <div
              className="h-2 w-full rounded-full mb-3"
              style={{ backgroundColor: theme.accent }}
            />
            <p className="font-bold text-white">{theme.label}</p>
            <p className="text-xs text-foreground/50 mt-1">{theme.japanese}</p>
          </button>
        );
      })}
    </div>
  );
}
