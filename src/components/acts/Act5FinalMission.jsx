import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Gift, DollarSign, Crown, Sparkles, AlertCircle, Heart, ArrowRight } from 'lucide-react';
import { sound } from '../../services/soundService';

export default function Act5FinalMission({ config, onNext }) {
  const [selectedReward, setSelectedReward] = useState(null);
  const [isBuildingTension, setIsBuildingTension] = useState(false);
  const [activeComicModal, setActiveComicModal] = useState(null);

  const choices = config.finalMission.choices;

  const handleRewardClick = (choice) => {
    sound.playDigitPop();

    if (choice.id === 'cash' || choice.id === 'ceo') {
      sound.playBuzzerFail();
      setActiveComicModal(choice.comicResult);
    } else if (choice.id === 'gift') {
      setSelectedReward(choice);
      setIsBuildingTension(true);

      sound.playHeartbeat();
      const hbInterval = setInterval(() => {
        sound.playHeartbeat();
      }, 950);

      setTimeout(() => {
        clearInterval(hbInterval);
        // CRITICAL FOR STEP 6: Cut audio into complete silence
        sound.cutToSilence();
        onNext();
      }, 3400);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-[#DBDEE1]">
      {/* TENSION BUILD-UP OVERLAY (CUT TO BLACK) */}
      <AnimatePresence>
        {isBuildingTension && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 bg-[#0B0C0E] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.95 }}
              className="w-24 h-24 rounded-3xl bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
            >
              <Heart className="w-12 h-12 text-red-500 fill-current animate-pulse" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wider"
            >
              DECRYPTING THE REAL SQUAD SURPRISE...
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs sm:text-sm text-[#949BA4] mt-2 max-w-sm"
            >
              Wait... there's actually something here for you, {config.target.codename}.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN MISSION RECAP CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl game-card rounded-3xl p-6 sm:p-10 border border-[#5865F2]/40 shadow-2xl relative overflow-hidden"
      >
        {/* TOP STATUS */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C]">
          <div className="flex items-center gap-2 text-[#57F287] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>FINAL PARTY MISSION // STAGE 5 OF 6</span>
          </div>
          <span className="text-[#57F287] text-xs font-bold">ALL QUESTS CLEARED</span>
        </div>

        {/* CHECKLIST RECAP */}
        <div className="mb-8">
          <h3 className="text-xs uppercase text-[#949BA4] font-bold mb-3 tracking-wide">
            MISSION PROGRESS RECAP:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {config.finalMission.checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#1E1F22] border border-[#57F287]/30 text-xs text-white"
              >
                <CheckCircle2 className="w-4 h-4 text-[#57F287] shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REWARD SELECTION */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">
              CLAIM YOUR BIRTHDAY REWARD:
            </h2>
            <p className="text-xs text-[#949BA4] mt-0.5">
              Choose wisely — only one option unlocks the final truth!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            {choices.map((choice) => {
              const isGift = choice.id === 'gift';
              return (
                <button
                  key={choice.id}
                  onClick={() => handleRewardClick(choice)}
                  className={`p-4 rounded-3xl border text-left transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex flex-col justify-between ${
                    isGift
                      ? 'bg-gradient-to-br from-[#5865F2]/30 via-[#EB459E]/30 to-[#FEE75C]/20 border-[#5865F2] shadow-[0_0_30px_rgba(88,101,242,0.4)] hover:shadow-[0_0_40px_rgba(235,69,158,0.5)]'
                      : 'bg-[#1E1F22] border-[#35373C] hover:border-[#5865F2]/50'
                  }`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-[#2B2D31] flex items-center justify-center text-xl mb-3.5 border border-[#35373C]">
                      {choice.id === 'cash' && <DollarSign className="w-5 h-5 text-[#57F287]" />}
                      {choice.id === 'ceo' && <Crown className="w-5 h-5 text-[#FEE75C]" />}
                      {choice.id === 'gift' && <Gift className="w-5 h-5 text-[#EB459E] animate-bounce" />}
                    </div>
                    <h4 className="font-bold text-sm text-white">{choice.title}</h4>
                    <p className="text-xs text-[#949BA4] mt-1">{choice.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-[#35373C] flex items-center justify-between text-xs font-bold text-[#5865F2]">
                    <span>SELECT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* COMIC REWARD MODAL (FOR CASH / CEO GAGS) */}
      <AnimatePresence>
        {activeComicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md rounded-3xl game-card border border-[#FEE75C]/50 p-6 sm:p-8 text-center relative shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEE75C]/20 text-[#FEE75C] mb-4 border border-[#FEE75C]/40">
                <AlertCircle className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {activeComicModal.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#DBDEE1] mb-6 leading-relaxed">
                {activeComicModal.body}
              </p>
              <button
                onClick={() => {
                  sound.playDigitPop();
                  setActiveComicModal(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#1E1F22] hover:bg-[#35373C] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                TRY ANOTHER OPTION 🔄
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
