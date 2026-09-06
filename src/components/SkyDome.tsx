import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay, WeatherType } from '../types';

interface SkyDomeProps {
  timeOfDay: TimeOfDay;
  weather?: WeatherType;
}

// Custom GLSL shader for dynamic multi-stop gradient skybox with celestial glow
const skyVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform vec3 topColor;
  uniform vec3 midColor;
  uniform vec3 horizonColor;
  uniform vec3 bottomColor;
  uniform vec3 sunColor;
  uniform vec3 sunPosition;
  uniform float sunIntensity;
  uniform float sunGlowRadius;
  uniform float starIntensity;
  uniform float time;

  varying vec3 vWorldPosition;
  varying vec3 vPosition;

  // Simple pseudo-random hash for stars
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 dir = normalize(vWorldPosition);
    float h = dir.y;

    // 4-stop smooth pastel vertical gradient
    vec3 skyGrad;
    if (h < 0.0) {
      // Below horizon
      float t = clamp(-h * 2.5, 0.0, 1.0);
      skyGrad = mix(horizonColor, bottomColor, t);
    } else if (h < 0.35) {
      // Horizon to Mid-sky
      float t = clamp(h / 0.35, 0.0, 1.0);
      skyGrad = mix(horizonColor, midColor, smoothstep(0.0, 1.0, t));
    } else {
      // Mid-sky to Zenith
      float t = clamp((h - 0.35) / 0.65, 0.0, 1.0);
      skyGrad = mix(midColor, topColor, pow(t, 0.85));
    }

    // Celestial Sun / Moon glow computation
    vec3 sDir = normalize(sunPosition);
    float cosTheta = dot(dir, sDir);
    
    // Core celestial disk
    float disk = smoothstep(0.9975, 0.9995, cosTheta);
    // Soft atmospheric corona glow
    float corona = pow(max(0.0, cosTheta), sunGlowRadius);

    vec3 celestialContribution = sunColor * (disk * 1.6 + corona * sunIntensity);

    // Night stars (only in upper hemisphere and when starIntensity > 0)
    float stars = 0.0;
    if (starIntensity > 0.01 && h > 0.1) {
      vec3 starDir = floor(dir * 160.0) / 160.0;
      float starRnd = hash(starDir * 23.456);
      if (starRnd > 0.985) {
        float twinkle = sin(time * 2.5 + starRnd * 60.0) * 0.5 + 0.5;
        float fade = smoothstep(0.1, 0.35, h);
        stars = pow(starRnd, 8.0) * 8.0 * (0.6 + 0.4 * twinkle) * fade * starIntensity;
      }
    }

    vec3 finalColor = skyGrad + celestialContribution + vec3(stars);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Minimalist low-poly floating voxel cloud cluster
interface VoxelCloudProps {
  initialPosition: [number, number, number];
  scale: number;
  speed: number;
  timeOfDay: TimeOfDay;
  weather?: WeatherType;
}

