import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleEvents, ParticleBurstEvent } from '../utils/particleEvents';

const MAX_PARTICLES = 750;

interface Particle {
  active: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  baseScale: number;
  scale: number;
  color: THREE.Color;
  age: number;
  maxAge: number;
  gravity: number;
  drag: number;
}

export function ParticleSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-allocate particle pool
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: MAX_PARTICLES }, () => ({
      active: false,
      pos: new THREE.Vector3(0, -999, 0),
      vel: new THREE.Vector3(),
      rot: new THREE.Euler(),
      rotVel: new THREE.Vector3(),
      baseScale: 0.15,
      scale: 0,
      color: new THREE.Color('#ffffff'),
      age: 0,
      maxAge: 0.5,
      gravity: 9.8,
      drag: 0.96,
    }));
  }, []);

  const nextParticleIndexRef = useRef(0);

  const spawnBurst = (event: ParticleBurstEvent) => {
    const { type, position, color, count = 12 } = event;
    const [cx, cy, cz] = position;
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      const idx = nextParticleIndexRef.current;
      nextParticleIndexRef.current = (nextParticleIndexRef.current + 1) % MAX_PARTICLES;
      const p = particles[idx];

      p.active = true;
      p.age = 0;

      // Small jitter around block volume
      p.pos.set(
        cx + (Math.random() - 0.5) * 0.7,
        cy + (Math.random() - 0.5) * 0.7,
        cz + (Math.random() - 0.5) * 0.7
      );

      p.rot.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      p.rotVel.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      if (type === 'place') {
        // Upward energetic sparkle burst
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.6 + Math.random() * 2.4;
        const upBias = 2.0 + Math.random() * 2.6;

        p.vel.set(
          Math.cos(angle) * speed,
          upBias,
          Math.sin(angle) * speed
        );
        p.gravity = 6.5;
        p.drag = 0.94;
        p.baseScale = 0.11 + Math.random() * 0.08;
        p.scale = p.baseScale;
        p.maxAge = 0.38 + Math.random() * 0.22;

        // Subtle color variance (block color or sparkling pastel highlight)
        if (Math.random() > 0.4) {
          p.color.copy(baseColor).offsetHSL(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.1,
            0.15 + Math.random() * 0.15
          );
        } else {
          p.color.set('#ffffff');
        }
      } else {
        // Destroy / crumble explosion in all directions with gravity
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = 2.5 + Math.random() * 3.8;

        p.vel.set(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.abs(Math.sin(phi) * Math.sin(theta)) * speed * 0.8 + 1.2,
          Math.cos(phi) * speed
        );
        p.gravity = 11.5;
        p.drag = 0.97;
        p.baseScale = 0.14 + Math.random() * 0.11;
        p.scale = p.baseScale;
        p.maxAge = 0.5 + Math.random() * 0.35;

        // Crumble shades with subtle dark/light clay variations
        p.color.copy(baseColor).offsetHSL(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.16
        );
      }
    }
  };

  useEffect(() => {
    const unsub = particleEvents.onBurst(spawnBurst);
    return () => unsub();
  }, [particles]);

  // Initial dummy placement
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      dummy.position.set(0, -999, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, new THREE.Color('#ffffff'));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const dt = Math.min(delta, 0.08); // cap frame delta
    let hasActive = false;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particles[i];
      if (!p.active) continue;

      hasActive = true;
      p.age += dt;

      if (p.age >= p.maxAge) {
        p.active = false;
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Physics update
      p.vel.y -= p.gravity * dt;
      p.vel.x *= p.drag;
      p.vel.z *= p.drag;

      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
      p.pos.z += p.vel.z * dt;

      // Floor bounce clamp at y = -0.5
      if (p.pos.y < -0.45) {
        p.pos.y = -0.45;
        p.vel.y = -p.vel.y * 0.35;
        p.vel.x *= 0.7;
        p.vel.z *= 0.7;
      }

      // Rotation update
      p.rot.x += p.rotVel.x * dt;
      p.rot.y += p.rotVel.y * dt;
      p.rot.z += p.rotVel.z * dt;

      // Smooth cubic shrink out towards end of life
      const progress = p.age / p.maxAge;
      const scaleFactor = Math.max(0, 1 - progress * progress);
      p.scale = p.baseScale * scaleFactor;

      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, p.color);
    }

    if (hasActive) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_PARTICLES]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial toneMapped={false} />
    </instancedMesh>
  );
}
