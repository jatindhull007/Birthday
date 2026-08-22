import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import { TIMING } from '../lib/motion';

export default function TeamMessageCard({ messageData, index, total, onNext, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: TIMING.panel }}
      className="w-full max-w-lg mx-auto glass-panel p-7 sm:p-10 rounded-3xl relative shadow-2xl space-y-6 border border-white/10"
    >
      {/* Header with Circular Photo, Name & Counter */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={messageData.photo}
              alt={messageData.name}
              className="w-15 h-15 rounded-full object-cover border-2 border-accent-primary shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-bg-base-deep text-accent-glow border border-white/10 shadow">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl text-text-primary">
              {messageData.name}
            </h4>
            <span className="text-xs sm:text-sm text-text-muted font-body font-semibold">
              Squad Teammate
            </span>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-bold text-text-muted px-3.5 py-1.5 rounded-full bg-bg-base-deep/90 border border-white/10 font-display">
          Message {index + 1} of {total}
        </span>
      </div>

      {/* Chat Speech Bubble with Pointing Tail */}
      <div className="relative bg-bg-base-deep/95 p-6 rounded-2xl border border-white/10 shadow-inner">
        {/* Triangular tail */}
        <div className="absolute -top-2 left-7 w-4 h-4 bg-bg-base-deep/95 border-t border-l border-white/10 transform rotate-45" />

        <p className="font-body text-base sm:text-lg text-text-primary leading-relaxed pl-1 pt-1">
          "{messageData.message}"
        </p>
      </div>

      {/* Action Next Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-7 py-3.5 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] flex items-center gap-2 cursor-pointer shadow-xl transition-transform active:scale-95 hover:scale-103"
        >
          <span>{isLast ? 'Continue →' : 'Next Message →'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
