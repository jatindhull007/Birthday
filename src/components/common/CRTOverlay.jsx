import React from 'react';

export default function CRTOverlay({ showScanlines = true, isWarm = false }) {
  if (isWarm) {
    return (
      <div className="pointer-events-none fixed inset-0 z-40 film-grain opacity-60">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-amber-950/20" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* Subtle CRT Screen Vignette */}
      <div className="absolute inset-0 crt-glow" />
      
      {/* Scanline pattern */}
      {showScanlines && (
        <div className="absolute inset-0 scanlines-overlay opacity-40 mix-blend-overlay" />
      )}

      {/* Cyber Corner Markers */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-purple-500/40" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-purple-500/40" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-purple-500/40" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-purple-500/40" />
    </div>
  );
}
