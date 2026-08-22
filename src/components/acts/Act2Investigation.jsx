import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, CheckCircle2, XCircle, Trophy, ArrowRight, Flame, Gamepad2, Award } from 'lucide-react';
import { sound } from '../../services/soundService';
import { triggerConfetti } from '../common/ConfettiEffect';

export default function Act2Investigation({ config, onNext }) {
  // Phase: 'dossier' -> 'quiz' -> 'verdict'
  const [phase, setPhase] = useState('dossier');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const quizList = config.dossier.quiz;
  const currentQ = quizList[currentQuestionIdx];

  const handleOptionSelect = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      sound.playSuccessChime();
      triggerConfetti('burst');
      setFeedback({
        type: 'success',
        text: currentQ.reactionSuccess
      });
    } else {
      sound.playBuzzerFail();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setFeedback({
        type: 'error',
        text: currentQ.reactionFail
      });
    }
  };

  const handleNextQuestion = () => {
    sound.playDigitPop();
    setIsAnswered(false);
    setSelectedOption(null);
    setFeedback(null);

    if (currentQuestionIdx + 1 < quizList.length) {
      setCurrentQuestionIdx((i) => i + 1);
    } else {
      setPhase('verdict');
      sound.playFanfare();
      triggerConfetti('celebration');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-[#DBDEE1]">
      {/* 1. DISCORD PLAYER PROFILE / DOSSIER VIEW */}
      {phase === 'dossier' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl game-card rounded-3xl p-6 sm:p-9 border border-[#35373C] shadow-2xl relative overflow-hidden"
        >
          {/* PROFILE TOP BANNER */}
          <div className="h-28 -mx-6 sm:-mx-9 -mt-6 sm:-mt-9 bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#FEE75C] p-4 flex items-start justify-end relative">
            <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wide flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#FEE75C]" />
              <span>SERVER LEVEL 24 VIP</span>
            </div>
          </div>

          {/* AVATAR & NAME HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6 pb-6 border-b border-[#35373C]">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={config.target.avatar}
                  alt={config.target.codename}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#2B2D31] shadow-xl"
                />
                {/* Online Discord Status Badge */}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#57F287] border-4 border-[#2B2D31] shadow" />
              </div>
              <div className="mb-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{config.target.fullName}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#5865F2] text-white font-semibold">
                    VIP
                  </span>
                </h2>
                <p className="text-xs text-[#949BA4] font-medium mt-0.5">
                  @{config.target.codename} • {config.target.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-2xl bg-[#1E1F22] border border-[#35373C] text-xs font-semibold text-[#FEE75C] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FEE75C]" />
                <span>Vibe Rating: {config.dossier.threatLevel}%</span>
              </span>
            </div>
          </div>

          {/* PLAYER ACHIEVEMENTS & LEGENDARY OFFENCES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* ALIASES / SQUAD ROLES */}
            <div className="p-4 rounded-2xl bg-[#1E1F22] border border-[#35373C] space-y-3">
              <h4 className="text-xs uppercase text-[#949BA4] font-bold tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#5865F2]" />
                UNLOCKED SQUAD ROLES & ALIASES
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {config.dossier.aliases.map((alias, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-[#2B2D31] border border-[#35373C] text-white text-xs font-medium hover:border-[#5865F2] transition-colors"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            {/* KNOWN OFFENCES / SQUAD HIGHLIGHTS */}
            <div className="p-4 rounded-2xl bg-[#1E1F22] border border-[#35373C] space-y-3">
              <h4 className="text-xs uppercase text-[#949BA4] font-bold tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-[#EB459E]" />
                LEGENDARY SQUAD HIGHLIGHTS
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {config.dossier.knownOffences.map((offence, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#2B2D31] border border-[#35373C]/80 text-xs flex items-start gap-2"
                  >
                    <span className="text-[#5865F2] font-semibold">[{offence.date}]</span>
                    <span className="text-[#DBDEE1]">{offence.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-4 border-t border-[#35373C] flex justify-end">
            <button
              onClick={() => {
                sound.playDigitPop();
                setPhase('quiz');
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#5865F2] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-[#5865F2]/30 flex items-center gap-2 transition-all"
            >
              <span>START SQUAD TRIVIA QUEST</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. SQUAD TRIVIA QUIZ VIEW */}
      {phase === 'quiz' && (
        <motion.div
          key={`q-${currentQuestionIdx}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: 1,
            x: isShaking ? [-8, 8, -6, 6, 0] : 0,
          }}
          transition={{ duration: 0.35 }}
          className={`w-full max-w-2xl game-card rounded-3xl p-6 sm:p-9 border relative overflow-hidden transition-all duration-300 ${
            feedback?.type === 'success'
              ? 'border-[#57F287] shadow-[0_0_40px_rgba(87,242,135,0.25)]'
              : feedback?.type === 'error'
              ? 'border-[#ED4245] shadow-[0_0_40px_rgba(237,66,69,0.25)]'
              : 'border-[#35373C]'
          }`}
        >
          {/* QUIZ HEADER */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C] text-xs">
            <span className="text-[#5865F2] uppercase font-bold tracking-wider">
              SQUAD TRIVIA // QUESTION {currentQuestionIdx + 1} OF {quizList.length}
            </span>
            <span className="text-[#949BA4] font-semibold">
              SCORE: <span className="text-[#57F287]">{score}</span> / {quizList.length}
            </span>
          </div>

          {/* QUESTION PROMPT */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* OPTIONS LIST */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = "bg-[#1E1F22] border-[#35373C] text-[#DBDEE1] hover:border-[#5865F2] hover:bg-[#35373C]";

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-[#57F287]/20 border-[#57F287] text-white shadow-[0_0_15px_rgba(87,242,135,0.3)]";
                } else if (isSelected) {
                  btnStyle = "bg-[#ED4245]/20 border-[#ED4245] text-white shadow-[0_0_15px_rgba(237,66,69,0.3)]";
                } else {
                  btnStyle = "bg-[#1E1F22]/50 border-[#35373C] text-[#949BA4] opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-xl bg-[#2B2D31] border border-[#35373C] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#57F287] shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#ED4245] shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* FEEDBACK COMMENTARY */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-start gap-2.5 ${
                  feedback.type === 'success'
                    ? 'bg-[#57F287]/15 border border-[#57F287]/40 text-[#57F287]'
                    : 'bg-[#ED4245]/15 border border-[#ED4245]/40 text-[#ED4245]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{feedback.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#57F287] hover:from-[#4752C4] hover:to-[#57F287] text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg flex items-center gap-2 transition-all"
              >
                <span>{currentQuestionIdx + 1 < quizList.length ? 'NEXT QUESTION' : 'VIEW VERDICT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 3. VERDICT / QUEST COMPLETE SCREEN */}
      {phase === 'verdict' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl game-card rounded-3xl p-6 sm:p-10 border border-[#57F287]/50 shadow-[0_0_60px_rgba(87,242,135,0.25)] text-center relative overflow-hidden"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#57F287]/20 border border-[#57F287]/40 text-[#57F287] mb-6">
            <Trophy className="w-9 h-9 text-[#57F287] animate-bounce" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#57F287] font-bold block mb-1">
            QUEST COMPLETED // SQUAD VERDICT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            CLEARANCE GRANTED!
          </h2>

          <p className="text-xs sm:text-sm text-[#949BA4] max-w-md mx-auto leading-relaxed mb-6">
            Player <span className="text-white font-bold">{config.target.codename}</span> has officially passed the Squad Knowledge Assessment! Access to the classified Memory Vault is now unlocked.
          </p>

          <div className="p-4 rounded-2xl bg-[#1E1F22] border border-[#35373C] mb-8 inline-block px-8">
            <div className="text-xs text-[#949BA4] font-semibold">TRIVIA ACCURACY</div>
            <div className="text-2xl font-bold text-[#57F287] mt-0.5">
              {score} / {quizList.length} CORRECT
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                sound.playVaultUnlock();
                onNext();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#57F287] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-[#5865F2]/40 transition-all flex items-center justify-center gap-2"
            >
              <span>ENTER THE MEMORY VAULT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
