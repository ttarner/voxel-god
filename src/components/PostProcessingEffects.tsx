import { useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { useWorldStore } from '../store/worldStore';

/**
 * PostProcessingEffects
 * 
 * Provides an ethereal UnrealBloomPass specifically calibrated for the voxel pastel palette:
 * - Lower luminance threshold (0.55 - 0.68) allows the soft pastel voxels and sunlit surfaces
 *   to radiate a gentle, creamy luminescence instead of harsh glaring hotspots.
 * - Expanded blur radius (0.75 - 0.95) creates a velvety, pillowy light dispersion that
 *   softens harsh voxel edges into a dreamy, toy-like fairy-tale aesthetic.
 * - Dynamic calibration shifts harmoniously across Sunrise, Noon, Twilight, and Night.
 * - Reactive to user preferences (toggle and intensity slider) from the Options menu.
 */
export function PostProcessingEffects() {
  const { gl, scene, camera, size } = useThree();
  const timeOfDay = useWorldStore((state) => state.timeOfDay);
  const bloomEnabled = useWorldStore((state) => state.bloomEnabled);
  const bloomIntensity = useWorldStore((state) => state.bloomIntensity);

  const [composer, bloomPass] = useMemo(() => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const renderTarget = new THREE.WebGLRenderTarget(
      Math.max(1, Math.floor(size.width * pixelRatio)),
      Math.max(1, Math.floor(size.height * pixelRatio)),
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        samples: 4,
      }
    );

    const comp = new EffectComposer(gl, renderTarget);
    comp.setPixelRatio(pixelRatio);
    comp.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // Refined bloom pass with clean highlight isolation and crisp pastel rendering
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(
        Math.max(1, Math.floor(size.width * pixelRatio)),
        Math.max(1, Math.floor(size.height * pixelRatio))
      ),
      0.22, // initial strength
      0.35, // initial radius
      0.90  // initial threshold
    );
    comp.addPass(bloom);

    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    return [comp, bloom];
  }, [gl, scene, camera]);

  // Dynamically tune bloom strength, radius, and threshold based on environment & settings
  useEffect(() => {
    if (!bloomPass) return;

    if (!bloomEnabled || bloomIntensity <= 0) {
      bloomPass.strength = 0;
      return;
    }

    const normalized =
      timeOfDay === 'day' ? 'noon' : timeOfDay === 'sunset' ? 'twilight' : timeOfDay;

    // Environmental baseline profiles tuned specifically for crisp pastel aesthetics without washing out
    let baseStrength = 0.20;
    let baseRadius = 0.35;
    let baseThreshold = 0.92;

    if (normalized === 'sunrise') {
      baseStrength = 0.24;
      baseRadius = 0.38;
      baseThreshold = 0.88;
    } else if (normalized === 'twilight') {
      baseStrength = 0.26;
      baseRadius = 0.40;
      baseThreshold = 0.86;
    } else if (normalized === 'night') {
      baseStrength = 0.30;
      baseRadius = 0.42;
      baseThreshold = 0.82;
    } else {
      // Noon / Day: Crisp, clean pastel sunshine without milky haze
      baseStrength = 0.20;
      baseRadius = 0.35;
      baseThreshold = 0.92;
    }

    const userScale = bloomIntensity / 0.5;
    bloomPass.strength = Math.max(0, baseStrength * userScale);
    bloomPass.radius = baseRadius;
    bloomPass.threshold = baseThreshold;
  }, [bloomPass, bloomEnabled, bloomIntensity, timeOfDay]);

  // Keep composer and bloom resolution synced with viewport size and pixel ratio
  useEffect(() => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(size.width, size.height);
    bloomPass.resolution.set(
      Math.max(1, Math.floor(size.width * pixelRatio)),
      Math.max(1, Math.floor(size.height * pixelRatio))
    );
  }, [composer, bloomPass, size.width, size.height]);

  // Clean up render targets and passes on unmount
  useEffect(() => {
    return () => {
      try {
        composer.renderTarget1?.dispose();
        composer.renderTarget2?.dispose();
        bloomPass.dispose();
      } catch {
        // ignore disposal errors
      }
    };
  }, [composer, bloomPass]);

  // Render loop with composer
  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}
