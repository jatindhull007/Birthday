import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, subscribeAudio } from '../lib/audio';

export default function MuteToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsub = subscribeAudio((state) => {
      setIsMuted(state.isMuted);
    });
    return unsub;
  }, []);

  const handleClick = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={handleClick}
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
        className="w-10 h-10 rounded-full glass-panel hover:border-accent-primary text-text-muted hover:text-text-primary shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-danger" />
        ) : (
          <Volume2 className="w-4 h-4 text-accent-primary animate-pulse" />
        )}
      </button>
    </div>
  );
}
