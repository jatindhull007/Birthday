import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Headphones, Radio } from 'lucide-react';
import { sound } from '../../services/soundService';

export default function AudioToggle() {
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const [trackName, setTrackName] = useState(sound.trackName);

  useEffect(() => {
    const unsubscribe = sound.subscribe((state) => {
      setIsMuted(state.isMuted);
      setTrackName(state.trackName);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    sound.ensureContext();
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playDigitPop();
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E1F22]/90 border border-[#35373C] backdrop-blur-md text-xs font-sans text-[#DBDEE1] shadow-lg">
        <Headphones className={`w-3.5 h-3.5 ${!isMuted && trackName !== 'Silence' ? 'text-[#57F287] animate-pulse' : 'text-slate-500'}`} />
        <span className="font-semibold text-[11px] tracking-wide">
          {isMuted ? 'VOICE: MUTED' : trackName === 'Silence' ? 'VOICE: SILENCE' : `TRACK: ${trackName}`}
        </span>
      </div>

      <button
        onClick={handleToggle}
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
        className="p-2.5 rounded-2xl bg-[#2B2D31]/90 border border-[#35373C] hover:border-[#5865F2] text-[#DBDEE1] hover:text-white backdrop-blur-md shadow-lg transition-all transform hover:scale-105 active:scale-95"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-[#ED4245]" /> : <Volume2 className="w-4 h-4 text-[#5865F2] animate-pulse" />}
      </button>
    </div>
  );
}
