import React from 'react';

export default function AmbientBackground({ currentAct }) {
  if (currentAct === 3) {
    // Scrapbook warm paper mood
    return (
      <div className="pointer-events-none fixed inset-0 z-0 film-grain opacity-70">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-amber-950/20" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Ambient Blurple & Fuchsia Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5865F2]/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-[#EB459E]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-[#57F287]/10 rounded-full blur-3xl" />

      {/* Subtle Floating Sparkles */}
      <div className="absolute top-1/4 left-1/6 w-1.5 h-1.5 rounded-full bg-white/30 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-[#5865F2]/40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 rounded-full bg-[#FEE75C]/30 animate-float" style={{ animationDelay: '1s' }} />
    </div>
  );
}
