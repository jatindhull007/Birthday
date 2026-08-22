import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RotateCcw, LogOut, Flame, Cake, Quote, Gift, PartyPopper } from 'lucide-react';
import { sound } from '../../services/soundService';
import { triggerConfetti } from '../common/ConfettiEffect';

export default function Act6FinalReveal({ config, onReplay }) {
  // Phase: 'silence' -> 'lines' -> 'hero' -> 'finale'
  const [phase, setPhase] = useState('silence');
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showExitGag, setShowExitGag] = useState(false);

  const lines = config.reveal.staggeredLines;
  const teamGallery = config.reveal.teamGallery;

  // Phase 1: 2.5s absolute silence beat
  useEffect(() => {
    sound.cutToSilence();

    const silenceTimer = setTimeout(() => {
      setPhase('lines');
    }, 2400);

    return () => clearTimeout(silenceTimer);
  }, []);

  // Phase 2: Sequential line-by-line reveal
  useEffect(() => {
    if (phase === 'lines') {
      const lineInterval = setInterval(() => {
        setCurrentLineIdx((prev) => {
          if (prev + 1 >= lines.length) {
            clearInterval(lineInterval);
            // Move to hero headline
            setTimeout(() => {
              setPhase('hero');
              sound.playEmotionalTrack();
              sound.playFanfare();
              triggerConfetti('celebration');
            }, 1200);
            return lines.length - 1;
          }
          return prev + 1;
        });
      }, 1600);

      return () => clearInterval(lineInterval);
    }
  }, [phase, lines.length]);

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    sound.playSuccessChime();
    triggerConfetti('celebration');
  };

  const handleExitClick = () => {
    sound.playDigitPop();
    setShowExitGag(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#5865F2] text-[#DBDEE1]">
      {/* 1. SILENCE & LINE-BY-LINE STAGGERED TEXT */}
      {(phase === 'silence' || phase === 'lines') && (
        <div className="fixed inset-0 bg-[#0B0C0E] flex flex-col items-center justify-center p-6 text-center z-50">
          <AnimatePresence mode="wait">
            {phase === 'lines' && (
              <motion.div
                key={currentLineIdx}
                initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="max-w-2xl"
              >
                <p className="font-serif italic text-xl sm:text-3xl text-white leading-relaxed font-normal">
                  “{lines[currentLineIdx]}”
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#FEE75C] mx-auto mt-8 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. GRAND FINALE HERO & TEAM PHOTO WALL */}
      {(phase === 'hero' || phase === 'finale') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-5xl space-y-12 py-10"
        >
          {/* HERO BANNER */}
          <div className="text-center space-y-4 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5865F2]/20 via-[#EB459E]/20 to-[#FEE75C]/20 border border-[#5865F2]/40 text-[#FEE75C] text-xs sm:text-sm font-bold shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#FEE75C]" />
              <span>SQUAD BIRTHDAY VICTORY UNLOCKED</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#FEE75C] to-[#EB459E] bg-clip-text text-transparent drop-shadow-2xl"
            >
              {config.reveal.heroHeadline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-lg italic text-[#949BA4] max-w-xl mx-auto"
            >
              {config.reveal.heroSubheadline}
            </motion.p>
          </div>

          {/* INTERACTIVE BIRTHDAY CAKE & CONFETTI BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md mx-auto p-7 rounded-3xl game-card border border-[#FEE75C]/40 text-center relative shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <div
                onClick={handleBlowCandles}
                className="relative cursor-pointer group p-5 rounded-3xl bg-[#FEE75C]/10 border border-[#FEE75C]/30 hover:border-[#FEE75C]/60 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Cake className="w-16 h-16 text-[#FEE75C]" />
                {!candlesBlown && (
                  <Flame className="w-7 h-7 text-orange-400 fill-orange-400 absolute -top-1 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
                )}
              </div>
            </div>

            <h3 className="font-bold text-white text-base sm:text-lg">
              {candlesBlown ? "🎉 CANDLES BLOWN! MAKE A WISH!" : "🕯️ TAP THE CAKE TO BLOW THE CANDLES!"}
            </h3>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => triggerConfetti('celebration')}
                className="px-4 py-2.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>MORE CONFETTI</span>
              </button>
            </div>
          </motion.div>

          {/* FULL-BLEED TEAM PHOTO GRID WALL */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                THE SQUAD GALLERY WALL
              </h2>
              <p className="text-xs sm:text-sm text-[#949BA4] mt-1">
                From everyone in the server who loves and celebrates you today!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {teamGallery.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="rounded-3xl game-card p-5 border border-[#35373C] hover:border-[#5865F2] shadow-xl transition-all duration-300 hover:-translate-y-1.5 group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-[#1E1F22]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {member.specialBadge && (
                      <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl bg-[#FEE75C] text-slate-950 text-[11px] font-extrabold shadow-md">
                        {member.specialBadge}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-white text-base">{member.name}</h4>
                    <p className="text-xs text-[#5865F2] font-semibold">{member.role}</p>
                    <p className="text-xs text-[#DBDEE1] italic pt-1 leading-relaxed">
                      {member.quote}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CLOSING EMOTIONAL NOTE */}
          <div className="p-8 rounded-3xl bg-[#1E1F22]/90 border border-[#5865F2]/40 text-center max-w-2xl mx-auto shadow-2xl">
            <Quote className="w-8 h-8 text-[#EB459E] mx-auto mb-3 opacity-70" />
            <p className="text-sm sm:text-base text-[#DBDEE1] leading-relaxed font-medium">
              {config.reveal.closingMessage}
            </p>
          </div>

          {/* REPLAY & EXIT ACTIONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 pb-12">
            <button
              onClick={() => {
                sound.playDigitPop();
                onReplay();
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#57F287] text-white text-xs sm:text-sm font-bold tracking-wide shadow-xl hover:shadow-[#5865F2]/40 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY MISSION</span>
            </button>

            <button
              onClick={handleExitClick}
              className="px-6 py-3.5 rounded-2xl bg-[#1E1F22] hover:bg-[#35373C] border border-[#35373C] text-[#DBDEE1] hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>EXIT OPERATION</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* EXIT GAG MODAL */}
      <AnimatePresence>
        {showExitGag && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md rounded-3xl game-card border border-[#EB459E]/60 p-6 sm:p-8 text-center relative shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EB459E]/20 text-[#EB459E] mb-4 border border-[#EB459E]/40">
                <Gift className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {config.reveal.exitGagModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#DBDEE1] mb-6 leading-relaxed">
                {config.reveal.exitGagModal.message}
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    sound.playSuccessChime();
                    setShowExitGag(false);
                    handleBlowCandles();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#EB459E] to-[#5865F2] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#EB459E]/40 transition-all"
                >
                  {config.reveal.exitGagModal.stayButton}
                </button>
                <button
                  onClick={() => {
                    setShowExitGag(false);
                    onReplay();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#1E1F22] hover:bg-[#35373C] text-[#949BA4] text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  {config.reveal.exitGagModal.replayButton}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
