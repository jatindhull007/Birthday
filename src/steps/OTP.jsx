import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, BadgeCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { fireConfetti } from '../components/ConfettiBurst';
import Warning from './Warning';

export default function OTP({ data }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [popIdx, setPopIdx] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const clean = value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = clean[i] || '';
      }
      setDigits(newDigits);
      playSfx('sfx-digit');
      if (clean.length === 6) {
        verifyCode(newDigits.join(''));
      }
      return;
    }

    const val = value.slice(-1).replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val) {
      playSfx('sfx-digit');
      setPopIdx(index);
      setTimeout(() => setPopIdx(null), 150);

      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
        setFocusedIdx(index + 1);
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
      setFocusedIdx(index - 1);
    }
  };

  const verifyCode = (code) => {
    if (code === data.otp || code === '000000' || code === '246810') {
      setIsSuccess(true);
      playSfx('sfx-chime');
      fireConfetti('otp');

      setTimeout(() => {
        setShowWarning(true);
      }, 1300);
    } else {
      setIsError(true);
      playSfx('sfx-buzzer');

      setTimeout(() => {
        setDigits(['', '', '', '', '', '']);
        setIsError(false);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
          setFocusedIdx(0);
        }
      }, 900);
    }
  };

  const isComplete = digits.join('').length === 6 && !digits.includes('');

  if (showWarning) {
    return <Warning data={data} />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative z-10 font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: TIMING.panel }}
        className="w-full max-w-lg mx-auto glass-panel p-8 sm:p-11 rounded-3xl relative text-center shadow-2xl border border-white/10"
      >
        <AnimatePresence>
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="py-6 space-y-4"
            >
              <div className="w-18 h-18 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mx-auto text-success glow-success">
                <BadgeCheck className="w-11 h-11 animate-bounce" />
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-success">
                ACCESS GRANTED ✓
              </h2>
              <p className="font-body text-base sm:text-lg text-text-muted flex items-center justify-center gap-2">
                <span>Welcome,</span>
                <span className="text-text-primary font-bold">{data.name}</span>
                <ShieldCheck className="w-5 h-5 text-accent-glow" />
              </p>
            </motion.div>
          ) : (
            <div>
              {/* Lock Icon & Heading */}
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center mx-auto mb-4 text-accent-glow shadow-inner glow-primary">
                <Lock className="w-7 h-7" />
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary mb-2">
                🔐 TOP SECRET
              </h2>
              <p className="font-body text-sm sm:text-base text-text-muted max-w-sm mx-auto mb-8 leading-relaxed">
                We need to verify your identity. An OTP has been sent to your registered device.
              </p>

              {/* 6 Digit Input Boxes */}
              <motion.div
                animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="flex justify-center gap-2.5 sm:gap-3.5 mb-4"
              >
                {digits.map((digit, idx) => {
                  const isFocused = focusedIdx === idx;
                  return (
                    <motion.input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={isSuccess}
                      onFocus={() => setFocusedIdx(idx)}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      animate={{
                        scale: popIdx === idx ? [1, 1.15, 1] : 1,
                        y: isFocused && !isSuccess && !isError ? [-3, 3, -3] : 0,
                      }}
                      transition={{
                        scale: { duration: 0.15 },
                        y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                      }}
                      className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-display font-bold rounded-2xl border-2 outline-none transition-all ${
                        isSuccess
                          ? 'border-success bg-success/20 text-success glow-success'
                          : isError
                          ? 'border-danger bg-danger/20 text-danger glow-danger'
                          : digit
                          ? 'border-accent-primary bg-bg-base/90 text-text-primary glow-primary'
                          : 'border-white/15 bg-bg-base/60 text-text-primary hover:border-accent-primary/60 focus:border-accent-glow focus:shadow-[0_0_20px_rgba(139,127,245,0.45)]'
                      }`}
                    />
                  );
                })}
              </motion.div>

              {/* Error Micro-copy */}
              <div className="min-h-[26px]">
                {isError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs sm:text-sm font-semibold text-danger font-body"
                  >
                    that's not it... try again!
                  </motion.p>
                )}
              </div>

              {/* Interactive Verify Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  disabled={!isComplete || isSuccess}
                  onClick={() => verifyCode(digits.join(''))}
                  className={`px-8 py-3.5 rounded-full font-display font-bold text-sm sm:text-base transition-all cursor-pointer ${
                    isComplete
                      ? 'bg-accent-primary text-text-primary glow-primary shadow-xl hover:bg-[#4752C4] transform hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-text-muted/40 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>VERIFY PASSKEY</span>
                </button>
              </div>

              <p className="text-xs text-text-muted/60 mt-5 font-body">
                Hint: Passcode is <span className="font-bold underline text-text-muted">{data.otp}</span>
              </p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
