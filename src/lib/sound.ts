import confetti from 'canvas-confetti';

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Melodic Golden Bell Chime on Habit / Task Completion
  playCompletionChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Dual harmonic frequencies for Mor Pankh royal bell
      const freqs = [587.33, 880.0, 1174.66]; // D5, A5, D6

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.85);
      });
    } catch {
      // Audio not permitted or supported
    }
  }

  // Deep Focus Gong
  playTimerDone() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch {
      // Ignore
    }
  }

  // Soft subtle click for watch / timer tap
  playTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundEffects();

// Mor Pankh & Golden Peacock Feather Confetti Burst
export function triggerMorPankhConfetti(originX = 0.5, originY = 0.6) {
  if (typeof window === 'undefined') return;

  const count = 60;
  const colors = [
    '#f4a313', // Rich Gold
    '#d4af37', // Metallic Gold
    '#147694', // Peacock Teal
    '#17b890', // Emerald Green
    '#3d4cd4', // Royal Blue
    '#3eb0cd', // Cyan Light
  ];

  confetti({
    particleCount: count,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: colors,
    ticks: 200,
    gravity: 1.1,
    scalar: 1.1,
    shapes: ['circle', 'square'],
  });
}