function VoxelCloud({ initialPosition, scale, speed, timeOfDay, weather = 'none' }: VoxelCloudProps) {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(initialPosition[0]);

  const cloudColor = useMemo(() => {
    if (weather === 'rain') {
      return timeOfDay === 'night' ? '#1e2433' : '#889bb0'; // Overcast rain slate
    }
    if (weather === 'snow') {
      return timeOfDay === 'night' ? '#242c3d' : '#cbd5e1'; // Soft snow cloud
    }
    const normalized =
      timeOfDay === 'day' ? 'noon' : timeOfDay === 'sunset' ? 'twilight' : timeOfDay;

    switch (normalized) {
      case 'sunrise':
        return '#fed7aa'; // Warm golden peach
      case 'twilight':
        return '#fda4af'; // Soft coral rose
      case 'night':
        return '#272d47'; // Soft midnight silhouette
      case 'noon':
      default:
        return '#ffffff'; // Pristine marshmallow white
    }
  }, [timeOfDay, weather]);

  // Generate a clustered voxel shape
  const cloudVoxels = useMemo(() => {
    return [
      [0, 0, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [2, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 1],
      [1, 0, 1],
      [-1, 0, 1],
      [0, 0, -1],
      [1, 0, -1],
    ] as Array<[number, number, number]>;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    posRef.current += speed * delta;
    // Wrap around boundaries
    if (posRef.current > 42) {
      posRef.current = -42;
    }
    groupRef.current.position.x = posRef.current;
  });

  return (
    <group
      ref={groupRef}
      position={[initialPosition[0], initialPosition[1], initialPosition[2]]}
      scale={[scale, scale * 0.75, scale]}
    >
      {cloudVoxels.map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <boxGeometry args={[1.02, 1.02, 1.02]} />
          <meshBasicMaterial
            color={cloudColor}
            transparent
            opacity={timeOfDay === 'night' ? 0.45 : weather !== 'none' ? 0.88 : 0.75}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SkyDome({ timeOfDay, weather = 'none' }: SkyDomeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => {
    return {
      topColor: { value: new THREE.Color('#9ec5f8') },
      midColor: { value: new THREE.Color('#dbeafe') },
      horizonColor: { value: new THREE.Color('#f0f5fc') },
      bottomColor: { value: new THREE.Color('#cbd5e1') },
      sunColor: { value: new THREE.Color('#fff9db') },
      sunPosition: { value: new THREE.Vector3(14, 22, 12) },
      sunIntensity: { value: 0.3 },
      sunGlowRadius: { value: 4.5 },
      starIntensity: { value: 0.0 },
      time: { value: 0 },
    };
  }, []);

  // Defined harmonious minimalist pastel palettes
  const colorPalettes = useMemo(() => {
    const palettes = {
      sunrise: {
        top: new THREE.Color('#93c5fd'),      // Soft morning azure
        mid: new THREE.Color('#fed7aa'),      // Apricot dawn
        horizon: new THREE.Color('#fecdd3'),  // Rose-tinted morning haze
        bottom: new THREE.Color('#fbbf24'),   // Warm golden horizon ground
        sunColor: new THREE.Color('#fbbf24'), // Golden morning sun
        sunPos: new THREE.Vector3(22, 9, 14),
        sunIntensity: 0.5,
        sunGlowRadius: 3.5,
        starIntensity: 0.02,
      },
      noon: {
        top: new THREE.Color('#a4c8fa'),      // Soft pastel azure
        mid: new THREE.Color('#dceafd'),      // Airy celestial blue
        horizon: new THREE.Color('#f1f6fd'),  // Warm pearl mist
        bottom: new THREE.Color('#cbd5e1'),   // Ground blend
        sunColor: new THREE.Color('#fffbeb'), // Warm radiant sunlight
        sunPos: new THREE.Vector3(12, 26, 10),
        sunIntensity: 0.35,
        sunGlowRadius: 4.0,
        starIntensity: 0.0,
      },
      twilight: {
        top: new THREE.Color('#a78bfa'),      // Soft twilight lilac
        mid: new THREE.Color('#fb923c'),      // Apricot coral
        horizon: new THREE.Color('#fed7aa'),  // Golden glow haze
        bottom: new THREE.Color('#ea580c'),   // Deep dusk ground
        sunColor: new THREE.Color('#fef08a'), // Glowing golden sun
        sunPos: new THREE.Vector3(20, 8, 16),
        sunIntensity: 0.55,
        sunGlowRadius: 3.2,
        starIntensity: 0.15,
      },
      night: {
        top: new THREE.Color('#090d16'),      // Midnight obsidian
        mid: new THREE.Color('#161a33'),      // Deep indigo
        horizon: new THREE.Color('#252849'),  // Periwinkle horizon haze
        bottom: new THREE.Color('#0f172a'),   // Deep night ground
        sunColor: new THREE.Color('#dbeafe'), // Soft silvery moon aura
        sunPos: new THREE.Vector3(10, 20, 10),
        sunIntensity: 0.4,
        sunGlowRadius: 5.5,
        starIntensity: 1.0,
      },
      // Weather overcast modifiers
      rainDay: {
        top: new THREE.Color('#5c708a'),      // Moody stormy slate
        mid: new THREE.Color('#7a8da3'),      // Overcast cool gray
        horizon: new THREE.Color('#9bb0c7'),  // Misted horizon
        bottom: new THREE.Color('#475569'),   // Wet ground
        sunColor: new THREE.Color('#cbd5e1'), // Diffused sun
        sunPos: new THREE.Vector3(14, 22, 12),
        sunIntensity: 0.12,
        sunGlowRadius: 5.0,
        starIntensity: 0.0,
      },
      snowDay: {
        top: new THREE.Color('#71869e'),      // Crisp winter slate
        mid: new THREE.Color('#9cb0c7'),      // Cool icy overcast
        horizon: new THREE.Color('#c6d6e6'),  // Frosted horizon
        bottom: new THREE.Color('#64748b'),   // Cool ground
        sunColor: new THREE.Color('#f1f5f9'), // Diffuse winter sun
        sunPos: new THREE.Vector3(14, 22, 12),
        sunIntensity: 0.18,
        sunGlowRadius: 4.8,
        starIntensity: 0.0,
      },
    };

    return {
      ...palettes,
      day: palettes.noon,
      sunset: palettes.twilight,
    };
  }, []);

  // Pre-configured atmospheric cloud positions
  const clouds = useMemo(() => {
    return [
      { pos: [-24, 14, -22] as [number, number, number], scale: 1.5, speed: 0.45 },
      { pos: [12, 18, -28] as [number, number, number], scale: 1.8, speed: 0.35 },
      { pos: [-16, 12, 24] as [number, number, number], scale: 1.4, speed: 0.4 },
      { pos: [26, 16, 18] as [number, number, number], scale: 1.6, speed: 0.38 },
      { pos: [4, 20, 26] as [number, number, number], scale: 1.3, speed: 0.5 },
    ];
  }, []);

  useFrame((state, delta) => {
    if (!uniforms) return;
    let target = colorPalettes[timeOfDay];

    if (weather === 'rain') {
      if (timeOfDay === 'night') {
        target = {
          ...colorPalettes.night,
          top: new THREE.Color('#06080e'),
          mid: new THREE.Color('#0e1220'),
          horizon: new THREE.Color('#181d30'),
          sunIntensity: 0.15,
          starIntensity: 0.25,
        };
      } else {
        target = colorPalettes.rainDay;
      }
    } else if (weather === 'snow') {
      if (timeOfDay === 'night') {
        target = {
          ...colorPalettes.night,
          top: new THREE.Color('#080c14'),
          mid: new THREE.Color('#141b2a'),
          horizon: new THREE.Color('#222a3d'),
          sunIntensity: 0.2,
          starIntensity: 0.35,
        };
      } else {
        target = colorPalettes.snowDay;
      }
    }

    const lerpSpeed = Math.min(delta * 4.0, 1.0);

    uniforms.topColor.value.lerp(target.top, lerpSpeed);
    uniforms.midColor.value.lerp(target.mid, lerpSpeed);
    uniforms.horizonColor.value.lerp(target.horizon, lerpSpeed);
    uniforms.bottomColor.value.lerp(target.bottom, lerpSpeed);
    uniforms.sunColor.value.lerp(target.sunColor, lerpSpeed);
    uniforms.sunPosition.value.lerp(target.sunPos, lerpSpeed);

    uniforms.sunIntensity.value = THREE.MathUtils.lerp(
      uniforms.sunIntensity.value,
      target.sunIntensity,
      lerpSpeed
    );
    uniforms.sunGlowRadius.value = THREE.MathUtils.lerp(
      uniforms.sunGlowRadius.value,
      target.sunGlowRadius,
      lerpSpeed
    );
    uniforms.starIntensity.value = THREE.MathUtils.lerp(
      uniforms.starIntensity.value,
      target.starIntensity,
      lerpSpeed
    );

    uniforms.time.value = state.clock.getElapsedTime();
  });

  return (
    <group name="dynamic-skybox-group">
      {/* Outer Skybox Dome */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[92, 48, 36]} />
        <shaderMaterial
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          uniforms={uniforms}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Low-Poly Voxel Clouds for Ambient Parallax Depth */}
      {clouds.map((c, i) => (
        <VoxelCloud
          key={`cloud-${i}`}
          initialPosition={c.pos}
          scale={c.scale}
          speed={c.speed}
          timeOfDay={timeOfDay}
          weather={weather}
        />
      ))}
    </group>
  );
}
