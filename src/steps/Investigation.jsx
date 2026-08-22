import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Skull, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';
import ProgressBar from '../components/ProgressBar';
import QuizQuestion from '../components/QuizQuestion';

export default function Investigation({ data }) {
  const { nextStep } = useStepMachine();

  // Phase: 'dossier' | 'quiz' | 'verdict'
  const [phase, setPhase] = useState('dossier');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [threatProgress, setThreatProgress] = useState(0);

  useEffect(() => {
    if (phase === 'dossier') {
      const startTime = Date.now();
      const duration = 1200;
      const target = data.threatLevel;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(target, Math.floor((elapsed / duration) * target));
        setThreatProgress(pct);

        if (pct >= target) {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [phase, data.threatLevel]);

  const handleNextQuizQuestion = () => {
    if (currentQuizIdx + 1 < data.quiz.length) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setPhase('verdict');
      playSfx('sfx-chime');
    }
  };

  const handleContinueToVault = () => {
    playSfx('sfx-transition');
    nextStep();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10 font-body">
      {/* 1. DOSSIER CASE FILE VIEW */}
      {phase === 'dossier' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative shadow-2xl space-y-6 overflow-hidden border border-white/10"
        >
          {/* Faint diagonal CLASSIFIED watermark stamp */}
          <div className="absolute right-4 bottom-8 select-none pointer-events-none transform rotate-[-25deg] opacity-[0.04] text-text-primary font-display font-extrabold text-7xl sm:text-8xl tracking-widest border-8 border-current px-8 py-2 rounded-3xl">
            CLASSIFIED
          </div>

          {/* Header Banner Strip */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-accent-primary" />
              <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-accent-glow">
                CASE FILE #001
              </span>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-danger/20 text-danger border border-danger/40 text-xs font-bold font-display tracking-wider">
              SUBJECT DOSSIER
            </span>
          </div>

          {/* Subject Name & Aliases Tag Chips */}
          <div className="space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-text-primary">
              {data.name}
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.nicknames.map((nick, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-bg-base/80 border border-white/15 text-xs sm:text-sm font-semibold text-text-muted hover:border-accent-primary/60 transition-colors shadow-sm"
                >
                  🏷️ {nick}
                </span>
              ))}
            </div>
          </div>

          {/* Threat Level Meter with tick marks */}
          <div className="p-5 rounded-2xl bg-bg-base/70 border border-white/10 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold font-display">
              <span className="flex items-center gap-2 text-danger">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                CHAOS & THREAT LEVEL
              </span>
              <span className="text-danger font-display text-sm sm:text-base font-extrabold">{threatProgress}%</span>
            </div>
            <ProgressBar progress={threatProgress} variant="danger" />
            {/* Tick marks */}
            <div className="flex justify-between px-1 text-[10px] sm:text-xs font-bold text-text-muted/40 select-none font-body">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Known Offences with Skull Icons */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-text-muted">
              KNOWN SQUAD OFFENCES:
            </h4>
            <div className="space-y-2.5">
              {data.offences.map((offence, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.18, duration: TIMING.panel }}
                  className="p-4 rounded-2xl bg-bg-base/80 border border-white/10 flex items-center gap-3.5 text-sm sm:text-base font-medium text-text-primary shadow-sm"
                >
                  <div className="p-1.5 rounded-xl bg-danger/15 text-danger shrink-0 border border-danger/20">
                    <Skull className="w-4 h-4" />
                  </div>
                  <span className="font-body font-semibold">{offence}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={() => {
                playSfx('sfx-digit');
                setPhase('quiz');
              }}
              className="px-8 py-4 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] shadow-xl flex items-center gap-2.5 cursor-pointer transition-transform active:scale-95 hover:scale-103"
            >
              <span>BEGIN QUIZ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. QUIZ SUB-FLOW */}
      {phase === 'quiz' && (
        <motion.div
          key={`quiz-${currentQuizIdx}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative shadow-2xl border border-white/10"
        >
          <QuizQuestion
            questionData={data.quiz[currentQuizIdx]}
            onNextQuestion={handleNextQuizQuestion}
            isLastQuestion={currentQuizIdx + 1 === data.quiz.length}
            currentIdx={currentQuizIdx}
            totalQuestions={data.quiz.length}
          />
        </motion.div>
      )}

      {/* 3. VERDICT SCREEN WITH WAX SEAL BADGE */}
      {phase === 'verdict' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-lg mx-auto glass-panel p-9 sm:p-12 rounded-3xl border border-success/40 shadow-2xl text-center space-y-6"
        >
          {/* Wax-seal style badge graphic */}
          <div className="w-22 h-22 rounded-full bg-accent-primary/20 border-4 border-dashed border-accent-glow flex items-center justify-center mx-auto text-accent-glow glow-primary shadow-xl">
            <Award className="w-11 h-11 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-xs sm:text-sm uppercase font-bold tracking-widest text-success font-display block">
              INVESTIGATION COMPLETE
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-text-primary leading-tight">
              You're weird. But you're OUR weird. ❤️
            </h2>
          </div>

          <p className="font-body text-base text-text-muted leading-relaxed max-w-md mx-auto">
            All identity checks cleared with flying colors. The squad has granted you full clearance to enter the classified Memory Vault.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleContinueToVault}
              className="px-9 py-4.5 rounded-full bg-accent-primary text-text-primary font-display font-bold text-base sm:text-lg glow-primary hover:bg-[#4752C4] shadow-2xl flex items-center gap-2.5 cursor-pointer transition-transform active:scale-95 hover:scale-103"
            >
              <span>NEXT CASE →</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
