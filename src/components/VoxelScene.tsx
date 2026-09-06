import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, type OrbitControlsImpl } from './OrbitControls';
import * as THREE from 'three';
import { VoxelMesh } from './VoxelMesh';
import { ChallengeGhostMesh } from './ChallengeGhostMesh';
import { GroundPlane } from './GroundPlane';
import { PlacementCursor } from './PlacementCursor';
import { PostProcessingEffects } from './PostProcessingEffects';
import { SkyDome } from './SkyDome';
import { ParticleSystem } from './ParticleSystem';
import { WeatherSystem } from './WeatherSystem';
import { SymmetryGuide } from './SymmetryGuide';
import { useWorldStore } from '../store/worldStore';
import { TimeOfDay, WeatherType } from '../types';
import { getBrushCoordinates } from '../utils/brushUtils';
import { getSymmetryCoordinates } from '../utils/symmetryUtils';
import { cameraEvents } from '../utils/cameraEvents';

interface LightingProps {
  timeOfDay: TimeOfDay;
  weather: WeatherType;
}

function LightingAndEnvironment({ timeOfDay, weather }: LightingProps) {
  const normalizedTime: 'sunrise' | 'noon' | 'twilight' | 'night' =
    timeOfDay === 'day'
      ? 'noon'
      : timeOfDay === 'sunset'
      ? 'twilight'
      : timeOfDay === 'sunrise' || timeOfDay === 'noon' || timeOfDay === 'twilight' || timeOfDay === 'night'
      ? timeOfDay
      : 'noon';

  const baseSettings = {
    sunrise: {
      bg: '#fecdd3',
      ambient: '#ffedd5',
      ambientIntensity: 0.85,
      dirLight: '#fbbf24',
      dirIntensity: 1.25,
      dirPos: [22, 9, 14] as [number, number, number],
      hemiSky: '#fed7aa',
      hemiGround: '#fecdd3',
    },
    noon: {
      bg: '#e2eaf5',
      ambient: '#ffffff',
      ambientIntensity: 0.75,
      dirLight: '#fffbeb',
      dirIntensity: 1.05,
      dirPos: [12, 26, 10] as [number, number, number],
      hemiSky: '#dbeafe',
      hemiGround: '#cbd5e1',
    },
    twilight: {
      bg: '#fed7aa',
      ambient: '#ffedd5',
      ambientIntensity: 0.75,
      dirLight: '#f97316',
      dirIntensity: 1.3,
      dirPos: [20, 8, 16] as [number, number, number],
      hemiSky: '#fed7aa',
      hemiGround: '#fdba74',
    },
    night: {
      bg: '#252849',
      ambient: '#6366f1',
      ambientIntensity: 0.45,
      dirLight: '#a5b4fc',
      dirIntensity: 0.75,
      dirPos: [10, 20, 10] as [number, number, number],
      hemiSky: '#1e1b4b',
      hemiGround: '#0f172a',
    },
  }[normalizedTime];

  // Weather modifiers: darken and soften lighting
  const settings = { ...baseSettings };
  let fogNear = 70;
  let fogFar = 180;

  if (weather === 'rain') {
    if (timeOfDay === 'night') {
      settings.bg = '#141824';
      settings.ambient = '#334155';
      settings.ambientIntensity = 0.35;
      settings.dirIntensity = 0.4;
      fogNear = 50;
      fogFar = 120;
    } else {
      settings.bg = '#8fa1b8';
      settings.ambient = '#94a3b8';
      settings.ambientIntensity = 0.6;
      settings.dirLight = '#cbd5e1';
      settings.dirIntensity = 0.65;
      settings.hemiSky = '#64748b';
      settings.hemiGround = '#475569';
      fogNear = 55;
      fogFar = 130;
    }
  } else if (weather === 'snow') {
    if (timeOfDay === 'night') {
      settings.bg = '#1a2233';
      settings.ambient = '#475569';
      settings.ambientIntensity = 0.38;
      settings.dirIntensity = 0.45;
      fogNear = 55;
      fogFar = 130;
    } else {
      settings.bg = '#b4c6db';
      settings.ambient = '#cbd5e1';
      settings.ambientIntensity = 0.7;
      settings.dirLight = '#e2e8f0';
      settings.dirIntensity = 0.75;
      settings.hemiSky = '#94a3b8';
      settings.hemiGround = '#64748b';
      fogNear = 60;
      fogFar = 140;
    }
  }

  return (
    <>
      <color attach="background" args={[settings.bg]} />
      <fog attach="fog" args={[settings.bg, fogNear, fogFar]} />

      <ambientLight color={settings.ambient} intensity={settings.ambientIntensity} />
      <hemisphereLight
        args={[settings.hemiSky, settings.hemiGround, 0.45]}
        position={[0, 25, 0]}
      />

      <directionalLight
        position={settings.dirPos}
        intensity={settings.dirIntensity}
        color={settings.dirLight}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />

      <directionalLight
        position={[-12, 10, -12]}
        intensity={weather === 'rain' ? 0.2 : weather === 'snow' ? 0.25 : 0.35}
        color={settings.ambient}
      />
    </>
  );
}

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Smooth camera centering animation on reset
  useFrame(() => {
    if (targetPosRef.current && controlsRef.current) {
      camera.position.lerp(targetPosRef.current, 0.12);
      if (targetLookAtRef.current) {
        controlsRef.current.target.lerp(targetLookAtRef.current, 0.12);
      }
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPosRef.current) < 0.05) {
        camera.position.copy(targetPosRef.current);
        if (targetLookAtRef.current) {
          controlsRef.current.target.copy(targetLookAtRef.current);
        }
        targetPosRef.current = null;
        targetLookAtRef.current = null;
      }
    }
  });

  useEffect(() => {
    const unsubZoom = cameraEvents.onZoom((deltaRatio) => {
      if (!controlsRef.current) return;
      const controls = controlsRef.current;
      const cam = camera;
      const target = controls.target || new THREE.Vector3(0, 1.2, 0);

      const offset = new THREE.Vector3().subVectors(cam.position, target);
      const currentDist = offset.length();
      const minDistance = controls.minDistance || 3;
      const maxDistance = controls.maxDistance || 45;

      const newDist = THREE.MathUtils.clamp(currentDist * deltaRatio, minDistance, maxDistance);
      offset.setLength(newDist);
      cam.position.copy(target).add(offset);
      controls.update();
    });

    const unsubReset = cameraEvents.onReset(() => {
      targetPosRef.current = new THREE.Vector3(11, 14, 16);
      targetLookAtRef.current = new THREE.Vector3(0, 1.2, 0);
    });

    return () => {
      unsubZoom();
      unsubReset();
    };
  }, [camera, controlsRef]);

  return null;
}

