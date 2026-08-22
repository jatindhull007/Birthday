import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, Bookmark } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';
import MemoryCard from '../components/MemoryCard';

export default function MemoryVault({ data }) {
  const { nextStep } = useStepMachine();

  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [currentMemIdx, setCurrentMemIdx] = useState(0);
  const [isVaultCompleted, setIsVaultCompleted] = useState(false);
  const [showLightBeam, setShowLightBeam] = useState(false);

  const memories = data.memories;

  const handleUnlockClick = () => {
    playSfx('sfx-vault-unlock');
    setShowLightBeam(true);

    setTimeout(() => {
      setIsVaultUnlocked(true);
      setShowLightBeam(false);
    }, 800);
  };

  const handleNextMemory = () => {
    playSfx('sfx-digit');
    if (currentMemIdx + 1 < memories.length) {
      setCurrentMemIdx((prev) => prev + 1);
    } else {
      setIsVaultCompleted(true);
      playSfx('sfx-chime');
    }
  };

  const handleContinueToLoveTest = () => {
    playSfx('sfx-transition');
    nextStep();
  };

  return (
    <motion.div
      initial={{ backgroundColor: '#14151C' }}
      animate={{ backgroundColor: '#F3E9D8' }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-scrapbook-brown font-body relative overflow-hidden film-grain z-10"
    >
      {/* Pinned Memory Counter in Corner */}
      {isVaultUnlocked && !isVaultCompleted && (
        <div className="fixed top-4 right-4 z-40">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-scrapbook-brown/30 shadow-lg text-xs font-bold text-scrapbook-brown font-display">
            <Bookmark className="w-4 h-4 text-warm-gold" />
            <span>{currentMemIdx + 1} / {memories.length} Memories Unlocked</span>
          </div>
        </div>
      )}

      {/* Light beam sweep flourish on unlock */}
      <AnimatePresence>
        {showLightBeam && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 0.85, x: '200%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 1. VAULT LOCK SCREEN */}
      {!isVaultUnlocked ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateY: showLightBeam ? 85 : 0,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="w-full max-w-lg mx-auto bg-white p-8 sm:p-12 rounded-3xl border-2 border-scrapbook-brown/25 shadow-2xl text-center space-y-6 relative overflow-hidden"
        >
          {/* Decorative Corner Rivets */}
          <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-scrapbook-brown/30 border border-scrapbook-brown/50" />
          <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-scrapbook-brown/30 border border-scrapbook-brown/50" />
          <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full bg-scrapbook-brown/30 border border-scrapbook-brown/50" />
          <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full bg-scrapbook-brown/30 border border-scrapbook-brown/50" />

          {/* Padlock Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full bg-scrapbook-cream border-4 border-dashed border-scrapbook-brown/40 flex items-center justify-center mx-auto shadow-inner"
          >
            <Lock className="w-11 h-11 text-scrapbook-brown animate-pulse" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-scrapbook-brown">
              🔒 MEMORY VAULT
            </h2>
            {/* Stamped Label */}
            <div className="inline-block px-4 py-1.5 bg-warm-gold/25 border border-warm-gold/60 rounded text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-scrapbook-brown transform -rotate-1 shadow-sm">
              STAMPED: {data.vaultFileCount} ARCHIVED PHOTOS FOUND
            </div>
          </div>

          <p className="font-body text-sm text-scrapbook-brown/80 max-w-sm mx-auto leading-relaxed">
            Warning: Contains high-potency nostalgic screenshots and classified squad memories.
          </p>

          {/* Embossed Paper UNLOCK Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleUnlockClick}
              className="px-9 py-4 rounded-full bg-scrapbook-brown text-scrapbook-cream font-display font-bold text-sm sm:text-base hover:bg-[#724A2D] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_6px_12px_rgba(0,0,0,0.2)] transition-transform active:scale-95 hover:scale-103 cursor-pointer flex items-center gap-2.5"
            >
              <Unlock className="w-5 h-5" />
              <span>UNLOCK VAULT</span>
            </button>
          </div>
        </motion.div>
      ) : !isVaultCompleted ? (
        /* 2. MEMORY CARD POLAROID CAROUSEL */
        <div className="w-full flex items-center justify-center">
          <MemoryCard
            key={`memory-${currentMemIdx}`}
            memory={memories[currentMemIdx]}
            index={currentMemIdx}
            onNextMemory={handleNextMemory}
            isLastMemory={currentMemIdx + 1 === memories.length}
          />
        </div>
      ) : (
        /* 3. VAULT SEALED CARD */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-lg mx-auto bg-white p-9 sm:p-12 rounded-3xl border border-scrapbook-brown/25 shadow-2xl text-center space-y-6"
        >
          <div className="w-18 h-18 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto border-2 border-success shadow-lg">
            <Sparkles className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-scrapbook-brown">
              VAULT SEALED. MEMORIES RESTORED.
            </h2>
            <p className="font-body text-sm sm:text-base text-scrapbook-brown/80">
              Every chapter unlocked. Ready for the next revelation?
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleContinueToLoveTest}
              className="px-9 py-4 rounded-full bg-scrapbook-brown text-scrapbook-cream font-display font-bold text-sm sm:text-base hover:bg-[#724A2D] shadow-xl transition-transform active:scale-95 hover:scale-103 cursor-pointer flex items-center gap-2.5"
            >
              <span>CONTINUE →</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
