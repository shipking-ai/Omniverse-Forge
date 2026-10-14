// Original procedural audio. No samples, external files, autoplay, or remote services.
export class AudioEngine {
  constructor() {
    this.context = null;
    this.settings = { sound: true, volume: 0.35 };
    this.last = 0;
  }
  unlock() {
    try {
      if (!this.context) this.context = new AudioContext();
      if (this.context.state === "suspended")
        this.context.resume().catch(() => {});
    } catch {
      /* Audio unavailable: the game remains silent and playable. */
    }
  }
  tone(kind = "tap") {
    if (
      !this.settings.sound ||
      !this.context ||
      this.context.state !== "running"
    )
      return;
    const now = this.context.currentTime;
    if (kind === "shot" && now - this.last < 0.11) return;
    this.last = now;
    const osc = this.context.createOscillator(),
      gain = this.context.createGain();
    const notes = {
      tap: [420, 620, 0.08],
      shot: [230, 65, 0.12],
      collect: [540, 1080, 0.25],
      win: [392, 784, 0.6],
      lose: [180, 70, 0.6],
    };
    const [a, b, duration] = notes[kind] || notes.tap;
    osc.type = kind === "shot" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(a, now);
    osc.frequency.exponentialRampToValueAtTime(b, now + duration);
    gain.gain.setValueAtTime(this.settings.volume * 0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }
}
