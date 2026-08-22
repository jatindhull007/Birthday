import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, ChevronRight, Wifi, Users, ShieldCheck } from 'lucide-react';
import { sound } from '../../services/soundService';

export default function Act0Landing({ config, onNext }) {
  const [bootProgress, setBootProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isBootComplete, setIsBootComplete] = useState(false);
  const [showPortalButton, setShowPortalButton] = useState(false);

  const rawBootLines = [
    "Connecting to Discord Squad Gateway [voice: #birthday-party]...",
    "Synchronizing team memes, screenshots & inside jokes...",
    "Calibrating maximum birthday hype engines...",
    "Checking Party Lobby Security Clearance...",
    "Matchmaking Complete: Squad members are in voice channel!"
  ];

  useEffect(() => {
    sound.playSuspenseTrack();

    // Line by line party loader
    let lineIdx = 0;
    const logInterval = setInterval(() => {
      if (lineIdx < rawBootLines.length) {
        const line = rawBootLines[lineIdx];
        setLogs((prev) => [...prev, line]);
        sound.playKeyTick();
        lineIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Progress bar 0 -> 100%
    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const next = Math.min(100, prev + Math.floor(Math.random() * 9) + 5);
        if (next % 16 === 0) sound.playKeyTick();
        return next;
      });
    }, 110);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // When progress reaches 100%, trigger celebration and reveal target
  useEffect(() => {
    if (bootProgress === 100 && !isBootComplete) {
      const timer = setTimeout(() => {
        setIsBootComplete(true);
        sound.playSuccessChime();

        // Button reveals after 600ms
        setTimeout(() => {
          setShowPortalButton(true);
        }, 600);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [bootProgress, isBootComplete]);

  const handleStart = () => {
    sound.playDigitPop();
    onNext();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-[#DBDEE1]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl rounded-3xl game-card-glow p-6 sm:p-9 relative overflow-hidden"
      >
        {/* Game Client Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#35373C] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide flex items-center gap-2">
                <span>OPERATION: {config.target.codename}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-[#5865F2] text-[10px] font-semibold border border-[#5865F2]/30">
                  PARTY LOBBY
                </span>
              </div>
              <div className="text-[11px] text-[#949BA4] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#57F287] inline-block animate-pulse"></span>
                <span>Squad Voice: #birthday-vip</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#949BA4] text-xs bg-[#1E1F22] px-3 py-1.5 rounded-xl border border-[#35373C]">
            <Wifi className="w-3.5 h-3.5 text-[#57F287]" />
            <span className="font-medium text-[11px]">18ms</span>
          </div>
        </div>

        {/* Status Activity Log */}
        <div className="min-h-[140px] space-y-2.5 mb-6 text-xs sm:text-sm text-[#DBDEE1]">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-[#1E1F22]/70 border border-[#35373C]/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5865F2] shrink-0 mt-0.5" />
              <span className={index === logs.length - 1 ? 'text-white font-semibold' : 'text-[#949BA4]'}>
                {log}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#949BA4]">
              <Users className="w-3.5 h-3.5 text-[#5865F2]" />
              LOADING SQUAD BIRTHDAY ASSETS...
            </span>
            <span className="text-[#5865F2] font-bold">{bootProgress}%</span>
          </div>
          <div className="w-full h-3 bg-[#1E1F22] rounded-full overflow-hidden p-0.5 border border-[#35373C]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#5865F2] via-[#EB459E] to-[#57F287] rounded-full"
              style={{ width: `${bootProgress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Target Detection Banner */}
        {isBootComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-[#5865F2]/20 via-[#EB459E]/15 to-[#57F287]/15 border border-[#5865F2]/40 mb-6 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2] text-white flex items-center justify-center shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#57F287] font-bold">
                  MATCHMAKING COMPLETE // TARGET IDENTIFIED
                </div>
                <div className="text-base sm:text-xl font-bold text-white mt-0.5">
                  BIRTHDAY VIP: <span className="text-[#FEE75C]">{config.target.codename}</span> ({config.target.fullName})
                </div>
                <div className="text-xs text-[#949BA4] mt-0.5">
                  Clearance: <span className="text-[#5865F2] font-semibold">{config.target.clearanceLevel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enter Portal Action Button */}
        {showPortalButton && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center pt-2"
          >
            <button
              onClick={handleStart}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#7289DA] to-[#57F287] text-white font-sans font-bold text-sm sm:text-base tracking-wide shadow-xl hover:shadow-[0_0_35px_rgba(88,101,242,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              
              <span>ENTER THE SECRET PORTAL</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
