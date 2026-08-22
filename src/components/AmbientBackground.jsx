import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Lookup for ambient blob colors per step
const STEP_COLORS = {
  0: { blob1: '#5865F2', blob2: '#8B7FF5', blob3: '#57F287' }, // Dark game lobby
  1: { blob1: '#5865F2', blob2: '#ED4245', blob3: '#8B7FF5' }, // OTP & Security
  2: { blob1: '#5865F2', blob2: '#ED4245', blob3: '#FFC876' }, // Investigation Dossier
  3: { blob1: '#F3E9D8', blob2: '#8B5E3C', blob3: '#FFC876' }, // Scrapbook
  4: { blob1: '#FFC876', blob2: '#FF8FB1', blob3: '#5865F2' }, // Love Test warming
  5: { blob1: '#5865F2', blob2: '#FFC876', blob3: '#57F287' }, // Celebration
  6: { blob1: '#08090C', blob2: '#14151C', blob3: '#5865F2' }, // Reveal Black
};

export default function AmbientBackground({ currentStep }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const colors = STEP_COLORS[currentStep] || STEP_COLORS[0];

  useEffect(() => {
    // Desktop cursor follow glow
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (currentStep === 6) {
    // Step 6: Stark, minimal reveal-black with faint drifting starfield/particle dust only
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-reveal-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40" />
      </div>
    );
  }

  if (currentStep === 3) {
    // Step 3: Scrapbook mood
    return (
      <div className="pointer-events-none fixed inset-0 z-0 film-grain opacity-90" />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Subtle Grain Overlay on Steps 0-2 */}
      {currentStep <= 2 && <div className="absolute inset-0 grain-overlay opacity-70" />}

      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [-40, 50, -20, -40],
          y: [-20, 40, -50, -20],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        style={{ backgroundColor: colors.blob1 }}
        className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
      />

      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [40, -30, 20, 40],
          y: [30, -50, 40, 30],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        style={{ backgroundColor: colors.blob2 }}
        className="absolute top-1/3 -right-24 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-25"
      />

      {/* Blob 3 */}
      <motion.div
        animate={{
          x: [-30, 40, -40, -30],
          y: [40, -20, 30, 40],
          scale: [0.95, 1.2, 1, 0.95],
        }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        style={{ backgroundColor: colors.blob3 }}
        className="absolute -bottom-24 left-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-25"
      />

      {/* Desktop Cursor Follow Glow (Radial Gradient) */}
      <div
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        className="hidden md:block absolute w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(88,101,242,0.15)_0%,_transparent_70%)] pointer-events-none blur-xl transition-all duration-75"
      />
    </div>
  );
}
