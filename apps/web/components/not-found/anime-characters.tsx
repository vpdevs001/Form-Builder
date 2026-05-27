/**
 * Original anime-inspired character illustrations
 * Cute action figure style SVGs inspired by anime aesthetic
 */

export function NinjaCharacter() {
  return (
    <svg viewBox="0 0 100 120" className="w-24 h-24">
      {/* Head */}
      <circle cx="50" cy="30" r="18" fill="#f4a261" />

      {/* Mask/Eyes */}
      <rect x="40" y="25" width="20" height="10" fill="#060913" rx="2" />
      <circle cx="44" cy="29" r="2.5" fill="#ffd60a" />
      <circle cx="56" cy="29" r="2.5" fill="#ffd60a" />

      {/* Hair */}
      <path d="M 35 25 Q 32 15 50 12 Q 68 15 65 25" fill="#000" />

      {/* Body */}
      <rect x="38" y="48" width="24" height="28" fill="#e76f51" rx="4" />

      {/* Arms */}
      <rect x="20" y="52" width="18" height="8" fill="#f4a261" rx="4" />
      <rect x="62" y="52" width="18" height="8" fill="#f4a261" rx="4" />

      {/* Legs */}
      <rect x="40" y="80" width="8" height="20" fill="#2a2a2a" />
      <rect x="52" y="80" width="8" height="20" fill="#2a2a2a" />

      {/* Belt detail */}
      <rect x="38" y="74" width="24" height="4" fill="#ffd60a" />
    </svg>
  );
}

export function TitanCharacter() {
  return (
    <svg viewBox="0 0 100 140" className="w-24 h-24">
      {/* Head - larger */}
      <circle cx="50" cy="35" r="22" fill="#d4a574" />

      {/* Intense eyes */}
      <circle cx="40" cy="32" r="4" fill="#06d6d6" />
      <circle cx="60" cy="32" r="4" fill="#06d6d6" />
      <circle cx="40" cy="32" r="2.5" fill="#000" />
      <circle cx="60" cy="32" r="2.5" fill="#000" />

      {/* Mouth - determined */}
      <path d="M 45 40 Q 50 43 55 40" stroke="#000" strokeWidth="1.5" fill="none" />

      {/* Spiky hair */}
      <path
        d="M 35 15 L 33 8 M 45 10 L 45 2 M 55 10 L 57 2 M 65 15 L 67 8"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Large muscular body */}
      <ellipse cx="50" cy="65" rx="18" ry="25" fill="#c1666b" />

      {/* Chest detail */}
      <line x1="50" y1="45" x2="50" y2="85" stroke="#a84c59" strokeWidth="1" />

      {/* Arms */}
      <rect x="18" y="60" width="16" height="10" fill="#d4a574" rx="5" />
      <rect x="66" y="60" width="16" height="10" fill="#d4a574" rx="5" />

      {/* Legs */}
      <rect x="42" y="92" width="8" height="28" fill="#1a1a1a" />
      <rect x="50" y="92" width="8" height="28" fill="#1a1a1a" />
    </svg>
  );
}

export function DetectiveCharacter() {
  return (
    <svg viewBox="0 0 100 120" className="w-24 h-24">
      {/* Head */}
      <circle cx="50" cy="32" r="20" fill="#e8d5c4" />

      {/* Hair - dark and spiky */}
      <path
        d="M 32 25 Q 30 8 50 5 Q 70 8 68 25 L 65 20 L 55 18 L 50 15 L 45 18 L 35 20 Z"
        fill="#1a1a1a"
      />

      {/* Eyes - intense and intelligent */}
      <circle cx="42" cy="30" r="3.5" fill="#000" />
      <circle cx="58" cy="30" r="3.5" fill="#000" />
      <circle cx="43" cy="29" r="1.5" fill="#fff" />
      <circle cx="59" cy="29" r="1.5" fill="#fff" />

      {/* Smirk */}
      <path
        d="M 45 38 Q 50 41 55 38"
        stroke="#c4a69d"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Formal shirt/vest */}
      <rect x="36" y="52" width="28" height="32" fill="#1a1a1a" rx="3" />

      {/* White shirt detail */}
      <rect x="40" y="55" width="20" height="8" fill="#fff" rx="2" />

      {/* Tie/detail */}
      <rect x="48" y="62" width="4" height="15" fill="#dc2f02" />

      {/* Arms */}
      <rect x="18" y="56" width="16" height="10" fill="#e8d5c4" rx="5" />
      <rect x="66" y="56" width="16" height="10" fill="#e8d5c4" rx="5" />

      {/* Legs */}
      <rect x="42" y="85" width="7" height="22" fill="#000" />
      <rect x="51" y="85" width="7" height="22" fill="#000" />
    </svg>
  );
}