interface SceneInteractionProps {
  onOneFingerZoomChange?: (active: boolean) => void;
}

function SceneInteraction({ onOneFingerZoomChange }: SceneInteractionProps) {
  const { camera, scene, raycaster, gl } = useThree();
  const mode = useWorldStore((state) => state.mode);
  const brushSize = useWorldStore((state) => state.brushSize);
  const continuousDrag = useWorldStore((state) => state.continuousDrag);
  const symmetryMode = useWorldStore((state) => state.symmetryMode);
  const addBlocksBatch = useWorldStore((state) => state.addBlocksBatch);
  const removeBlocksBatch = useWorldStore((state) => state.removeBlocksBatch);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);

  const [previewCoords, setPreviewCoords] = useState<Array<[number, number, number]>>([]);
  const lastPlacedRef = useRef<string | null>(null);

  // Single-finger double-tap and drag zoom references
  const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isOneFingerZoomingRef = useRef(false);
  const lastZoomYRef = useRef(0);

  // Perform accurate raycast
  const getRaycastHit = useCallback(
    (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      const pointer = new THREE.Vector2(x, y);
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (!hit.object || !hit.point || !hit.face) continue;

        const isVoxel = hit.object.userData?.isVoxelMesh;
        const isGround = hit.object.userData?.isGroundPlane;

        if (isVoxel) {
          const point = hit.point;
          const normal = hit.face.normal;
          const worldNormal = normal.clone().transformDirection(hit.object.matrixWorld).normalize();

          // Calculate center of tapped block
          const blockX = Math.round(point.x - worldNormal.x * 0.45);
          const blockY = Math.round(point.y - worldNormal.y * 0.45);
          const blockZ = Math.round(point.z - worldNormal.z * 0.45);

          // Calculate place target adjacent coord
          const placeX = Math.round(blockX + Math.round(worldNormal.x));
          const placeY = Math.round(blockY + Math.round(worldNormal.y));
          const placeZ = Math.round(blockZ + Math.round(worldNormal.z));

          return {
            isVoxel: true,
            normal: [Math.round(worldNormal.x), Math.round(worldNormal.y), Math.round(worldNormal.z)] as [number, number, number],
            tappedBlock: [blockX, blockY, blockZ] as [number, number, number],
            placeCoord: [placeX, placeY, placeZ] as [number, number, number],
          };
        }

        if (isGround) {
          const groundX = Math.round(hit.point.x);
          const groundY = 0; // First block level above ground plane
          const groundZ = Math.round(hit.point.z);

          return {
            isGround: true,
            normal: [0, 1, 0] as [number, number, number],
            tappedBlock: null,
            placeCoord: [groundX, groundY, groundZ] as [number, number, number],
          };
        }
      }

      return null;
    },
    [camera, gl.domElement, raycaster, scene]
  );

  useEffect(() => {
    const dom = gl.domElement;
    let downPos: { x: number; y: number; time: number } | null = null;
    let isDrawing = false;

    const executePlacement = (hit: ReturnType<typeof getRaycastHit>) => {
      if (!hit) return;
      if (mode === 'destroy') {
        if (hit.isVoxel && hit.tappedBlock) {
          const coords = getBrushCoordinates(hit.tappedBlock, hit.normal, brushSize);
          const symmetricCoords = getSymmetryCoordinates(coords, symmetryMode);
          removeBlocksBatch(symmetricCoords);
        }
      } else {
        // Build mode
        const coords = getBrushCoordinates(hit.placeCoord, hit.normal, brushSize);
        const symmetricCoords = getSymmetryCoordinates(coords, symmetryMode);
        addBlocksBatch(symmetricCoords, selectedBlock);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Only primary mouse button or touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const now = performance.now();

      // Check if this is a double-tap down for 1-finger zoom gesture
      if (
        lastTapRef.current &&
        now - lastTapRef.current.time < 380 &&
        Math.hypot(e.clientX - lastTapRef.current.x, e.clientY - lastTapRef.current.y) < 40
      ) {
        isOneFingerZoomingRef.current = true;
        lastZoomYRef.current = e.clientY;
        onOneFingerZoomChange?.(true);
        downPos = null;
        setPreviewCoords([]);
        return;
      }

      downPos = {
        x: e.clientX,
        y: e.clientY,
        time: now,
      };

      if (continuousDrag) {
        isDrawing = true;
        const hit = getRaycastHit(e.clientX, e.clientY);
        if (hit) {
          const key = mode === 'destroy' && hit.tappedBlock
            ? hit.tappedBlock.join(',')
            : hit.placeCoord.join(',');
          lastPlacedRef.current = key;
          executePlacement(hit);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Handle single-finger double-tap-and-drag zoom
      if (isOneFingerZoomingRef.current) {
        const deltaY = e.clientY - lastZoomYRef.current;
        lastZoomYRef.current = e.clientY;
        // Dragging down zooms in closer (deltaRatio < 1.0), dragging up zooms out (deltaRatio > 1.0)
        const deltaRatio = 1 - deltaY * 0.016;
        cameraEvents.zoom(deltaRatio);
        setPreviewCoords([]);
        return;
      }

      const hit = getRaycastHit(e.clientX, e.clientY);

      // Handle continuous drag painting if active
      if (isDrawing && continuousDrag && hit) {
        const key = mode === 'destroy' && hit.tappedBlock
          ? hit.tappedBlock.join(',')
          : hit.placeCoord.join(',');
        if (lastPlacedRef.current !== key) {
          lastPlacedRef.current = key;
          executePlacement(hit);
        }
      }

      // If dragging for orbit/pan without continuous mode, hide cursor
      if (downPos && !continuousDrag) {
        const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
        if (dist > 7) {
          setPreviewCoords([]);
          return;
        }
      }

      // Compute hover preview for pointer
      if (!hit) {
        setPreviewCoords([]);
        return;
      }

      if (mode === 'destroy') {
        if (hit.isVoxel && hit.tappedBlock) {
          const coords = getBrushCoordinates(hit.tappedBlock, hit.normal, brushSize);
          const symmetricCoords = getSymmetryCoordinates(coords, symmetryMode);
          setPreviewCoords(symmetricCoords);
        } else {
          setPreviewCoords([]);
        }
      } else {
        const coords = getBrushCoordinates(hit.placeCoord, hit.normal, brushSize);
        const symmetricCoords = getSymmetryCoordinates(coords, symmetryMode);
        setPreviewCoords(symmetricCoords);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isOneFingerZoomingRef.current) {
        isOneFingerZoomingRef.current = false;
        lastTapRef.current = null;
        onOneFingerZoomChange?.(false);
        return;
      }

      isDrawing = false;
      lastPlacedRef.current = null;
      if (!downPos) return;

      const dx = e.clientX - downPos.x;
      const dy = e.clientY - downPos.y;
      const dist = Math.hypot(dx, dy);
      const dt = performance.now() - downPos.time;
      downPos = null;

      if (continuousDrag) {
        return;
      }

      // Filter out drags (orbit rotate or pan)
      if (dist > 8 || dt > 500) {
        lastTapRef.current = null;
        return;
      }

      // Record tap for double-tap detection
      lastTapRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      };

      const hit = getRaycastHit(e.clientX, e.clientY);
      if (!hit) return;

      executePlacement(hit);
    };

    const handlePointerLeave = () => {
      if (isOneFingerZoomingRef.current) {
        isOneFingerZoomingRef.current = false;
        lastTapRef.current = null;
        onOneFingerZoomChange?.(false);
      }
      downPos = null;
      isDrawing = false;
      lastPlacedRef.current = null;
      setPreviewCoords([]);
    };

    dom.addEventListener('pointerdown', handlePointerDown, { passive: true });
    dom.addEventListener('pointermove', handlePointerMove, { passive: true });
    dom.addEventListener('pointerup', handlePointerUp, { passive: true });
    dom.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [addBlocksBatch, brushSize, continuousDrag, getRaycastHit, gl.domElement, mode, onOneFingerZoomChange, removeBlocksBatch, selectedBlock]);

  return (
    <>
      <VoxelMesh />
      <ChallengeGhostMesh />
      <GroundPlane />
      <ParticleSystem />
      <PlacementCursor previewCoords={previewCoords} targetMode={mode} />
    </>
  );
}

function AutoRotateLoop({ active, controlsRef }: { active: boolean; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  useFrame(() => {
    if (active && controlsRef.current) {
      controlsRef.current.update();
    }
  });
  return null;
}

interface VoxelSceneProps {
  isInitialScreenOpen?: boolean;
}

export function VoxelScene({ isInitialScreenOpen = false }: VoxelSceneProps) {
  const timeOfDay = useWorldStore((state) => state.timeOfDay);
  const weather = useWorldStore((state) => state.weather);
  const continuousDrag = useWorldStore((state) => state.continuousDrag);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isOneFingerZooming, setIsOneFingerZooming] = useState(false);

  return (
    <div
      id="voxel-canvas-container"
      className="relative w-full h-full select-none touch-none overscroll-none overflow-hidden"
    >
      <Canvas
        shadows
        camera={{ position: [11, 14, 16], fov: 42, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        className="w-full h-full touch-none select-none"
      >
        <LightingAndEnvironment timeOfDay={timeOfDay} weather={weather} />
        <SkyDome timeOfDay={timeOfDay} weather={weather} />
        <WeatherSystem weather={weather} />
        <SymmetryGuide />

        {/* OrbitControls with autoRotate on initial menu screen (slow, gentle ambient showcase rotation) */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate={isInitialScreenOpen}
          autoRotateSpeed={0.35}
          enableRotate={!continuousDrag && !isOneFingerZooming}
          rotateSpeed={0.7}
          enablePan={true}
          panSpeed={0.75}
          enableZoom={true}
          zoomSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.06}
          minPolarAngle={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera below ground
          minDistance={3}
          maxDistance={45}
          target={[0, 1.2, 0]}
        />

        <AutoRotateLoop active={isInitialScreenOpen} controlsRef={controlsRef} />
        <CameraController controlsRef={controlsRef} />
        <SceneInteraction onOneFingerZoomChange={setIsOneFingerZooming} />
        <PostProcessingEffects />
      </Canvas>
    </div>
  );
}
