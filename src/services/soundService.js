import { Howl } from 'howler';

/**
 * SOUND ENGINE: OPERATION MK
 * Leverages Web Audio API procedural synthesis for 100% instant,
 * zero-latency SFX, coupled with Howler for ambient background music.
 */

class SoundService {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.currentTrack = null;
    this.trackName = 'None';
    this.musicVolume = 0.35;
    this.listeners = new Set();
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext && !this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported on this browser", e);
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn({ isMuted: this.isMuted, trackName: this.trackName }));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentTrack) {
      if (this.isMuted) {
        this.currentTrack.pause();
      } else {
        this.currentTrack.play();
      }
    }
    this.notify();
    return this.isMuted;
  }

  // ==========================================
  // PROCEDURAL WEB AUDIO SFX (0 external lag)
  // ==========================================

  playKeyTick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playDigitPop() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  playSuccessChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = this.audioCtx.currentTime + idx * 0.08;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  playBuzzerFail() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.audioCtx.currentTime + 0.35);
      
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  playGlitch() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * 0.1;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      
      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      whiteNoise.start();
    } catch (e) {}
  }

  playVaultUnlock() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      // Ratchet clicks
      for (let i = 0; i < 4; i++) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const time = this.audioCtx.currentTime + i * 0.09;
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(320 + i * 80, time);
        
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.05);
      }
      
      // Heavy hydraulic hum
      const bassOsc = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(80, this.audioCtx.currentTime + 0.35);
      bassOsc.frequency.exponentialRampToValueAtTime(160, this.audioCtx.currentTime + 0.85);
      
      bassGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime + 0.35);
      bassGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.9);
      
      bassOsc.connect(bassGain);
      bassGain.connect(this.audioCtx.destination);
      bassOsc.start(this.audioCtx.currentTime + 0.35);
      bassOsc.stop(this.audioCtx.currentTime + 0.9);
    } catch (e) {}
  }

  playHeartbeat() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      [0, 0.16].forEach((offset) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const startTime = this.audioCtx.currentTime + offset;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, startTime);
        osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.12);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {}
  }

  playFanfare() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.25 }, // E5
        { f: 783.99, d: 0.25 }, // G5
        { f: 1046.50, d: 0.6 }  // C6
      ];
      
      let curr = this.audioCtx.currentTime;
      melody.forEach(note => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, curr);
        
        gain.gain.setValueAtTime(0.14, curr);
        gain.gain.exponentialRampToValueAtTime(0.001, curr + note.d);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(curr);
        osc.stop(curr + note.d);
        curr += note.d * 0.9;
      });
    } catch (e) {}
  }

  // ==========================================
  // AMBIENT MUSIC SYNTHESIS & HOWLER PLAYER
  // ==========================================

  playSuspenseTrack() {
    if (this.trackName === 'Suspense' && this.currentTrack) return;
    this.stopCurrentMusic();
    this.trackName = 'Suspense';
    this.notify();

    if (this.isMuted) return;
    this.ensureContext();

    // Ambient Cyber Suspense Drone using procedural Web Audio
    this.currentTrack = this.createAmbientDrone([110, 164.81, 220], 'sine', 0.04);
  }

  playEmotionalTrack() {
    if (this.trackName === 'Celebration' && this.currentTrack) return;
    this.stopCurrentMusic();
    this.trackName = 'Celebration';
    this.notify();

    if (this.isMuted) return;
    this.ensureContext();

    // Warm, lush chords for the emotional reveal
    this.currentTrack = this.createAmbientDrone([261.63, 329.63, 392.00, 523.25], 'triangle', 0.06, true);
  }

  createAmbientDrone(frequencies, type = 'sine', maxVolume = 0.05, arpeggiate = false) {
    if (!this.audioCtx) return null;
    
    const nodes = [];
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(maxVolume, this.audioCtx.currentTime + 2.0);
    masterGain.connect(this.audioCtx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      // subtle vibrato / movement
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.15, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();
      
      gain.gain.setValueAtTime(1 / frequencies.length, this.audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      
      nodes.push(osc, lfo);
    });

    return {
      pause: () => {
        masterGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
      },
      play: () => {
        masterGain.gain.linearRampToValueAtTime(maxVolume, this.audioCtx.currentTime + 0.5);
      },
      stop: () => {
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
          setTimeout(() => {
            nodes.forEach(n => {
              try { n.stop(); } catch(e){}
            });
          }, 350);
        } catch (e) {}
      }
    };
  }

  stopCurrentMusic() {
    if (this.currentTrack) {
      if (typeof this.currentTrack.stop === 'function') {
        this.currentTrack.stop();
      }
      this.currentTrack = null;
    }
  }

  /**
   * CRITICAL FOR STEP 6: Cuts audio into complete silence
   */
  cutToSilence() {
    this.stopCurrentMusic();
    this.trackName = 'Silence';
    this.notify();
  }
}

export const sound = new SoundService();
