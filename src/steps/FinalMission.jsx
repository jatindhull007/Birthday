import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, Archive, Heart, Gift, DollarSign, Crown, Frown, Pizza } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { useStepMachine } from '../lib/stepMachine';

export default function FinalMission({ data }) {
  const { nextStep } = useStepMachine();

  const [activeView, setActiveView] = useState('choices'); // 'choices' | 'money' | 'ceo' | 'ceo-accepted' | 'gift'
  const [moneyTick, setMoneyTick] = useState('₹10,000');
  const [isMoneyDone, setIsMoneyDone] = useState(false);
  const [giftStep, setGiftStep] = useState(0);

  const checklist = [
    { label: "Identity verification", icon: ShieldCheck, color: "text-success" },
    { label: "Investigation dossier", icon: Search, color: "text-accent-glow" },
    { label: "Memory vault unlocked", icon: Archive, color: "text-warm-gold" },
    { label: "Love calculation completed", icon: Heart, color: "text-warm-pink" },
  ];

  const handleMoneyClick = () => {
    playSfx('sfx-digit');
    setActiveView('money');
    setIsMoneyDone(false);

    const amounts = ['₹10,000', '₹9,500', '₹2,000', '₹17', '₹0'];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < amounts.length) {
        setMoneyTick(amounts[idx]);
        playSfx('sfx-digit');
      } else {
        clearInterval(interval);
        setIsMoneyDone(true);
        playSfx('sfx-buzzer');
      }
    }, 300);
  };

  const handleCeoClick = () => {
    playSfx('sfx-digit');
    setActiveView('ceo');
  };

  const handleCeoAccept = () => {
    playSfx('sfx-chime');
    setActiveView('ceo-accepted');
  };

  const handleGiftClick = () => {
    playSfx('sfx-chime');
    setActiveView('gift');
    setGiftStep(1);

    setTimeout(() => {
      setGiftStep(2);
      setTimeout(() => {
        setGiftStep(3); // Fade to black
        setTimeout(() => {
          nextStep();
        }, 1000);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-text-primary font-body relative overflow-hidden z-10">
      {/* GIFT SEQUENCE FADE TO BLACK OVERLAY */}
      {activeView === 'gift' && (
        <motion.div
          animate={{ opacity: giftStep === 3 ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-reveal-black z-50 pointer-events-none"
        />
      )}

      {/* 1. RECAP CHECKLIST & CHOICES */}
      {activeView === 'choices' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: TIMING.panel }}
          className="w-full max-w-2xl mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative shadow-2xl space-y-8 border border-white/10"
        >
          {/* Checklist Recap with distinct Lucide icons */}
          <div className="space-y-3.5">
            <span className="text-xs uppercase font-bold tracking-widest text-accent-glow font-display">
              STAGE 5 OF 6
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
              MISSION 5/6 — You've survived:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {checklist.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + idx * 0.2, duration: 0.3 }}
                    className="p-4 rounded-2xl bg-bg-base/80 border border-white/10 flex items-center gap-3.5 text-sm sm:text-base font-semibold text-text-primary shadow-sm"
                  >
                    <div className={`p-1.5 rounded-xl bg-bg-base-deep border border-white/10 ${item.color}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span>{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Reward Choices Grid with idle bob float */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="text-center sm:text-left">
              <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                CHOOSE YOUR REWARD:
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gift Card */}
              <motion.button
                type="button"
                onClick={handleGiftClick}
                whileHover={{ y: -6, scale: 1.02 }}
                animate={{ y: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="p-6 rounded-3xl bg-gradient-to-br from-accent-primary/30 via-warm-pink/20 to-warm-gold/20 border-2 border-accent-primary glow-primary text-left flex flex-col justify-between cursor-pointer shadow-xl"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-accent-primary text-text-primary flex items-center justify-center text-xl mb-4 shadow-md">
                    <Gift className="w-7 h-7 animate-bounce" />
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-text-primary">
                    🎁 Open the gift
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted mt-1 font-body">
                    The real surprise from the squad
                  </p>
                </div>
              </motion.button>

              {/* Money Card */}
              <motion.button
                type="button"
                onClick={handleMoneyClick}
                whileHover={{ y: -6, scale: 1.02 }}
                animate={{ y: [2, -2, 2] }}
                transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
                className="p-6 rounded-3xl glass-panel text-left flex flex-col justify-between cursor-pointer hover:border-white/30 transition-all shadow-xl"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-bg-base-deep text-success flex items-center justify-center text-xl mb-4 border border-white/10 shadow-inner">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-text-primary">
                    💰 Claim ₹10,000
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted mt-1 font-body">
                    Instant cash transfer to UPI
                  </p>
                </div>
              </motion.button>

              {/* CEO Card */}
              <motion.button
                type="button"
                onClick={handleCeoClick}
                whileHover={{ y: -6, scale: 1.02 }}
                animate={{ y: [-1.5, 1.5, -1.5] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="p-6 rounded-3xl glass-panel text-left flex flex-col justify-between cursor-pointer hover:border-white/30 transition-all shadow-xl"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-bg-base-deep text-warm-gold flex items-center justify-center text-xl mb-4 border border-white/10 shadow-inner">
                    <Crown className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-base sm:text-lg text-text-primary">
                    🚀 Become CEO
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted mt-1 font-body">
                    Supreme authority over calls
                  </p>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. MONEY PAYOFF MODAL */}
      {activeView === 'money' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-danger/40 shadow-2xl text-center space-y-6"
        >
          <h3 className="font-display font-bold text-lg sm:text-xl text-text-muted">
            PROCESSING PAYMENT...
          </h3>

          <div className="text-4xl sm:text-5xl font-display font-extrabold text-danger">
            {moneyTick}
          </div>

          {isMoneyDone && (
            <div className="space-y-4">
              <p className="font-body text-base text-danger font-semibold flex items-center justify-center gap-2">
                <Frown className="w-5 h-5 shrink-0" />
                <span>PAYMENT FAILED. Reason: You're not getting money. 😂</span>
              </p>
              <button
                onClick={() => setActiveView('choices')}
                className="text-xs sm:text-sm font-bold text-text-muted hover:text-text-primary underline cursor-pointer font-display"
              >
                ← Back to choices
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 3. CEO PAYOFF MODAL */}
      {(activeView === 'ceo' || activeView === 'ceo-accepted') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-warm-gold/40 shadow-2xl text-center space-y-6"
        >
          {activeView === 'ceo' ? (
            <div className="space-y-6">
              <h3 className="font-display font-extrabold text-2xl text-warm-gold flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                <span>Congratulations! You are now CEO.</span>
              </h3>
              <p className="font-body text-base text-text-primary flex items-center justify-center gap-2">
                <Pizza className="w-5 h-5 text-warm-gold" />
                <span>Your first responsibility: Buy everyone food. 🍕</span>
              </p>
              <button
                onClick={handleCeoAccept}
                className="w-full py-4 rounded-full bg-warm-gold text-bg-base-deep font-display font-bold text-base shadow-xl hover:bg-[#E5B262] cursor-pointer transition-transform hover:scale-102 active:scale-98"
              >
                ACCEPT RESPONSIBILITY
              </button>
              <div>
                <button
                  onClick={() => setActiveView('choices')}
                  className="text-xs sm:text-sm font-bold text-text-muted hover:text-text-primary underline cursor-pointer font-display"
                >
                  ← Back to choices
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
                We knew you'd accept. 😂
              </h3>
              <p className="text-sm text-text-muted font-body">
                Pizza delivery address has been logged in your DMs.
              </p>
              <button
                onClick={() => setActiveView('choices')}
                className="text-xs sm:text-sm font-bold text-text-muted hover:text-text-primary underline cursor-pointer font-display"
              >
                ← Back to choices
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 4. GIFT CARD TENSION STIMULATION */}
      {activeView === 'gift' && (
        <div className="w-full max-w-lg mx-auto text-center space-y-6 z-40">
          {giftStep >= 1 && (
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-extrabold text-3xl sm:text-4xl text-warm-gold leading-tight"
            >
              WAIT... There's actually something here.
            </motion.h2>
          )}

          {giftStep >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-body text-lg sm:text-xl text-text-muted"
            >
              But before you open it... there's one thing we want you to know.
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
