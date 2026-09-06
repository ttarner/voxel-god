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

    // Dreamy bloom pass with wide diffusion radius and pastel-receptive threshold
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(
        Math.max(1, Math.floor(size.width * pixelRatio)),
        Math.max(1, Math.floor(size.height * pixelRatio))
      ),
      0.48, // initial strength
      0.80, // initial radius
      0.66  // initial threshold
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

    // Environmental baseline profiles tuned specifically for pastel colors
    let baseStrength = 0.48;
    let baseRadius = 0.80;
    let baseThreshold = 0.66;

    if (normalized === 'sunrise') {
      // Warm peach & rosy morning haze
      baseStrength = 0.54;
      baseRadius = 0.84;
      baseThreshold = 0.62;
    } else if (normalized === 'twilight') {
      // Dreamy golden-hour & lavender twilight radiance
      baseStrength = 0.58;
      baseRadius = 0.88;
      baseThreshold = 0.60;
    } else if (normalized === 'night') {
      // Ethereal nocturnal moonlight glow
      baseStrength = 0.64;
      baseRadius = 0.92;
      baseThreshold = 0.54;
    } else {
      // Noon / Day: Soft, velvety pastel sunshine glow
      baseStrength = 0.48;
      baseRadius = 0.80;
      baseThreshold = 0.66;
    }

    // Scale strength by user intensity setting (0.75 is the default reference sweet spot)
    const userScale = bloomIntensity / 0.75;
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
