/**
 * AUDIO MANAGER - SOUND COMPLETELY DISABLED
 * All sound playback and Web Audio synthesizers are silenced.
 */

class AudioManager {
  constructor() {
    this.isMuted = true;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn({ isMuted: true, loopName: 'none' }));
  }

  toggleMute() {
    return true;
  }

  playLoop(_name) {}
  stopAll(_fadeMs = 0) {}
  playSfx(_name) {}
}

const audioManager = new AudioManager();

export const playLoop = (name) => audioManager.playLoop(name);
export const stopAll = (fadeMs = 0) => audioManager.stopAll(fadeMs);
export const playSfx = (name) => audioManager.playSfx(name);
export const toggleMute = () => audioManager.toggleMute();
export const subscribeAudio = (fn) => audioManager.subscribe(fn);
export default audioManager;
