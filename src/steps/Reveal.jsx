import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING } from '../lib/motion';
import { stopAll, playLoop, playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';
import { fireConfetti } from '../components/ConfettiBurst';
import TeamGrid from '../components/TeamGrid';

export default function Reveal({ data }) {
  const { reset } = useStepMachine();

  // Phase: 'silence' | 'lines' | 'title' | 'grid'
  const [phase, setPhase] = useState('silence');
  const [lineIdx, setLineIdx] = useState(0);

  const lines = data.finalMessage;

  // 1. Initial 2.5s absolute silence beat
  useEffect(() => {
    stopAll(0);

    const silenceTimer = setTimeout(() => {
      setPhase('lines');
    }, 2500);

    return () => clearTimeout(silenceTimer);
  }, []);

  // 2. Sequential line-by-line reveal in Fraunces font
  useEffect(() => {
    if (phase === 'lines') {
      const interval = setInterval(() => {
        setLineIdx((prev) => {
          if (prev + 1 >= lines.length) {
            clearInterval(interval);
            // Move to big title moment
            setTimeout(() => {
              setPhase('title');
              playLoop('emotional');
              playSfx('sfx-chime');
              fireConfetti('grand');

              // Hold title for ~2.2s then transition to team grid
              setTimeout(() => {
                setPhase('grid');
              }, 2200);
            }, 1200);
            return lines.length - 1;
          }
          return prev + 1;
        });
      }, TIMING.revealLineHold + 600);

      return () => clearInterval(interval);
    }
  }, [phase, lines.length]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-reveal-black text-text-primary overflow-hidden relative z-10 font-body">
      {/* Faint drifting starfield/particle dust layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-warm-gold rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-warm-pink rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 1. SILENCE & LINE-BY-LINE REVEAL (FRAUNCES EMOTIONAL FONT) */}
      {(phase === 'silence' || phase === 'lines') && (
        <div className="w-full max-w-3xl mx-auto text-center px-4 z-10">
          <AnimatePresence mode="wait">
            {phase === 'lines' && (
              <motion.div
                key={`line-${lineIdx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="space-y-6"
              >
                <p className="font-emotional italic text-3xl sm:text-5xl md:text-6xl text-text-primary tracking-wide leading-relaxed font-normal">
                  “{lines[lineIdx]}”
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-accent-primary via-warm-pink to-warm-gold mx-auto mt-8 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. BIG TITLE MOMENT */}
      {phase === 'title' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-4xl mx-auto text-center space-y-5 px-4 z-10"
        >
          <h1 className="font-emotional font-bold text-4xl sm:text-6xl md:text-7xl text-warm-gold tracking-tight drop-shadow-2xl leading-tight">
            🎉 HAPPY BIRTHDAY, {data.name.toUpperCase()} 🎉
          </h1>
          <p className="font-body font-semibold text-lg sm:text-2xl text-text-muted">
            From the whole squad with love.
          </p>
        </motion.div>
      )}

      {/* 3. TEAM PHOTO GRID FINALE */}
      {phase === 'grid' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-4xl mx-auto z-10"
        >
          <TeamGrid
            team={data.team}
            teamMessages={data.teamMessages}
            name={data.name}
            onReplay={reset}
          />
        </motion.div>
      )}
    </div>
  );
}
