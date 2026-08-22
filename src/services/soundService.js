/**
 * SOUND SERVICE - SOUND COMPLETELY DISABLED
 */

class SoundService {
  constructor() {
    this.isMuted = true;
  }

  subscribe(fn) {
    return () => {};
  }

  notify() {}
  toggleMute() { return true; }
  playClick() {}
  playKeypress() {}
  playHover() {}
  playSuccessChime() {}
  playBuzzerFail() {}
  playGlitch() {}
  playVaultUnlock() {}
  playHeartbeat() {}
  playFanfare() {}
  playSuspenseTrack() {}
  playEmotionalTrack() {}
  stopCurrentMusic() {}
  cutToSilence() {}
}

export const sound = new SoundService();
export default sound;
