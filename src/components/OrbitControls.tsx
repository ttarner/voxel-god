import { useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface OrbitControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableRotate?: boolean;
  rotateSpeed?: number;
  enablePan?: boolean;
  panSpeed?: number;
  enableZoom?: boolean;
  zoomSpeed?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minDistance?: number;
  maxDistance?: number;
  target?: [number, number, number];
  makeDefault?: boolean;
}

export type OrbitControlsImpl = ThreeOrbitControls;

export const OrbitControls = forwardRef<ThreeOrbitControls, OrbitControlsProps>(function OrbitControls(
  {
    autoRotate = false,
    autoRotateSpeed = 2.0,
    enableRotate = true,
    rotateSpeed = 1.0,
    enablePan = true,
    panSpeed = 1.0,
    enableZoom = true,
    zoomSpeed = 1.0,
    enableDamping = true,
    dampingFactor = 0.05,
    minPolarAngle = 0,
    maxPolarAngle = Math.PI,
    minDistance = 0,
    maxDistance = Infinity,
    target = [0, 0, 0],
  },
  ref
) {
  const { camera, gl, invalidate } = useThree();

  const controls = useMemo(() => {
    return new ThreeOrbitControls(camera, gl.domElement);
  }, [camera, gl.domElement]);

  useImperativeHandle(ref, () => controls, [controls]);

  // Sync controls properties with props
  useEffect(() => {
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableRotate = enableRotate;
    controls.rotateSpeed = rotateSpeed;
    controls.enablePan = enablePan;
    controls.panSpeed = panSpeed;
    controls.enableZoom = enableZoom;
    controls.zoomSpeed = zoomSpeed;
    controls.enableDamping = enableDamping;
    controls.dampingFactor = dampingFactor;
    controls.minPolarAngle = minPolarAngle;
    controls.maxPolarAngle = maxPolarAngle;
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    controls.target.set(target[0], target[1], target[2]);
    controls.update();
  }, [
    controls,
    autoRotate,
    autoRotateSpeed,
    enableRotate,
    rotateSpeed,
    enablePan,
    panSpeed,
    enableZoom,
    zoomSpeed,
    enableDamping,
    dampingFactor,
    minPolarAngle,
    maxPolarAngle,
    minDistance,
    maxDistance,
    target,
  ]);

  // Redraw on interaction and cleanup on unmount
  useEffect(() => {
    const handleChange = () => invalidate();
    controls.addEventListener('change', handleChange);
    return () => {
      controls.removeEventListener('change', handleChange);
      controls.dispose();
    };
  }, [controls, invalidate]);

  // Continuous loop for autoRotate or smooth damping
  useFrame(() => {
    if (controls.enabled && (controls.enableDamping || controls.autoRotate)) {
      controls.update();
    }
  });

  return null;
});
