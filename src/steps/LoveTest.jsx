import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';
import TeamMessageCard from '../components/TeamMessageCard';
import ProgressBar from '../components/ProgressBar';

export default function LoveTest({ data }) {
  const { nextStep } = useStepMachine();

  // Phase: 'tally' | 'overflow' | 'messages'
  const [phase, setPhase] = useState('tally');
  const [visibleItemCount, setVisibleItemCount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scoreProgress, setScoreProgress] = useState(0);
  const [isBarShaking, setIsBarShaking] = useState(false);
  const [currentMessageIdx, setCurrentMessageIdx] = useState(0);

  const items = data.loveTestItems;
  const messages = data.teamMessages;

  useEffect(() => {
    if (phase === 'tally') {
      const interval = setInterval(() => {
        setVisibleItemCount((prev) => {
          playSfx('sfx-digit');
          if (prev + 1 >= items.length) {
            clearInterval(interval);
            setTimeout(() => {
              setIsCalculating(true);
              triggerScoreCalculation();
            }, 600);
            return items.length;
          }
          return prev + 1;
        });
      }, 400);

      return () => clearInterval(interval);
    }
  }, [phase, items.length]);

  const triggerScoreCalculation = () => {
    setTimeout(() => {
      setScoreProgress(100);
      setTimeout(() => {
        setIsBarShaking(true);
        playSfx('sfx-buzzer');
        setIsCalculating(false);
        setPhase('overflow');
        playSfx('sfx-chime');
      }, 800);
    }, 400);
  };

  const handleNextMessage = () => {
    playSfx('sfx-digit');
    if (currentMessageIdx + 1 < messages.length) {
      setCurrentMessageIdx((prev) => prev + 1);
    } else {
      nextStep();
    }
  };

  const warmRatio = visibleItemCount / items.length;

  return (
    <div
      style={{
        background:
          phase === 'messages'
            ? 'linear-gradient(to bottom, #14151C, #0F1015)'
            : `linear-gradient(to bottom, #14151C, rgba(255, 200, 118, ${warmRatio * 0.25}))`,
      }}
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-text-primary font-body transition-colors duration-700 relative z-10"
    >
      {/* 1. TALLY & OVERFLOW SEQUENCE */}
      {(phase === 'tally' || phase === 'overflow') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-xl mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative shadow-2xl space-y-6 border border-white/10"
        >
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-pink/20 border border-warm-pink/30 text-warm-pink text-xs font-display font-bold uppercase tracking-widest shadow-sm">
              <Receipt className="w-4 h-4" />
              <span>SQUAD LEDGER TALLY</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary leading-tight">
              HOW MUCH DOES THE TEAM ACTUALLY LOVE YOU?
            </h2>
          </div>

          {/* Receipt / Ledger list with dotted dividers */}
          <div className="space-y-1 bg-bg-base/80 p-5 rounded-2xl border border-white/10 shadow-inner">
            {items.slice(0, visibleItemCount).map((item, idx) => {
              const isPositive = item.delta >= 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="py-3 flex items-center justify-between border-b border-dashed border-white/10 last:border-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-text-primary font-body">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-danger" />
                    )}
                    <span
                      className={`font-display font-extrabold text-base sm:text-lg ${
                        isPositive ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {isPositive ? `+${item.delta.toLocaleString()}` : item.delta.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Calculating status bar */}
          {isCalculating && (
            <div className="space-y-2 pt-2 text-center">
              <span className="text-xs sm:text-sm font-semibold text-text-muted animate-pulse font-body">
                Summing total affection metrics...
              </span>
              <ProgressBar progress={scoreProgress} variant="primary" />
            </div>
          )}

          {/* Overflow Error Message Toast */}
          {phase === 'overflow' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: isBarShaking ? [-6, 6, -4, 4, 0] : 0,
              }}
              className="p-5 rounded-2xl bg-danger/20 border border-danger/40 space-y-2 shadow-xl glow-danger"
            >
              <div className="flex items-center gap-2.5 text-danger font-display font-bold text-base sm:text-lg">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>ERROR — VALUE TOO LARGE TO CALCULATE</span>
              </div>
              <p className="text-sm sm:text-base text-text-primary pl-7.5 font-medium">
                Okay… apparently you're stuck with us. ❤️
              </p>
            </motion.div>
          )}

          {/* Continue Button to Messages */}
          {phase === 'overflow' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  playSfx('sfx-digit');
                  setPhase('messages');
                }}
                className="px-8 py-4 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] shadow-xl flex items-center gap-2.5 cursor-pointer transition-transform active:scale-95 hover:scale-103"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 2. TEAM MESSAGES SUB-FLOW */}
      {phase === 'messages' && (
        <div className="w-full flex items-center justify-center">
          <TeamMessageCard
            key={`msg-${currentMessageIdx}`}
            messageData={messages[currentMessageIdx]}
            index={currentMessageIdx}
            total={messages.length}
            onNext={handleNextMessage}
            isLast={currentMessageIdx + 1 === messages.length}
          />
        </div>
      )}
    </div>
  );
}
