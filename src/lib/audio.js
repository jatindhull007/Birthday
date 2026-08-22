import { Howl } from 'howler';

/**
 * AUDIO MANAGER FOR OPERATION [NAME]
 * Wraps Howler audio playback with procedural Web Audio synthesis fallback.
 * 
 * PLACEHOLDER PATHS:
 * Drop real MP3 files in public/audio/ to override procedural synthesis:
 * - public/audio/loop-playful.mp3 (used in Steps 0-4)
 * - public/audio/loop-emotional.mp3 (used in Steps 5-6 after reveal)
 * - public/audio/sfx-digit.mp3
 * - public/audio/sfx-chime.mp3
 * - public/audio/sfx-buzzer.mp3
 * - public/audio/sfx-vault-unlock.mp3
 * - public/audio/sfx-confetti-whoosh.mp3
 * - public/audio/sfx-transition.mp3
 */

class AudioManager {
  constructor() {
    this.isMuted = false;
    this.currentLoop = null;
    this.loopName = 'none';
    this.audioCtx = null;
    this.listeners = new Set();
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext && !this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {}
  }

  ensureContext() {
    if (!this.audioCtx) this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn({ isMuted: this.isMuted, loopName: this.loopName }));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentLoop) {
      if (this.isMuted) {
        this.currentLoop.pause();
      } else {
        this.currentLoop.play();
      }
    }
    this.notify();
    return this.isMuted;
  }

  playLoop(name) {
    if (this.loopName === name && this.currentLoop) return;
    this.stopAll(0);
    this.loopName = name;
    this.notify();

    if (this.isMuted) return;
    this.ensureContext();

    if (name === 'playful') {
      this.currentLoop = this.createProceduralDrone([220, 329.63, 440], 'sine', 0.03);
    } else if (name === 'emotional') {
      this.currentLoop = this.createProceduralDrone([261.63, 329.63, 392.0, 523.25], 'triangle', 0.05);
    }
  }

  stopAll(fadeMs = 0) {
    if (this.currentLoop) {
      if (typeof this.currentLoop.stop === 'function') {
        this.currentLoop.stop(fadeMs);
      }
      this.currentLoop = null;
    }
    this.loopName = 'none';
    this.notify();
  }

  playSfx(name) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;

      if (name === 'sfx-digit' || name === 'digit') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.06);
      } else if (name === 'sfx-chime' || name === 'chime') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.45);
        });
      } else if (name === 'sfx-buzzer' || name === 'buzzer') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.3);
      } else if (name === 'sfx-vault-unlock' || name === 'vault-unlock') {
        for (let i = 0; i < 3; i++) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const t = now + i * 0.08;
          osc.type = 'square';
          osc.frequency.setValueAtTime(300 + i * 80, t);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
        }
      } else if (name === 'sfx-confetti-whoosh' || name === 'whoosh') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.2);
      } else if (name === 'sfx-transition' || name === 'transition') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(now + 0.12);
      }
    } catch (e) {}
  }

  createProceduralDrone(frequencies, type = 'sine', maxVol = 0.04) {
    if (!this.audioCtx) return null;
    const nodes = [];
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(maxVol, this.audioCtx.currentTime + 1.5);
    masterGain.connect(this.audioCtx.destination);

    frequencies.forEach((f, idx) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
      osc.connect(masterGain);
      osc.start();
      nodes.push(osc);
    });

    return {
      pause: () => {
        masterGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);
      },
      play: () => {
        masterGain.gain.linearRampToValueAtTime(maxVol, this.audioCtx.currentTime + 0.4);
      },
      stop: (fadeMs = 0) => {
        try {
          const fadeSec = (fadeMs || 200) / 1000;
          masterGain.gain.linearRampToValueAtTime(0.00001, this.audioCtx.currentTime + fadeSec);
          setTimeout(() => {
            nodes.forEach(n => { try { n.stop(); } catch(e){} });
          }, fadeMs + 50);
        } catch (e) {}
      }
    };
  }
}

const audioManager = new AudioManager();

export const playLoop = (name) => audioManager.playLoop(name);
export const stopAll = (fadeMs = 0) => audioManager.stopAll(fadeMs);
export const playSfx = (name) => audioManager.playSfx(name);
export const toggleMute = () => audioManager.toggleMute();
export const subscribeAudio = (fn) => audioManager.subscribe(fn);
export default audioManager;
