import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, LogOut, Heart } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { stopAll, playSfx } from '../lib/audio';
import { fireConfetti } from './ConfettiBurst';
import Avatar from './Avatar';

export default function TeamGrid({ team, teamMessages, name, onReplay }) {
  const [showExitInter, setShowExitInter] = useState(false);
  const [isFinalEndState, setIsFinalEndState] = useState(false);

  const handleReplayClick = () => {
    stopAll();
    playSfx('sfx-digit');
    onReplay();
  };

  const handleExitClick = () => {
    playSfx('sfx-digit');
    setShowExitInter(true);
    setTimeout(() => {
      setIsFinalEndState(true);
      fireConfetti('grand');
    }, 2000);
  };

  const half = Math.floor(team.length / 2);
  const itemsWithCenterCake = [
    ...team.slice(0, half),
    { isCake: true, name: "VIP OF THE DAY" },
    ...team.slice(half),
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-6 relative font-body">
      {/* Floating Parallax Drift Quote Cards around edges */}
      {teamMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{
            opacity: 0.95,
            x: 0,
            y: [-3, 3, -3],
          }}
          transition={{
            y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
            opacity: { delay: 0.6, duration: TIMING.panel },
          }}
          className="hidden lg:block absolute -top-4 -left-12 max-w-[260px] p-5 rounded-3xl glass-panel shadow-2xl pointer-events-none transform -rotate-3 border border-white/15"
        >
          <p className="text-xs sm:text-sm text-text-primary italic font-body leading-relaxed">
            "{teamMessages[0].message}"
          </p>
          <span className="text-xs text-accent-glow font-display font-bold block mt-2">
            — {teamMessages[0].name}
          </span>
        </motion.div>
      )}

      {teamMessages.length > 1 && (
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{
            opacity: 0.95,
            x: 0,
            y: [3, -3, 3],
          }}
          transition={{
            y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
            opacity: { delay: 0.8, duration: TIMING.panel },
          }}
          className="hidden lg:block absolute top-1/3 -right-10 max-w-[260px] p-5 rounded-3xl glass-panel shadow-2xl pointer-events-none transform rotate-3 border border-white/15"
        >
          <p className="text-xs sm:text-sm text-text-primary italic font-body leading-relaxed">
            "{teamMessages[1].message}"
          </p>
          <span className="text-xs text-warm-pink font-display font-bold block mt-2">
            — {teamMessages[1].name}
          </span>
        </motion.div>
      )}

      {/* Responsive Team Avatar Grid with Staggered Scale-in */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl mx-auto items-center justify-center transition-opacity duration-700 ${isFinalEndState ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {itemsWithCenterCake.map((member, idx) => {
          if (member.isCake) {
            return (
              <motion.div
                key="center-cake"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * idx, duration: TIMING.panel }}
                className="flex flex-col items-center justify-center p-5 rounded-3xl bg-gradient-to-br from-warm-gold/25 via-warm-pink/20 to-accent-primary/25 border-2 border-warm-gold/60 shadow-[0_0_35px_rgba(255,200,118,0.35)] transform hover:scale-105 transition-transform"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-warm-gold/20 flex items-center justify-center text-4xl sm:text-5xl shadow-inner animate-pulse">
                  🎂
                </div>
                <span className="font-display font-bold text-sm sm:text-base text-warm-gold mt-2 text-center">
                  {name}
                </span>
                <span className="text-[10px] uppercase font-bold text-warm-gold/90 tracking-wider font-display">
                  BIRTHDAY VIP
                </span>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * idx, duration: TIMING.panel }}
              className="flex flex-col items-center text-center space-y-2 group cursor-pointer"
            >
              <div className="group-hover:scale-108 transition-transform duration-300">
                <Avatar name={member.name} className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>
              <span className="font-display font-bold text-sm sm:text-base text-text-primary group-hover:text-accent-glow transition-colors">
                {member.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Caption Below Grid */}
      <div className={`text-center transition-opacity duration-700 ${isFinalEndState ? 'opacity-20' : 'opacity-100'}`}>
        <p className="font-display uppercase tracking-widest text-xs sm:text-sm text-text-muted font-bold">
          — YOUR SQUAD —
        </p>
      </div>

      {/* REPLAY & EXIT BUTTONS */}
      {!isFinalEndState && !showExitInter && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleReplayClick}
            className="px-8 py-4 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] flex items-center gap-2.5 cursor-pointer shadow-xl transition-transform active:scale-95 hover:scale-103"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>REPLAY</span>
          </button>

          <button
            onClick={handleExitClick}
            className="px-8 py-4 rounded-full glass-panel border border-white/15 text-text-muted hover:text-text-primary hover:border-white/30 font-display font-bold text-sm sm:text-base flex items-center gap-2.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>EXIT</span>
          </button>
        </div>
      )}

      {/* EXIT GAG & TRUE FINAL SCREEN OVERLAY */}
      <AnimatePresence>
        {showExitInter && !isFinalEndState && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-3xl glass-panel border border-warm-pink/40 text-center max-w-md mx-auto shadow-2xl"
          >
            <p className="font-display font-bold text-lg sm:text-xl text-text-primary leading-snug">
              Wait... You didn't think we'd let you leave without one last message, did you? 😉
            </p>
          </motion.div>
        )}

        {isFinalEndState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-reveal-black/90 backdrop-blur-md pointer-events-auto"
          >
            <div className="p-10 sm:p-12 rounded-3xl glass-panel border-2 border-warm-gold/60 text-center max-w-lg mx-auto shadow-[0_0_60px_rgba(255,200,118,0.3)] space-y-4">
              <div className="w-18 h-18 rounded-full bg-warm-pink/20 text-warm-pink flex items-center justify-center mx-auto border border-warm-pink/40 shadow-inner">
                <Heart className="w-9 h-9 fill-current animate-pulse" />
              </div>
              <h3 className="font-emotional italic font-bold text-3xl sm:text-5xl text-warm-gold">
                ❤️ Happy Birthday, {name}.
              </h3>
              <p className="font-body text-base sm:text-lg text-text-muted leading-relaxed">
                Thank you for being such an irreplaceable teammate and friend.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
