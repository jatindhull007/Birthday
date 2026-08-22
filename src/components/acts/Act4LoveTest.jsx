import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, AlertCircle, Heart, Sparkles, ArrowRight, MessageSquareQuote, ChevronRight, ChevronLeft } from 'lucide-react';
import { sound } from '../../services/soundService';
import { triggerConfetti } from '../common/ConfettiEffect';

export default function Act4LoveTest({ config, onNext }) {
  // Phase: 'calculating' -> 'overflow' -> 'messages'
  const [phase, setPhase] = useState('calculating');
  const [visibleItemsCount, setVisibleItemsCount] = useState(0);
  const [currentMessageIdx, setCurrentMessageIdx] = useState(0);

  const scoreItems = config.loveTest.scoreItems;
  const messages = config.loveTest.teammateMessages;
  const currentMsg = messages[currentMessageIdx];

  useEffect(() => {
    if (phase === 'calculating') {
      const interval = setInterval(() => {
        setVisibleItemsCount((prev) => {
          sound.playKeyTick();
          if (prev + 1 >= scoreItems.length) {
            clearInterval(interval);
            setTimeout(() => {
              setPhase('overflow');
              sound.playGlitch();
              sound.playSuccessChime();
              triggerConfetti('celebration');
            }, 750);
            return scoreItems.length;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [phase, scoreItems.length]);

  const handleNextMessage = () => {
    sound.playDigitPop();
    if (currentMessageIdx + 1 < messages.length) {
      setCurrentMessageIdx((i) => i + 1);
    } else {
      onNext();
    }
  };

  const handlePrevMessage = () => {
    sound.playDigitPop();
    if (currentMessageIdx > 0) {
      setCurrentMessageIdx((i) => i - 1);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-[#DBDEE1]">
      {/* 1. ANIMATED CALCULATOR TICKER */}
      {(phase === 'calculating' || phase === 'overflow') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl game-card rounded-3xl p-6 sm:p-10 border border-[#5865F2]/40 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Warm Gradient Backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/15 via-[#5865F2]/15 to-transparent pointer-events-none rounded-full blur-3xl" />

          {/* CALCULATOR HEADER */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C]">
            <div className="flex items-center gap-2 text-[#EB459E] font-bold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>SQUAD AFFECTION ALGORITHM v4.2</span>
            </div>
            <span className="text-[#949BA4] text-xs font-semibold">CALCULATING...</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            QUANTIFYING MK'S IMPACT ON THE SQUAD:
          </h2>

          {/* STREAM OF CALCULATED SCORE ITEMS */}
          <div className="space-y-3 mb-8">
            {scoreItems.slice(0, visibleItemsCount).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1E1F22] border border-[#35373C]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs sm:text-sm text-[#DBDEE1] font-medium">{item.label}</span>
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    item.type === 'pos' ? 'text-[#57F287]' : 'text-[#FEE75C]'
                  }`}
                >
                  {item.delta}
                </span>
              </motion.div>
            ))}
          </div>

          {/* OVERFLOW ERROR PAYOFF */}
          {phase === 'overflow' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-[#5865F2]/30 border border-pink-500/50 mb-8 relative shadow-xl"
            >
              <div className="flex items-start gap-3.5">
                <AlertCircle className="w-6 h-6 text-pink-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-sm font-bold text-pink-300">
                    CALCULATION RESULT: ERROR 0x777
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                    {config.loveTest.overflowError}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTION BUTTON TO VIEW INDIVIDUAL MESSAGES */}
          {phase === 'overflow' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button
                onClick={() => {
                  sound.playDigitPop();
                  setPhase('messages');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#EB459E] via-[#5865F2] to-[#57F287] text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg hover:shadow-[#5865F2]/40 flex items-center gap-2 transition-all"
              >
                <span>READ SQUAD TESTIMONIALS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 2. TEAMMATE MESSAGE CARDS CAROUSEL */}
      {phase === 'messages' && (
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${currentMessageIdx}`}
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="game-card rounded-3xl p-6 sm:p-10 border border-[#35373C] shadow-2xl relative overflow-hidden"
            >
              {/* TOP CARD BAR */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C]">
                <div className="flex items-center gap-3.5">
                  <img
                    src={currentMsg.avatar}
                    alt={currentMsg.author}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#5865F2] shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{currentMsg.author}</h3>
                    <p className="text-xs text-[#949BA4]">{currentMsg.role}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#1E1F22] border border-[#35373C] text-white text-xs font-semibold">
                  {currentMsg.tag}
                </span>
              </div>

              {/* MESSAGE BODY */}
              <div className="relative mb-8">
                <MessageSquareQuote className="w-8 h-8 text-[#5865F2]/20 absolute -top-3 -left-2 pointer-events-none" />
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed pl-4 border-l-2 border-[#5865F2]/50">
                  {currentMsg.message}
                </p>
              </div>

              {/* CARD FOOTER & NAVIGATION */}
              <div className="flex items-center justify-between pt-4 border-t border-[#35373C]">
                <span className="text-xs font-semibold text-[#949BA4]">
                  MESSAGE {currentMessageIdx + 1} OF {messages.length}
                </span>

                <div className="flex items-center gap-2">
                  {currentMessageIdx > 0 && (
                    <button
                      onClick={handlePrevMessage}
                      className="p-2.5 rounded-2xl bg-[#1E1F22] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleNextMessage}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#EB459E] hover:from-[#4752C4] hover:to-[#EB459E] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-[#5865F2]/30 flex items-center gap-1.5 transition-all"
                  >
                    <span>{currentMessageIdx + 1 < messages.length ? 'NEXT NOTE' : 'CONTINUE'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
