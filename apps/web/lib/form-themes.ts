export type FormThemeName = "Naruto" | "Death Note" | "Attack On Titan";

export interface FormThemeStyle {
  id: FormThemeName;
  label: string;
  japanese: string;
  /** Character art shown on fill / thank-you pages */
  characterImage: string;
  /** Decorative accent (not hero_visual) */
  decorImage: string;
  bg: string;
  glow: string;
  border: string;
  accent: string;
  accentText: string;
  button: string;
  progress: string;
  card: string;
}

export const FORM_THEMES: Record<FormThemeName, FormThemeStyle> = {
  Naruto: {
    id: "Naruto",
    label: "Naruto",
    japanese: "木ノ葉",
    characterImage: "/images/naruto_character.png",
    decorImage: "/images/naruto_rasengan.png",
    bg: "bg-[#060913]",
    glow: "from-[#ff6b00]/20 via-transparent to-[#ff6b00]/5",
    border: "border-[#ff6b00]/30",
    accent: "#ff6b00",
    accentText: "text-[#ff6b00]",
    button: "bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white shadow-[0_0_20px_rgba(255,107,0,0.35)]",
    progress: "bg-[#ff6b00]",
    card: "bg-[#0c101c]/80 border-[#ff6b00]/20",
  },
  "Death Note": {
    id: "Death Note",
    label: "Death Note",
    japanese: "死神",
    characterImage: "/images/deathnote_character.png",
    decorImage: "/images/deathnote_apple.png",
    bg: "bg-black",
    glow: "from-[#990000]/25 via-transparent to-[#990000]/10",
    border: "border-[#990000]/35",
    accent: "#990000",
    accentText: "text-[#cc0000]",
    button: "bg-[#990000] hover:bg-[#770000] text-white font-mono shadow-[0_0_20px_rgba(153,0,0,0.35)]",
    progress: "bg-[#990000]",
    card: "bg-zinc-950/90 border-[#990000]/30 font-mono",
  },
  "Attack On Titan": {
    id: "Attack On Titan",
    label: "Attack on Titan",
    japanese: "調査兵団",
    characterImage: "/images/aot_character.png",
    decorImage: "/images/aot_wings.png",
    bg: "bg-[#0a0f0a]",
    glow: "from-[#2e7d32]/20 via-transparent to-[#8d6e63]/10",
    border: "border-[#2e7d32]/35",
    accent: "#2e7d32",
    accentText: "text-[#4caf50]",
    button: "bg-[#2e7d32] hover:bg-[#1b5e20] text-white shadow-[0_0_20px_rgba(46,125,50,0.35)]",
    progress: "bg-[#2e7d32]",
    card: "bg-[#0d120d]/85 border-[#2e7d32]/25",
  },
};

export function getFormTheme(theme?: string | null): FormThemeStyle {
  if (theme && theme in FORM_THEMES) {
    return FORM_THEMES[theme as FormThemeName];
  }
  return FORM_THEMES.Naruto;
}

export const FORM_THEME_OPTIONS = Object.values(FORM_THEMES);
