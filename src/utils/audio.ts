// Procedural Web Audio API sound synthesizer and Ambient Soundscape Manager

class SoundManager {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public ambientEnabled: boolean = true;
  public ambientVolume: number = 0.7; // Default 70%
  public sfxVolume: number = 0.8;     // Default 80%

  // Ambient soundscape audio nodes
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private ambientTimer: ReturnType<typeof setInterval> | null = null;
  private droneOscillators: Array<{ osc: OscillatorNode; gain: GainNode }> = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Ensure AudioContext is running on user gesture
  public resumeContextOnUserGesture() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (this.ambientEnabled && !this.isAmbientPlaying) {
      this.startAmbient();
    }
  }

  /* ==========================================================================
     AMBIENT SOUNDSCAPE ENGINE (Subtle, relaxing, low-volume pastel pad chords)
     ========================================================================== */

  public startAmbient() {
    if (this.isAmbientPlaying || !this.ambientEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      this.isAmbientPlaying = true;

      // Master ambient gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      const targetGain = 0.18 * Math.max(0, Math.min(1, this.ambientVolume));
      masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, targetGain), ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // Filter for warm, cozy atmospheric texture
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      filter.connect(masterGain);

      // Low frequency gentle LFO to modulate filter cutoff slowly
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8 second wave cycle
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Ambient D minor / F major ethereal root notes (D3, F3, A3, C4)
      const baseFrequencies = [146.83, 220.0, 261.63, 349.23];
      this.droneOscillators = [];

      baseFrequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const nodeGain = ctx.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Individual voice gain with subtle detune
        const targetVoiceGain = 0.035 / (index + 1);
        nodeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        nodeGain.gain.linearRampToValueAtTime(targetVoiceGain, ctx.currentTime + 3.0 + index * 0.5);

        osc.connect(nodeGain);
        nodeGain.connect(filter);

        osc.start();
        this.droneOscillators.push({ osc, gain: nodeGain });
      });

      // Periodic ethereal melodic chimes (pentatonic notes entering every ~6-10s)
      const pentatonicTones = [293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      this.ambientTimer = setInterval(() => {
        if (!this.isAmbientPlaying || !this.ambientEnabled) return;
        const currentContext = this.getContext();
        if (!currentContext || currentContext.state !== 'running') return;

        const randomTone = pentatonicTones[Math.floor(Math.random() * pentatonicTones.length)];
        const bellOsc = currentContext.createOscillator();
        const bellGain = currentContext.createGain();

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(randomTone, currentContext.currentTime);

        bellGain.gain.setValueAtTime(0.0001, currentContext.currentTime);
        bellGain.gain.linearRampToValueAtTime(0.035, currentContext.currentTime + 0.6);
        bellGain.gain.exponentialRampToValueAtTime(0.00001, currentContext.currentTime + 4.5);

        bellOsc.connect(bellGain);
        bellGain.connect(masterGain);

        bellOsc.start();
        bellOsc.stop(currentContext.currentTime + 4.8);
      }, 7000);
    } catch (err) {
      console.warn('Could not initialize ambient soundscape:', err);
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbient() {
    if (!this.isAmbientPlaying) return;
    this.isAmbientPlaying = false;

    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }

    if (this.ctx && this.ambientGain) {
      try {
        const currentTime = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, currentTime + 1.2);
        setTimeout(() => {
          this.droneOscillators.forEach(({ osc }) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (_) {}
          });
          this.droneOscillators = [];
          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 1300);
      } catch (_) {
        this.droneOscillators = [];
        this.ambientGain = null;
      }
    } else {
      this.droneOscillators = [];
      this.ambientGain = null;
    }
  }

  public toggleAmbient(): boolean {
    this.ambientEnabled = !this.ambientEnabled;
    if (this.ambientEnabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.ambientEnabled;
  }

  public setAmbientEnabled(enabled: boolean) {
    this.ambientEnabled = enabled;
    if (enabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  public setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientVolume > 0 && !this.ambientEnabled) {
      this.ambientEnabled = true;
    } else if (this.ambientVolume === 0 && this.ambientEnabled) {
      this.stopAmbient();
      return;
    }

    if (this.ctx && this.ambientGain && this.isAmbientPlaying) {
      const targetGain = 0.18 * this.ambientVolume;
      this.ambientGain.gain.setTargetAtTime(Math.max(0.0001, targetGain), this.ctx.currentTime, 0.1);
    } else if (this.ambientVolume > 0 && this.ambientEnabled && !this.isAmbientPlaying) {
      this.startAmbient();
    }
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sfxEnabled = this.sfxVolume > 0;
  }

  /* ==========================================================================
     SOUND EFFECTS (Blocks, tools, buttons, chimes)
     ========================================================================== */

  // Soft wooden / earthen pop when placing a block
  playPlaceBlock(pitch = 1.0) {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Trigger ambient soundscape start if enabled and not already playing
    if (this.ambientEnabled && !this.isAmbientPlaying && this.ambientVolume > 0) {
      this.startAmbient();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 340 * pitch;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.20 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // Refreshing water ripple / splash sound when placing water block
  playWaterSplash(pitch = 1.0) {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.ambientEnabled && !this.isAmbientPlaying && this.ambientVolume > 0) {
      this.startAmbient();
    }

    // High droplet pop
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    const f1 = 520 * pitch;
    osc1.frequency.setValueAtTime(f1, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(f1 * 1.8, ctx.currentTime + 0.06);

    gain1.gain.setValueAtTime(0.20 * this.sfxVolume, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.12);

    // Subtle bubbly secondary resonant drop
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    const f2 = 820 * pitch;
    osc2.frequency.setValueAtTime(f2, ctx.currentTime + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(f2 * 1.4, ctx.currentTime + 0.09);

    gain2.gain.setValueAtTime(0.001, ctx.currentTime);
    gain2.gain.setValueAtTime(0.14 * this.sfxVolume, ctx.currentTime + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.03);
    osc2.stop(ctx.currentTime + 0.14);
  }

  // Soft crunch / crumble pop when destroying a block
  playDestroyBlock() {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.ambientEnabled && !this.isAmbientPlaying && this.ambientVolume > 0) {
      this.startAmbient();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  // Subtle acoustic click when toggling tools or blocks
  playSelect() {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  // Nice chime on preset load or clear
  playChime() {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    [440, 554, 659].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.14 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Celebratory victory fanfare when completing a puzzle challenge
  playVictory() {
    if (!this.sfxEnabled || this.sfxVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, t: 0.0, dur: 0.18, vol: 0.18 }, // C5
      { f: 659.25, t: 0.1, dur: 0.18, vol: 0.18 }, // E5
      { f: 783.99, t: 0.2, dur: 0.22, vol: 0.20 }, // G5
      { f: 1046.5, t: 0.32, dur: 0.45, vol: 0.24 }, // C6
      { f: 1318.51, t: 0.45, dur: 0.55, vol: 0.20 }, // E6
    ];

    notes.forEach(({ f, t, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol * this.sfxVolume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  }
}

export const sounds = new SoundManager();
