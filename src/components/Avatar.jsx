import React from 'react';

// Clean vector boy avatars tailored for the squad
export default function Avatar({ name, className = "w-14 h-14" }) {
  const normalized = (name || '').toLowerCase().trim();

  // Roy Avi - Gamer Boy with Headphones & Blue Hoodie
  if (normalized.includes('roy') || normalized.includes('avi')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-accent-primary shadow-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-accent-primary flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FDDCB1" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E8C39E" />
          <path d="M26 44 C26 24, 74 24, 74 44 C72 30, 60 22, 50 22 C38 22, 28 30, 26 44 Z" fill="#1E293B" />
          <path d="M30 40 C34 30, 48 26, 68 34 C60 26, 44 24, 30 40 Z" fill="#0F172A" />
          <circle cx="43" cy="48" r="2.5" fill="#0F172A" />
          <circle cx="57" cy="48" r="2.5" fill="#0F172A" />
          <path d="M46 56 Q50 60 54 56" stroke="#C89D7C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M22 46 C22 28, 78 28, 78 46" stroke="#5865F2" strokeWidth="5" strokeLinecap="round" fill="none" />
          <rect x="20" y="42" width="8" height="14" rx="4" fill="#3B82F6" />
          <rect x="72" y="42" width="8" height="14" rx="4" fill="#3B82F6" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#5865F2" />
        </svg>
      </div>
    );
  }

  // Aaru - Warm Boy with Undercut & Amber Hoodie
  if (normalized.includes('aaru')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-warm-gold shadow-xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-700 flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FCE2C6" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E5C4A3" />
          <path d="M28 42 C28 20, 72 20, 72 42 C70 26, 62 18, 50 18 C38 18, 30 26, 28 42 Z" fill="#331A00" />
          <path d="M38 22 L46 12 L52 20 L58 12 L64 22 Z" fill="#4D2600" />
          <circle cx="43" cy="48" r="2.5" fill="#1E293B" />
          <circle cx="57" cy="48" r="2.5" fill="#1E293B" />
          <path d="M45 56 Q50 61 55 56" stroke="#D19C70" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#FFC876" />
          <path d="M42 70 L50 82 L58 70 Z" fill="#D97706" />
        </svg>
      </div>
    );
  }

  // 4JJU - Cool Gamer Boy with Cap & Neon Purple Hoodie
  if (normalized.includes('4jju') || normalized.includes('ajju')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-warm-pink shadow-xl bg-gradient-to-br from-purple-950 via-slate-900 to-pink-700 flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FEE3C8" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E8C39E" />
          <path d="M26 38 C26 24, 74 24, 74 38 L26 38 Z" fill="#FF8FB1" />
          <ellipse cx="50" cy="38" rx="26" ry="6" fill="#F43F5E" />
          <path d="M26 38 C24 46, 26 52, 30 54" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <path d="M74 38 C76 46, 74 52, 70 54" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="43" cy="49" r="2.5" fill="#0F172A" />
          <path d="M54 49 Q57 46 60 49" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M45 57 Q50 62 55 57" stroke="#C89D7C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#8B5CF6" />
        </svg>
      </div>
    );
  }

  // Ninju (or Dev) - Cool Boy with Glasses & Green Hoodie
  if (normalized.includes('ninju') || normalized.includes('dev')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-emerald-400 shadow-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-700 flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FDDCB1" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E8C39E" />
          <path d="M26 42 C26 22, 74 22, 74 42 C70 28, 62 20, 50 20 C38 20, 30 28, 26 42 Z" fill="#1C1917" />
          {/* Cool Glasses */}
          <rect x="36" y="44" width="12" height="10" rx="3" stroke="#10B981" strokeWidth="2" fill="rgba(16,185,129,0.15)" />
          <rect x="52" y="44" width="12" height="10" rx="3" stroke="#10B981" strokeWidth="2" fill="rgba(16,185,129,0.15)" />
          <line x1="48" y1="49" x2="52" y2="49" stroke="#10B981" strokeWidth="2" />
          <circle cx="42" cy="49" r="2" fill="#0F172A" />
          <circle cx="58" cy="49" r="2" fill="#0F172A" />
          <path d="M46 58 Q50 61 54 58" stroke="#C89D7C" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // Naitik (or Jordan) - Chill Boy with Beanie & Cyan Hoodie
  if (normalized.includes('naitik') || normalized.includes('jordan')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-700 flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FCE2C6" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E5C4A3" />
          {/* Beanie */}
          <path d="M26 38 C26 22, 74 22, 74 38 L26 38 Z" fill="#06B6D4" />
          <rect x="24" y="34" width="52" height="8" rx="3" fill="#0891B2" />
          <circle cx="43" cy="49" r="2.5" fill="#0F172A" />
          <circle cx="57" cy="49" r="2.5" fill="#0F172A" />
          <path d="M46 57 Q50 61 54 57" stroke="#C89D7C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#06B6D4" />
        </svg>
      </div>
    );
  }

  // OneHp / HP (or Rohan) - Energetic Boy with Red Jacket
  if (normalized.includes('onehp') || normalized.includes('hp') || normalized.includes('rohan')) {
    return (
      <div className={`${className} rounded-full overflow-hidden border-2 border-red-500 shadow-xl bg-gradient-to-br from-red-950 via-slate-900 to-rose-700 flex items-center justify-center relative shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="46" r="22" fill="#FDDCB1" />
          <path d="M42 66 L58 66 L62 82 L38 82 Z" fill="#E8C39E" />
          <path d="M26 42 C26 22, 74 22, 74 42 C70 26, 60 18, 50 18 C40 18, 30 26, 26 42 Z" fill="#292524" />
          <circle cx="43" cy="48" r="2.5" fill="#0F172A" />
          <circle cx="57" cy="48" r="2.5" fill="#0F172A" />
          <path d="M46 56 Q50 60 54 56" stroke="#C89D7C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M24 88 C24 74, 40 70, 50 70 C60 70, 76 74, 76 88 L76 100 L24 100 Z" fill="#EF4444" />
          <path d="M45 70 L50 84 L55 70 Z" fill="#B91C1C" />
        </svg>
      </div>
    );
  }

  // Generic clean boy avatar fallback based on name
  const initials = (name || 'B').slice(0, 2).toUpperCase();
  return (
    <div className={`${className} rounded-full overflow-hidden border-2 border-accent-primary shadow-xl bg-gradient-to-tr from-bg-base-deep via-slate-800 to-accent-primary flex items-center justify-center font-display font-extrabold text-white text-lg tracking-wider shrink-0`}>
      {initials}
    </div>
  );
}
