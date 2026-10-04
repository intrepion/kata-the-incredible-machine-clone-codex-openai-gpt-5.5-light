type SoundName = "click" | "start" | "collision" | "success" | "failure";

const frequencies: Record<SoundName, number> = {
  click: 420,
  start: 620,
  collision: 260,
  success: 880,
  failure: 160,
};

export class AudioSynth {
  private context: AudioContext | null = null;

  play(sound: SoundName): void {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    const context = this.getContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.frequency.value = frequencies[sound];
    oscillator.type = sound === "collision" ? "square" : "sine";
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  }

  private getContext(): AudioContext {
    this.context ??= new AudioContext();
    return this.context;
  }
}
