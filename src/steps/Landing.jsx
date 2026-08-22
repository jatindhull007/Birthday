import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, ArrowRight, Sparkles } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playLoop, playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';
import ProgressBar from '../components/ProgressBar';

export default function Landing({ data }) {
  const { nextStep } = useStepMachine();

  const [typedLine, setTypedLine] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTargetText, setShowTargetText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const fullLine = "INITIALIZING MISSION...";

  useEffect(() => {
    playLoop('playful');

    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx <= fullLine.length) {
        setTypedLine(fullLine.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setIsTypingComplete(true);
      }
    }, 35);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (!isTypingComplete) return;

    const startTime = Date.now();
    const duration = 1800;

    const progInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progInterval);
        playSfx('sfx-chime');

        setTimeout(() => {
          setShowTargetText(true);
        }, 300);

        setTimeout(() => {
          setShowButton(true);
        }, 1000);
      }
    }, 30);

    return () => clearInterval(progInterval);
  }, [isTypingComplete]);

  const handleStart = () => {
    playSfx('sfx-transition');
    nextStep();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10 font-body">
      {/* Oversized faint focal background radar glyph */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 text-accent-glow">
        <Radar className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] animate-spin-slow" />
      </div>

      <div className="w-full max-w-xl mx-auto text-center space-y-6 sm:space-y-8 relative z-20">
        {/* Line 1: Typing text (uppercase, letter-spaced) */}
        <div className="min-h-[30px] flex items-center justify-center">
          <span className="font-body text-xs sm:text-sm font-bold tracking-widest uppercase text-text-muted">
            {typedLine}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-accent-primary ml-1.5 animate-pulse align-middle" />
            )}
          </span>
        </div>

        {/* Line 2: Progress Card with percentage counter */}
        {isTypingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3 p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-text-muted font-body">
              <span className="flex items-center gap-2 text-text-primary">
                <Sparkles className="w-4 h-4 text-accent-glow animate-pulse" />
                LOADING SQUAD ASSETS
              </span>
              <span className="text-accent-glow font-bold font-display text-sm sm:text-base">{progress}%</span>
            </div>
            <ProgressBar
              progress={progress}
              variant="primary"
              showPulseAtComplete={true}
            />
          </motion.div>
        )}

        {/* Line 3: Target Detected & Birthday Status Card */}
        {showTargetText && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: TIMING.panel }}
            className="p-7 sm:p-9 rounded-3xl glass-panel space-y-3 shadow-2xl border border-accent-primary/40 glow-primary"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm uppercase font-bold tracking-widest text-accent-glow font-display"
            >
              TARGET DETECTED: {data.name}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary leading-tight"
            >
              STATUS: BIRTHDAY DETECTED 🎂
            </motion.h1>
          </motion.div>
        )}

        {/* Line 4: CTA Button with breathing glow pulse */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: TIMING.panel }}
            className="pt-2 flex justify-center"
          >
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(88,101,242,0.4)',
                  '0 0 35px rgba(88,101,242,0.75)',
                  '0 0 20px rgba(88,101,242,0.4)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="px-9 sm:px-11 py-4 sm:py-4.5 rounded-full bg-accent-primary text-text-primary font-display font-bold text-base sm:text-lg glow-primary hover:bg-[#4752C4] shadow-2xl flex items-center gap-3 cursor-pointer transition-all"
            >
              <span>ENTER THE SECRET PORTAL</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
