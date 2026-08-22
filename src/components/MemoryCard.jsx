import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, CheckCircle2, ArrowRight, PenTool } from 'lucide-react';
import { TIMING } from '../lib/motion';
import { playSfx } from '../lib/audio';
import { fireConfetti } from './ConfettiBurst';

export default function MemoryCard({ memory, index, onNextMemory, isLastMemory }) {
  const [isSolved, setIsSolved] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearShake, setYearShake] = useState(null);

  // identify-faces
  const [unmaskedFaces, setUnmaskedFaces] = useState({});
  const [activeHotspot, setActiveHotspot] = useState(null);

  // guess-audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [speakerShake, setSpeakerShake] = useState(null);

  const rotationAngles = [-2.5, 1.8, -1.2, 2.2, -1.9, 1.5];
  const rotation = rotationAngles[index % rotationAngles.length];

  // 1. Guess Year Handler
  const handleYearClick = (year) => {
    if (isSolved) return;
    setSelectedYear(year);
    if (year === memory.answer) {
      playSfx('sfx-chime');
      fireConfetti('quiz');
      setIsSolved(true);
    } else {
      playSfx('sfx-buzzer');
      setYearShake(year);
      setTimeout(() => setYearShake(null), 400);
    }
  };

  // 2. Identify Faces Handler
  const handleHotspotClick = (faceIdx) => {
    if (unmaskedFaces[faceIdx]) return;
    setActiveHotspot(faceIdx);
    playSfx('sfx-digit');
  };

  const handleNameSelect = (name) => {
    if (activeHotspot === null) return;
    const targetFace = memory.options[activeHotspot];

    if (name === targetFace.name) {
      playSfx('sfx-chime');
      const updated = { ...unmaskedFaces, [activeHotspot]: true };
      setUnmaskedFaces(updated);
      setActiveHotspot(null);

      if (Object.keys(updated).length === memory.options.length) {
        fireConfetti('quiz');
        setIsSolved(true);
      }
    } else {
      playSfx('sfx-buzzer');
    }
  };

  // 3. Guess Audio Handler
  const handlePlayAudioToggle = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      playSfx('sfx-digit');
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2400);
    }
  };

  const handleSpeakerSelect = (speaker) => {
    if (isSolved) return;
    setSelectedSpeaker(speaker);

    if (speaker === memory.answer) {
      playSfx('sfx-chime');
      fireConfetti('quiz');
      setIsSolved(true);
    } else {
      playSfx('sfx-buzzer');
      setSpeakerShake(speaker);
      setTimeout(() => setSpeakerShake(null), 400);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: TIMING.panel }}
      className="w-full max-w-lg mx-auto bg-white p-6 sm:p-7 pb-8 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.15)] border-2 border-scrapbook-cream/90 text-scrapbook-brown font-body relative"
    >
      {/* Decorative Scrapbook Washi Tape Corner */}
      <div className="absolute -top-3.5 left-8 w-24 h-7 washi-tape rounded-sm transform -rotate-6 z-20 border border-warm-gold/50 opacity-90 pointer-events-none shadow-sm" />

      {/* POLAROID PHOTO CONTAINER */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 shadow-inner mb-6 border border-stone-200">
        <motion.img
          src={memory.media}
          alt={`Memory ${index + 1}`}
          animate={{
            filter: memory.type === 'guess-year' ? (isSolved ? 'blur(0px)' : 'blur(20px)') : 'blur(0px)',
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full h-full object-cover select-none"
        />

        {/* Hotspots for identify-faces with subtle pulse */}
        {memory.type === 'identify-faces' &&
          memory.options.map((hotspot, hIdx) => {
            const isUnmasked = unmaskedFaces[hIdx];
            const isActive = activeHotspot === hIdx;

            return (
              <div
                key={hIdx}
                style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                onClick={() => handleHotspotClick(hIdx)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer ${
                  isUnmasked
                    ? 'pointer-events-none'
                    : 'w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/30 backdrop-blur-md border-2 border-white flex items-center justify-center animate-pulse shadow-lg'
                } ${isActive ? 'ring-4 ring-accent-primary' : ''}`}
              >
                {!isUnmasked ? (
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-black/70 px-2.5 py-0.5 rounded-full font-display">
                    Who?
                  </span>
                ) : (
                  <span className="text-xs font-bold text-success bg-black/90 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {hotspot.name}
                  </span>
                )}
              </div>
            );
          })}

        {/* Audio Waveform Overlay for guess-audio */}
        {memory.type === 'guess-audio' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center">
            <button
              onClick={handlePlayAudioToggle}
              className={`w-18 h-18 rounded-full bg-accent-primary text-text-primary flex items-center justify-center shadow-2xl transition-transform ${
                isPlayingAudio ? 'scale-110 glow-primary' : 'hover:scale-105'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>

            {/* Equalizer Pulsing Waveform Bars */}
            <div className="flex items-center gap-1.5 mt-5">
              {[12, 28, 16, 36, 24, 18, 30, 14, 26].map((barH, bIdx) => (
                <motion.div
                  key={bIdx}
                  animate={{
                    height: isPlayingAudio ? [barH, barH * 1.5, barH * 0.5, barH] : barH,
                  }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: bIdx * 0.06 }}
                  className="w-1.5 bg-warm-gold rounded-full"
                  style={{ height: `${barH}px` }}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm font-bold text-text-primary mt-3 font-body">
              {isPlayingAudio ? 'Playing squad voice memory...' : 'Tap play to listen'}
            </p>
          </div>
        )}
      </div>

      {/* CHALLENGE CONTROLS */}
      <div className="space-y-4">
        {/* Sticky Note Handwritten Tag */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-warm-gold/30 border border-warm-gold/60 rounded-md text-xs font-bold uppercase tracking-wider text-scrapbook-brown font-display transform -rotate-1 shadow-sm">
            MEMORY #{index + 1}
          </span>
          <span className="text-xs sm:text-sm font-bold text-scrapbook-brown/80 font-display">
            {memory.type === 'guess-year' && 'When was this?'}
            {memory.type === 'identify-faces' && 'Who was there?'}
            {memory.type === 'guess-audio' && 'Who said this?'}
          </span>
        </div>

        {/* 1. Guess Year Buttons */}
        {memory.type === 'guess-year' && (
          <div className="grid grid-cols-4 gap-2.5">
            {memory.options.map((year) => {
              const isCorrect = isSolved && year === memory.answer;
              const isShaking = yearShake === year;

              return (
                <motion.button
                  key={year}
                  disabled={isSolved}
                  onClick={() => handleYearClick(year)}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold border-2 transition-colors cursor-pointer disabled:cursor-default font-display ${
                    isCorrect
                      ? 'bg-success text-bg-base-deep border-success glow-success shadow-md'
                      : 'bg-scrapbook-cream/70 border-scrapbook-brown/30 text-scrapbook-brown hover:bg-scrapbook-cream hover:border-scrapbook-brown hover:scale-105'
                  }`}
                >
                  {year}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* 2. Identify Faces Name Chips */}
        {memory.type === 'identify-faces' && !isSolved && (
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm text-scrapbook-brown/80 font-medium font-body">
              {activeHotspot !== null
                ? `Matching face #${activeHotspot + 1}: Select name below`
                : 'Click a pulsing circle on the photo first to identify them'}
            </p>
            <div className="flex flex-wrap gap-2">
              {memory.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={activeHotspot === null}
                  onClick={() => handleNameSelect(opt.name)}
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-scrapbook-cream/90 border border-scrapbook-brown/40 text-scrapbook-brown hover:bg-scrapbook-cream hover:border-scrapbook-brown disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-sm font-display"
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Guess Audio Speaker Options */}
        {memory.type === 'guess-audio' && (
          <div className="grid grid-cols-2 gap-2.5">
            {memory.options.map((speaker) => {
              const isCorrect = isSolved && speaker === memory.answer;
              const isShaking = speakerShake === speaker;

              return (
                <motion.button
                  key={speaker}
                  disabled={isSolved}
                  onClick={() => handleSpeakerSelect(speaker)}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-colors cursor-pointer disabled:cursor-default font-display ${
                    isCorrect
                      ? 'bg-success text-bg-base-deep border-success glow-success shadow-md'
                      : 'bg-scrapbook-cream/70 border-scrapbook-brown/30 text-scrapbook-brown hover:bg-scrapbook-cream hover:border-scrapbook-brown hover:scale-103'
                  }`}
                >
                  {speaker}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* REVEALED STORY CAPTION IN CAVEAT SCRIPT WITH PEN ICON */}
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-4 border-t border-scrapbook-brown/20 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <PenTool className="w-5 h-5 text-scrapbook-brown/70 shrink-0 mt-1" />
                <p className="font-script text-2xl sm:text-3xl text-scrapbook-brown leading-snug font-bold">
                  "{memory.story}"
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onNextMemory}
                  className="px-6 py-3 rounded-full bg-scrapbook-brown text-scrapbook-cream font-display font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-[#724A2D] cursor-pointer shadow-xl transition-transform active:scale-95 hover:scale-103"
                >
                  <span>{isLastMemory ? 'Continue →' : 'Next Memory →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
