export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  title: string;
  badge: string;
  badgeColor: string; // 'orange' | 'red' | 'green'
  description: string;
  imagePath: string;
  details: string[];
}

export interface AnimeTheme {
  id: string;
  name: string;
  japanese: string;
  tagline: string;
  description: string;
  accentClass: string; // for border/glow colors
  glowClass: string;
  bgGradient: string;
  bgImage: string;
  fieldsPreview: string[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Anime Themes", href: "#themes" },
  { label: "How It Works", href: "#how-it-works" },
];

export const FEATURES: Feature[] = [
  {
    id: "fields",
    title: "10+ Rich Field Types",
    badge: "Form Design",
    badgeColor: "orange",
    description:
      "Craft questions that collect exactly what you need. From standard text and email fields to star ratings, dropdown choices, and secure date pickers.",
    imagePath: "/images/feature_fields.png",
    details: [
      "Built-in schema validation on backend",
      "Interactive slider & rating inputs",
      "Required field checks & customized placeholders",
    ],
  },
  {
    id: "themes",
    title: "Legendary Anime Themes",
    badge: "Visual Style",
    badgeColor: "red",
    description:
      "Break away from boring surveys. Skin your forms in legendary styles — from a Naruto parchment scroll to a Ryuk shinigami notebook or AoT military parchment.",
    imagePath: "/images/feature_themes.png",
    details: [
      "Naruto: Orange chakra glow, warm scroll look",
      "Death Note: Deep crimson, gothic black aura",
      "Attack on Titan: Forest emerald, weathered canvas",
    ],
  },
  {
    id: "analytics",
    title: "Chakra-Powered Analytics",
    badge: "Real-Time Tracking",
    badgeColor: "green",
    description:
      "Gain visual mastery over your data. View real-time submission volumes, visitor metrics, completion speeds, and detailed choice summaries with interactive charts.",
    imagePath: "/images/feature_analytics.png",
    details: [
      "Total and unique submission counters",
      "Interactive graphs showing trends over time",
      "Field-by-field answer breakdown charts",
    ],
  },
  {
    id: "share",
    title: "Instant Publish & Share",
    badge: "Seamless Distribution",
    badgeColor: "orange",
    description:
      "Deploy your forms instantly to the web. Get a short, dedicated sharing link and clean embed codes to collect data anywhere in the shinobi world.",
    imagePath: "/images/feature_share.png",
    details: [
      "One-click publish and unpublish controls",
      "Dedicated, SEO-friendly form public pages",
      "Auto-generated QR codes for physical handouts",
    ],
  },
  {
    id: "security",
    title: "Shinigami Shield Protection",
    badge: "Secure Access",
    badgeColor: "red",
    description:
      "Maintain absolute control over submissions. Restrict spam with IP rate-limiting, shield with passwords, set response quotas, or schedule expiration dates.",
    imagePath: "/images/feature_security.png",
    details: [
      "Robust password-protected access",
      "Submit limits (e.g. max 100 submissions total)",
      "Strict IP rate limits and submission intervals",
    ],
  },
  {
    id: "notifications",
    title: "Survey Corps Broadcasts",
    badge: "Instant Alerts",
    badgeColor: "green",
    description:
      "Never miss a beat. Configure immediate email notifications to trigger on every submission, or automatically email custom copy receipts to your respondents.",
    imagePath: "/images/feature_notifications.png",
    details: [
      "Instant email notifications for form owners",
      "Customizable respondent receipt emails",
      "Reliable backend mail system integration",
    ],
  },
];

export const ANIME_THEMES: AnimeTheme[] = [
  {
    id: "naruto",
    name: "Hidden Leaf",
    japanese: "木ノ葉隠れの里",
    tagline: "Believe it! Build forms with ninja-level power.",
    description:
      "Draped in classic Naruto orange, dark navy accents, and warm parchment backgrounds. Features floating shuriken elements and warm chakra glows.",
    accentClass: "text-[#ff6b00] border-[#ff6b00]/30 hover:border-[#ff6b00]",
    glowClass: "animate-chakra",
    bgGradient: "from-[#ff6b00]/20 via-black to-[#ff6b00]/5",
    bgImage:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=800", // stylised orange/dark background
    fieldsPreview: ["Short Text", "Star Rating", "Dropdown Selection"],
  },
  {
    id: "deathnote",
    name: "Shinigami Realm",
    japanese: "死神界",
    tagline: "The human whose name is written in this note...",
    description:
      "A dark, gothic theme styled with Ryuk's signature apple crimson, obsidian black overlays, and stark typewriter fonts. Emits a dangerous dark red aura.",
    accentClass: "text-[#990000] border-[#990000]/30 hover:border-[#990000]",
    glowClass: "animate-shinigami",
    bgGradient: "from-[#990000]/20 via-black to-[#990000]/5",
    bgImage:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800", // dark mist/gothic background
    fieldsPreview: ["Death Date Picker", "Name Input", "Reason Textarea"],
  },
  {
    id: "aot",
    name: "Survey Corps",
    japanese: "調査兵団",
    tagline: "Dedicate your heart! Collect massive insights.",
    description:
      "Styled with forest-emerald green from the Wings of Freedom capes, warm sand textures, and bold metallic borders. Features steel-blue accents.",
    accentClass: "text-[#2e7d32] border-[#2e7d32]/30 hover:border-[#2e7d32]",
    glowClass: "animate-survey",
    bgGradient: "from-[#2e7d32]/20 via-black to-[#2e7d32]/5",
    bgImage:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800", // deep forest/wall background
    fieldsPreview: ["District Choice", "Height Rating", "Email Notification"],
  },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/vpdevs001",
  twitter: "https://x.com/Ved_PandeyOG",
  youtube: "https://www.youtube.com/@DevWithVed",
  instagram: "https://www.instagram.com/vedpandey_dev",
  linkedin: "https://www.linkedin.com/in/ved-pandey",
};
