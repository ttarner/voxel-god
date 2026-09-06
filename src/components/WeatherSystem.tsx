import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WeatherType } from '../types';

interface WeatherSystemProps {
  weather: WeatherType;
}

const RAIN_COUNT = 380;
const SNOW_COUNT = 320;
const BOUNDS_XZ = 42;
const TOP_Y = 32;
const BOTTOM_Y = -1;

export function WeatherSystem({ weather }: WeatherSystemProps) {
  const rainMeshRef = useRef<THREE.InstancedMesh>(null);
  const snowMeshRef = useRef<THREE.InstancedMesh>(null);
  
  // Transition factor for smooth fade-in / fade-out
  const transitionRef = useRef({
    rainAlpha: 0,
    snowAlpha: 0,
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate static rain particle properties
  const rainParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < RAIN_COUNT; i++) {
      list.push({
        x: (Math.random() - 0.5) * BOUNDS_XZ,
        y: Math.random() * (TOP_Y - BOTTOM_Y) + BOTTOM_Y,
        z: (Math.random() - 0.5) * BOUNDS_XZ,
        speed: 22 + Math.random() * 12,
        windX: -1.2 + (Math.random() - 0.5) * 0.6,
        windZ: 0.8 + (Math.random() - 0.5) * 0.4,
        scale: 0.85 + Math.random() * 0.35,
      });
    }
    return list;
  }, []);

  // Pre-generate static snow particle properties
  const snowParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < SNOW_COUNT; i++) {
      list.push({
        x: (Math.random() - 0.5) * BOUNDS_XZ,
        y: Math.random() * (TOP_Y - BOTTOM_Y) + BOTTOM_Y,
        z: (Math.random() - 0.5) * BOUNDS_XZ,
        fallSpeed: 2.4 + Math.random() * 2.0,
        swaySpeed: 1.2 + Math.random() * 1.8,
        swayRadius: 0.4 + Math.random() * 0.8,
        swayPhase: Math.random() * Math.PI * 2,
        rotSpeed: 0.8 + Math.random() * 1.5,
        scale: 0.75 + Math.random() * 0.55,
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.1);

    // Target opacities based on active weather
    const targetRainAlpha = weather === 'rain' ? 1.0 : 0.0;
    const targetSnowAlpha = weather === 'snow' ? 1.0 : 0.0;

    // Smooth lerping for weather transition
    transitionRef.current.rainAlpha = THREE.MathUtils.lerp(
      transitionRef.current.rainAlpha,
      targetRainAlpha,
      clampedDelta * 3.5
    );
    transitionRef.current.snowAlpha = THREE.MathUtils.lerp(
      transitionRef.current.snowAlpha,
      targetSnowAlpha,
      clampedDelta * 3.5
    );

    const rainAlpha = transitionRef.current.rainAlpha;
    const snowAlpha = transitionRef.current.snowAlpha;

    // 1. Update Rain Particles
    if (rainMeshRef.current && (weather === 'rain' || rainAlpha > 0.01)) {
      rainMeshRef.current.visible = true;
      const mat = rainMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.65 * rainAlpha;

      for (let i = 0; i < RAIN_COUNT; i++) {
        const p = rainParticles[i];
        p.y -= p.speed * clampedDelta;
        p.x += p.windX * clampedDelta;
        p.z += p.windZ * clampedDelta;

        // Wrap around loop
        if (p.y < BOTTOM_Y) {
          p.y = TOP_Y + Math.random() * 4;
          p.x = (Math.random() - 0.5) * BOUNDS_XZ;
          p.z = (Math.random() - 0.5) * BOUNDS_XZ;
        }

        dummy.position.set(p.x, p.y, p.z);
        // Slanted angle along wind vector for realistic aerodynamic rainfall
        dummy.rotation.set(0.12, 0, -0.16);
        dummy.scale.set(p.scale * 0.9, p.scale * 1.6, p.scale * 0.9);
        dummy.updateMatrix();
        rainMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      rainMeshRef.current.instanceMatrix.needsUpdate = true;
    } else if (rainMeshRef.current) {
      rainMeshRef.current.visible = false;
    }

    // 2. Update Snow Particles
    if (snowMeshRef.current && (weather === 'snow' || snowAlpha > 0.01)) {
      snowMeshRef.current.visible = true;
      const mat = snowMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.9 * snowAlpha;

      for (let i = 0; i < SNOW_COUNT; i++) {
        const p = snowParticles[i];
        p.y -= p.fallSpeed * clampedDelta;

        const currentX = p.x + Math.sin(time * p.swaySpeed + p.swayPhase) * p.swayRadius;
        const currentZ = p.z + Math.cos(time * p.swaySpeed * 0.8 + p.swayPhase) * (p.swayRadius * 0.8);

        // Wrap around loop
        if (p.y < BOTTOM_Y) {
          p.y = TOP_Y + Math.random() * 3;
          p.x = (Math.random() - 0.5) * BOUNDS_XZ;
          p.z = (Math.random() - 0.5) * BOUNDS_XZ;
        }

        dummy.position.set(currentX, p.y, currentZ);
        dummy.rotation.set(time * p.rotSpeed, time * p.rotSpeed * 0.6, time * p.rotSpeed * 0.4);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        snowMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      snowMeshRef.current.instanceMatrix.needsUpdate = true;
    } else if (snowMeshRef.current) {
      snowMeshRef.current.visible = false;
    }
  });

  return (
    <group name="weather-system-particles">
      {/* Instanced Rain Streaks */}
      <instancedMesh
        ref={rainMeshRef}
        args={[undefined, undefined, RAIN_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.045, 0.65, 0.045]} />
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Instanced Snow Cubes */}
      <instancedMesh
        ref={snowMeshRef}
        args={[undefined, undefined, SNOW_COUNT]}
        frustumCulled={false}
      >
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshBasicMaterial
          color="#f8fafc"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
