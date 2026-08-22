import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, ArrowRight, HelpCircle, PartyPopper } from 'lucide-react';
import { sound } from '../../services/soundService';
import { triggerConfetti } from '../common/ConfettiEffect';

export default function Act1AccessOTP({ config, onNext }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showScaredJoke, setShowScaredJoke] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const cleanVal = value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = cleanVal[i] || '';
      }
      setDigits(newDigits);
      sound.playDigitPop();
      if (cleanVal.length === 6) {
        verifyCode(newDigits.join(''));
      }
      return;
    }

    const val = value.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val) {
      sound.playDigitPop();
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyCode = (code) => {
    setIsVerifying(true);
    setIsError(false);

    setTimeout(() => {
      setIsVerifying(false);
      const targetCode = config.security.accessCode;
      const backupCode = config.security.backupCode || '000000';

      if (code === targetCode || code === backupCode) {
        setIsSuccess(true);
        sound.playSuccessChime();
        triggerConfetti('burst');

        setTimeout(() => {
          setShowWarningModal(true);
        }, 1100);
      } else {
        setIsError(true);
        sound.playBuzzerFail();
        setErrorMessage('Incorrect passkey! Ask your squad or check your WhatsApp hint.');
        setTimeout(() => {
          setDigits(['', '', '', '', '', '']);
          if (inputRefs.current[0]) inputRefs.current[0].focus();
          setIsError(false);
        }, 1500);
      }
    }, 600);
  };

  const handleScaredChoice = () => {
    sound.playGlitch();
    setShowScaredJoke(true);
  };

  const handleProceed = () => {
    sound.playDigitPop();
    onNext();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-[#DBDEE1]">
      {/* MAIN OTP CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: isError ? [-8, 8, -6, 6, -3, 3, 0] : 0,
        }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-xl p-6 sm:p-10 rounded-3xl game-card relative overflow-hidden transition-all duration-300 ${
          isSuccess
            ? 'border-[#57F287] shadow-[0_0_50px_rgba(87,242,135,0.3)]'
            : isError
            ? 'border-[#ED4245] shadow-[0_0_50px_rgba(237,66,69,0.3)]'
            : 'border-[#35373C] shadow-2xl'
        }`}
      >
        {/* TOP STATUS */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C] text-xs">
          <div className="flex items-center gap-2 text-[#5865F2] font-semibold">
            <KeyRound className="w-4 h-4" />
            <span>SQUAD PASSKEY VERIFICATION</span>
          </div>
          <span className="text-[#949BA4] font-medium">PARTY LOBBY #0822</span>
        </div>

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] mb-4 shadow-lg">
            {isSuccess ? (
              <ShieldCheck className="w-8 h-8 text-[#57F287] animate-bounce" />
            ) : (
              <KeyRound className="w-8 h-8 text-[#5865F2]" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ENTER PARTY PASSKEY
          </h2>
          <p className="text-xs sm:text-sm text-[#949BA4] mt-1.5 max-w-sm mx-auto">
            Enter the 6-digit secret code your friends shared with you to unlock the birthday experience!
          </p>
        </div>

        {/* 6-DIGIT INPUT BOXES */}
        <div className="flex justify-center gap-2.5 sm:gap-3.5 mb-6">
          {digits.map((digit, idx) => (
            <motion.input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isSuccess || isVerifying}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl outline-none transition-all ${
                isSuccess
                  ? 'bg-[#1E1F22] border-2 border-[#57F287] text-[#57F287] shadow-[0_0_15px_rgba(87,242,135,0.4)]'
                  : isError
                  ? 'bg-[#1E1F22] border-2 border-[#ED4245] text-[#ED4245] shadow-[0_0_15px_rgba(237,66,69,0.4)]'
                  : digit
                  ? 'bg-[#1E1F22] border-2 border-[#5865F2] text-white shadow-[0_0_15px_rgba(88,101,242,0.3)]'
                  : 'bg-[#1E1F22] border border-[#35373C] text-white hover:border-[#5865F2]/60 focus:border-[#5865F2] focus:shadow-[0_0_15px_rgba(88,101,242,0.3)]'
              }`}
            />
          ))}
        </div>

        {/* STATUS & FEEDBACK */}
        <div className="min-h-[30px] flex items-center justify-center text-center text-xs sm:text-sm mb-4 font-medium">
          {isVerifying && (
            <span className="text-[#5865F2] animate-pulse">
              Verifying secret squad passkey...
            </span>
          )}
          {isSuccess && (
            <span className="text-[#57F287] flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Passkey Accepted! Welcome to the celebration!
            </span>
          )}
          {isError && (
            <span className="text-[#ED4245] flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </span>
          )}
        </div>

        {/* HELPER HINT ACCORDION */}
        <div className="text-center pt-3 border-t border-[#35373C]">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-[#949BA4] hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? "Hide Passkey Hint" : "Need the passcode hint?"}</span>
          </button>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2.5 text-xs text-[#5865F2] bg-[#1E1F22] p-3 rounded-xl border border-[#5865F2]/30"
            >
              {config.security.hintText} (Default: <span className="font-bold underline">{config.security.accessCode}</span>)
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* WARNING BRIEFING MODAL */}
      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg rounded-3xl game-card border border-[#FEE75C]/50 p-6 sm:p-8 relative shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-[#FEE75C]/20 border border-[#FEE75C]/30 text-[#FEE75C]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    MISSION BRIEFING // READY CHECK
                  </h3>
                  <p className="text-xs text-[#FEE75C] font-semibold">
                    DISCORD SQUAD SURPRISE ACTIVATION
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 my-6 text-xs sm:text-sm text-[#DBDEE1]">
                {config.security.warningChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1E1F22] border border-[#35373C]">
                    <span className="text-[#FEE75C] font-bold">✨</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* CHOICES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleScaredChoice}
                  className="px-4 py-3.5 rounded-2xl bg-[#1E1F22] hover:bg-[#35373C] border border-[#35373C] text-[#949BA4] hover:text-white font-semibold text-xs transition-all"
                >
                  😰 I'M SCARED
                </button>
                <button
                  onClick={handleProceed}
                  className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#57F287] hover:from-[#4752C4] hover:to-[#57F287] text-white font-bold text-xs tracking-wider shadow-lg hover:shadow-[#5865F2]/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>YES, I'M READY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCARED JOKE MODAL */}
      <AnimatePresence>
        {showScaredJoke && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-full max-w-md rounded-3xl game-card border-2 border-[#5865F2] p-6 sm:p-8 text-center relative shadow-2xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5865F2]/20 text-[#5865F2] mb-4 border border-[#5865F2]/40">
                <PartyPopper className="w-8 h-8 animate-bounce text-[#5865F2]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {config.security.scaredJokeModal.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#DBDEE1] mb-6 leading-relaxed">
                {config.security.scaredJokeModal.subtext}
              </p>
              <button
                onClick={handleProceed}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#57F287] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-[#5865F2]/50 transition-all"
              >
                {config.security.scaredJokeModal.buttonText}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
