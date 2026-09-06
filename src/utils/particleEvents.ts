// Event bus for 3D voxel particle bursts on block placement and destruction
export interface ParticleBurstEvent {
  type: 'place' | 'destroy';
  position: [number, number, number];
  color: string;
  count?: number;
}

type ParticleListener = (event: ParticleBurstEvent) => void;

class ParticleEventBus {
  private listeners: Set<ParticleListener> = new Set();

  onBurst(cb: ParticleListener) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  emit(event: ParticleBurstEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.warn('Error in particle listener:', err);
      }
    });
  }

  emitPlace(pos: [number, number, number], color: string) {
    this.emit({ type: 'place', position: pos, color, count: 10 });
  }

  emitDestroy(pos: [number, number, number], color: string) {
    this.emit({ type: 'destroy', position: pos, color, count: 14 });
  }
}

export const particleEvents = new ParticleEventBus();
