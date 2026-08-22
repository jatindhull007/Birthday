import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { fireConfetti } from './ConfettiBurst';

export default function QuizQuestion({ questionData, onNextQuestion, isLastQuestion, currentIdx, totalQuestions }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === questionData.correctIndex;
    if (isCorrect) {
      playSfx('sfx-chime');
      fireConfetti('quiz');
    } else {
      playSfx('sfx-buzzer');
    }

    setTimeout(() => {
      setShowReaction(true);
    }, 700);
  };

  const handleNext = () => {
    playSfx('sfx-digit');
    setSelectedIdx(null);
    setIsAnswered(false);
    setShowReaction(false);
    onNextQuestion();
  };

  return (
    <div className="w-full space-y-6 font-body">
      {/* Sub-flow Question Progress Counter */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-bold font-display text-text-muted">
        <span className="text-accent-glow uppercase tracking-wider text-xs sm:text-sm">
          Question {currentIdx + 1} of {totalQuestions}
        </span>
        <span className="uppercase tracking-wider">SQUAD KNOWLEDGE CHECK</span>
      </div>

      {/* Question Headline in font-display */}
      <h3 className="font-display font-bold text-2xl sm:text-3xl text-text-primary leading-snug">
        {questionData.question}
      </h3>

      {/* 2x2 Answer Buttons Grid with full padding & rounded corners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questionData.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === questionData.correctIndex;

          let btnClass = 'glass-panel text-text-primary hover:border-accent-primary/70 hover:shadow-lg';
          if (isAnswered) {
            if (isCorrect) {
              btnClass = 'bg-success/20 border-success text-success glow-success';
            } else if (isSelected) {
              btnClass = 'bg-danger/20 border-danger text-danger glow-danger';
            } else {
              btnClass = 'bg-bg-base/40 border-white/5 text-text-muted/50 opacity-40';
            }
          }

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              whileHover={{ scale: isAnswered ? 1 : 1.02 }}
              whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              transition={{ duration: TIMING.micro }}
              className={`p-4.5 sm:p-5 rounded-2xl border text-left font-body text-base font-semibold flex items-center justify-between gap-3.5 transition-all cursor-pointer disabled:cursor-default ${btnClass}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-full bg-bg-base-deep border border-white/15 flex items-center justify-center text-xs font-bold font-display text-text-muted shrink-0 shadow-inner">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{option}</span>
              </div>
              {isAnswered && isCorrect && <Check className="w-5 h-5 text-success shrink-0" />}
              {isAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-danger shrink-0" />}
            </motion.button>
          );
        })}
      </div>

      {/* Reaction Line & Next Button */}
      <AnimatePresence>
        {showReaction && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-accent-primary/40 shadow-xl"
          >
            <div className="flex items-center gap-3 text-base font-body text-text-primary">
              {selectedIdx === questionData.correctIndex ? (
                <div className="p-1 rounded-full bg-success/20 text-success">
                  <Check className="w-5 h-5 shrink-0" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-danger/20 text-danger">
                  <X className="w-5 h-5 shrink-0" />
                </div>
              )}
              <span className="font-semibold">{questionData.reaction}</span>
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95 hover:scale-103 shadow-lg"
            >
              <span>{isLastQuestion ? 'View Verdict →' : 'Next Question →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
