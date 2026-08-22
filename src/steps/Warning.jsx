import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertTriangle, Ghost, Heart, ArrowRight, ShieldAlert } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';

export default function Warning({ data }) {
  const { nextStep } = useStepMachine();
  const [isScaredInter, setIsScaredInter] = useState(false);

  const bulletItems = [
    { text: "embarrassing memories", icon: Camera, color: "text-accent-glow" },
    { text: "questionable decisions", icon: AlertTriangle, color: "text-warm-gold" },
    { text: "terrible photos", icon: Ghost, color: "text-warm-pink" },
    { text: "unnecessary amounts of love", icon: Heart, color: "text-danger" },
  ];

  const handleReadyClick = () => {
    playSfx('sfx-transition');
    nextStep();
  };

  const handleScaredClick = () => {
    playSfx('sfx-buzzer');
    setIsScaredInter(true);

    setTimeout(() => {
      playSfx('sfx-transition');
      nextStep();
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: TIMING.panel }}
        className="w-full max-w-lg mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative shadow-2xl border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isScaredInter ? (
            <motion.div
              key="interstitial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-danger">
                Too late. 😈
              </h2>
              <p className="font-body text-base sm:text-lg text-text-muted">
                You clicked the wrong button. Preparing birthday deployment anyway...
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-warm-gold/20 text-warm-gold flex items-center justify-center border border-warm-gold/30 shadow-inner">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary">
                    MISSION WARNING
                  </h3>
                  <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider">
                    WHAT YOU ARE ABOUT TO ENCOUNTER:
                  </p>
                </div>
              </div>

              {/* Staggered Bullet List with Lucide Icons */}
              <div className="space-y-3 my-6">
                {bulletItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.25, duration: TIMING.panel }}
                      className="p-4 rounded-2xl bg-bg-base/70 border border-white/10 flex items-center gap-4 text-sm sm:text-base font-medium text-text-primary shadow-sm hover:border-white/20 transition-colors"
                    >
                      <div className={`p-2 rounded-xl bg-bg-base-deep/90 border border-white/10 ${item.color}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-body font-semibold">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleScaredClick}
                  className="px-6 py-4 rounded-full bg-bg-base/60 border border-white/15 text-text-muted hover:text-text-primary hover:border-white/30 font-display font-bold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  I'M SCARED
                </button>
                <button
                  type="button"
                  onClick={handleReadyClick}
                  className="px-6 py-4 rounded-full bg-accent-primary text-text-primary font-display font-bold text-sm sm:text-base glow-primary hover:bg-[#4752C4] shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 hover:scale-103"
                >
                  <span>YES, I'M READY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
