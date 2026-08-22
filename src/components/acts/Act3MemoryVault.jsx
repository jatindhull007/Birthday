import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, ArrowRight, Volume2, Calendar, Eye, Camera, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/soundService';
import { triggerConfetti } from '../common/ConfettiEffect';

export default function Act3MemoryVault({ config, onNext }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentMemoryIdx, setCurrentMemoryIdx] = useState(0);
  const [solvedMemories, setSolvedMemories] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const challenges = config.vault.challenges;
  const currentMem = challenges[currentMemoryIdx];
  const isCurrentSolved = !!solvedMemories[currentMem.id];

  const handleUnlockVault = () => {
    sound.playVaultUnlock();
    setTimeout(() => {
      setIsUnlocked(true);
      triggerConfetti('cyber');
    }, 850);
  };

  const handleGuessYear = (year) => {
    setSelectedAnswer(year);
    if (year === currentMem.correctAnswer) {
      sound.playSuccessChime();
      triggerConfetti('burst');
      setSolvedMemories((prev) => ({ ...prev, [currentMem.id]: true }));
    } else {
      sound.playBuzzerFail();
    }
  };

  const handleUnmaskClick = () => {
    sound.playSuccessChime();
    triggerConfetti('burst');
    setSolvedMemories((prev) => ({ ...prev, [currentMem.id]: true }));
  };

  const handleQuoteAnswer = (idx) => {
    setSelectedAnswer(idx);
    if (idx === currentMem.correctIndex) {
      sound.playSuccessChime();
      triggerConfetti('burst');
      setSolvedMemories((prev) => ({ ...prev, [currentMem.id]: true }));
    } else {
      sound.playBuzzerFail();
    }
  };

  const handlePlayQuoteAudio = () => {
    sound.playKeyTick();
    setIsAudioPlaying(true);
    setTimeout(() => setIsAudioPlaying(false), 2500);
  };

  const handleNextMemory = () => {
    sound.playDigitPop();
    setSelectedAnswer(null);
    if (currentMemoryIdx + 1 < challenges.length) {
      setCurrentMemoryIdx((i) => i + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      {/* 1. VAULT DOOR LOCKED STATE */}
      {!isUnlocked ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg game-card rounded-3xl p-8 sm:p-12 border border-[#5865F2]/40 text-center relative overflow-hidden shadow-2xl"
        >
          {/* VAULT DIAL GRAPHIC */}
          <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
            {/* Outer rotating gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-[#5865F2]/50"
            />
            {/* Inner vault lock core */}
            <div className="w-28 h-28 rounded-full bg-[#1E1F22] border-2 border-[#5865F2] flex items-center justify-center shadow-[0_0_30px_rgba(88,101,242,0.3)]">
              <Lock className="w-10 h-10 text-[#5865F2] animate-pulse" />
            </div>
          </div>

          <div className="inline-block px-3 py-1 bg-[#5865F2]/20 border border-[#5865F2]/40 rounded-full text-[#5865F2] text-xs font-bold mb-3">
            SQUAD ARCHIVES LOCKED
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            THE MEMORY VAULT
          </h2>

          <p className="text-xs sm:text-sm text-[#949BA4] mb-8">
            Contains {config.vault.totalFiles} encrypted nostalgic squad memories ready for unlock!
          </p>

          <button
            onClick={handleUnlockVault}
            className="group w-full py-4 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#7289DA] to-[#57F287] text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-[0_0_35px_rgba(88,101,242,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
          >
            <Unlock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>UNLOCK MEMORY VAULT</span>
          </button>
        </motion.div>
      ) : (
        /* 2. POLAROID / SCRAPBOOK MEMORY CHALLENGES VIEW */
        <motion.div
          key={`mem-${currentMemoryIdx}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl glass-panel-warm rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-2xl relative text-stone-900"
        >
          {/* SCRAPBOOK TOP HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-amber-900/15">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-800" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                MEMORY CAPSULE {currentMemoryIdx + 1} OF {challenges.length}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
              {currentMem.tag}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            {/* POLAROID FRAME */}
            <div className="relative group">
              <div className="bg-white p-4 pb-8 rounded-2xl shadow-xl transform -rotate-1 border border-stone-200 hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-900">
                  <img
                    src={currentMem.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"}
                    alt="Memory"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      currentMem.type === 'guess-year'
                        ? isCurrentSolved
                          ? 'blur-0 scale-100'
                          : 'blur-xl scale-110'
                        : currentMem.type === 'unmask-face'
                        ? isCurrentSolved
                          ? 'filter-none'
                          : 'brightness-50'
                        : ''
                    }`}
                  />

                  {/* Unmask Overlay for Type 'unmask-face' */}
                  {currentMem.type === 'unmask-face' && !isCurrentSolved && (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleUnmaskClick}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer p-4 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-2 animate-bounce">
                        <Eye className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-white font-bold tracking-wider bg-black/70 px-3 py-1 rounded-full border border-white/20">
                        {currentMem.maskLabel}
                      </span>
                    </motion.div>
                  )}

                  {/* Audio Wave Visualizer for Type 'mystery-quote' */}
                  {currentMem.type === 'mystery-quote' && (
                    <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
                      <button
                        onClick={handlePlayQuoteAudio}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                          isAudioPlaying
                            ? 'bg-[#57F287] text-white animate-pulse shadow-[0_0_25px_rgba(87,242,135,0.6)]'
                            : 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg'
                        }`}
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                      <span className="text-xs font-semibold mt-3 text-amber-200">
                        {isAudioPlaying ? 'PLAYING AUDIO MEMORY...' : 'TAP TO PLAY AUDIO QUOTE'}
                      </span>
                      {/* Wave Bars */}
                      <div className="flex items-center gap-1.5 mt-4">
                        {[12, 28, 16, 36, 24, 18, 30, 14, 26].map((h, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: isAudioPlaying ? [h, h * 1.5, h * 0.6, h] : h }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
                            className="w-1.5 bg-amber-400 rounded-full"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Polaroid Handwritten Caption */}
                <div className="mt-3 text-center">
                  <span className="font-hand text-2xl font-bold text-stone-700 tracking-wide">
                    {currentMem.title}
                  </span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE CONTROLS */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  {currentMem.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {currentMem.description}
                </p>
              </div>

              {/* CHALLENGE 1: GUESS THE YEAR */}
              {currentMem.type === 'guess-year' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    SELECT MEMORY YEAR:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {currentMem.options.map((year, idx) => {
                      const isSelected = selectedAnswer === year;
                      const isCorrect = year === currentMem.correctAnswer;
                      let btnStyle = "bg-white border-stone-300 text-stone-800 hover:border-amber-600 hover:bg-amber-50";

                      if (isCurrentSolved && isCorrect) {
                        btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-red-500 text-white border-red-500";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isCurrentSolved}
                          onClick={() => handleGuessYear(year)}
                          className={`py-2.5 px-4 rounded-xl border text-sm transition-all font-bold ${btnStyle}`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CHALLENGE 3: MYSTERY QUOTE */}
              {currentMem.type === 'mystery-quote' && (
                <div className="space-y-3">
                  <blockquote className="p-3.5 bg-amber-100/70 rounded-2xl border-l-4 border-amber-600 text-xs sm:text-sm italic text-stone-800 font-serif">
                    {currentMem.quoteText}
                  </blockquote>
                  <div className="space-y-2">
                    {currentMem.options.map((name, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === currentMem.correctIndex;
                      let btnStyle = "bg-white border-stone-300 text-stone-800 hover:bg-amber-50 hover:border-amber-600";

                      if (isCurrentSolved && isCorrect) {
                        btnStyle = "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-red-500 text-white border-red-500";
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isCurrentSolved}
                          onClick={() => handleQuoteAnswer(idx)}
                          className={`w-full text-left py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{name}</span>
                          <span className="text-[11px] opacity-60">SELECT</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* REVEALED STORY CARD */}
              <AnimatePresence>
                {isCurrentSolved && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-amber-100/90 border border-amber-300 text-stone-800 shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>THE STORY:</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
                      {currentMem.revealStory}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PROCEED BUTTON */}
              {isCurrentSolved && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextMemory}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 hover:from-amber-700 hover:to-amber-600 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg flex items-center gap-2 transition-all"
                  >
                    <span>{currentMemoryIdx + 1 < challenges.length ? 'NEXT MEMORY' : 'ENTER LOVE TEST'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
