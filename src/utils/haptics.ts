// Tactile Web Vibration & Haptic Feedback Manager

const HAPTICS_STORAGE_KEY = 'voxel_haptics_enabled_v1';

export type HapticType =
  | 'light'
  | 'selection'
  | 'place'
  | 'destroy'
  | 'brushPulse'
  | 'medium'
  | 'undoRedo'
  | 'preset'
  | 'victory'
  | 'snapshot'
  | 'error';

class HapticsManager {
  public enabled: boolean = true;
  private lastVibrationTime: number = 0;
  private minIntervalMs: number = 40; // Throttle interval for rapid continuous drag

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(HAPTICS_STORAGE_KEY);
      if (saved !== null) {
        this.enabled = JSON.parse(saved);
      }
    } catch {
      this.enabled = true;
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      localStorage.setItem(HAPTICS_STORAGE_KEY, JSON.stringify(enabled));
    } catch {
      // Ignore storage errors
    }
    if (enabled) {
      this.light();
    }
  }

  public toggle(): boolean {
    const next = !this.enabled;
    this.setEnabled(next);
    return next;
  }

  private trigger(pattern: number | number[], force = false) {
    if (!this.enabled && !force) return;
    if (!this.isSupported()) return;

    const now = Date.now();
    // Prevent stacking continuous high-frequency vibrations
    if (!force && Array.isArray(pattern) === false && pattern <= 15) {
      if (now - this.lastVibrationTime < this.minIntervalMs) {
        return;
      }
    }

    try {
      this.lastVibrationTime = now;
      navigator.vibrate(pattern);
    } catch {
      // In some embedded iframes or restricted sandboxes vibrate may throw silently
    }
  }

  // Light subtle tap for tool / block / button selections
  public light() {
    this.trigger(10);
  }

  public selection() {
    this.trigger(12);
  }

  // Crisp tactile pop when placing a block
  public place() {
    this.trigger(16);
  }

  // Crumbly vibration pulse when destroying a block
  public destroy() {
    this.trigger([16, 28, 20]);
  }

  // Rapid soft tick for continuous painting
  public brushPulse() {
    this.trigger(8);
  }

  // Medium solid pulse for mode changes or drag activation
  public medium() {
    this.trigger(22);
  }

  // Springy double-tap for undo and redo
  public undoRedo() {
    this.trigger([10, 22, 12]);
  }

  // Pleasant melodic tactile pattern for loading presets and themes
  public preset() {
    this.trigger([14, 25, 18, 30, 22]);
  }

  // Triumphant multi-pulse fanfare for challenge victory
  public victory() {
    this.trigger([30, 40, 30, 40, 55, 45, 80]);
  }

  // Camera shutter click feel for photo snapshots
  public snapshot() {
    this.trigger([20, 35, 45]);
  }

  // Soft warning / constraint bump
  public warning() {
    this.trigger([35, 50, 35]);
  }
}

export const haptics = new HapticsManager();
