import { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';
import { BLOCK_CONFIGS } from '../utils/blockConfig';

interface PlacementCursorProps {
  previewCoords: Array<[number, number, number]>;
  targetMode: 'build' | 'destroy';
}

export function PlacementCursor({ previewCoords, targetMode }: PlacementCursorProps) {
  const selectedBlock = useWorldStore((state) => state.selectedBlock);
  const customBlockColors = useWorldStore((state) => state.customBlockColors);
  const blockConfig = BLOCK_CONFIGS[selectedBlock];
  const activeColor = customBlockColors[selectedBlock] || blockConfig.color;

  const wireframeGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(1.025, 1.025, 1.025);
    return new THREE.EdgesGeometry(box);
  }, []);

  if (!previewCoords || previewCoords.length === 0) return null;

  const isDestroy = targetMode === 'destroy';
  // Pastel Lavender for build mode cursor lattice, soft pastel coral for destroy mode
  const reticleColor = isDestroy ? '#FB7185' : '#C084FC';
  const fillColor = isDestroy ? '#FCA5A5' : activeColor;

  return (
    <group>
      {previewCoords.map(([x, y, z]) => (
        <group key={`cursor-${x}-${y}-${z}`} position={[x, y, z]}>
          {/* Semi-transparent preview fill */}
          <mesh>
            <boxGeometry args={[0.985, 0.985, 0.985]} />
            <meshBasicMaterial
              color={fillColor}
              transparent
              opacity={isDestroy ? 0.35 : 0.42}
              depthWrite={false}
            />
          </mesh>

          {/* Soft Pastel Lavender / Coral sculpted reticle wireframe lattice */}
          <lineSegments geometry={wireframeGeo}>
            <lineBasicMaterial
              color={reticleColor}
              linewidth={2}
              transparent
              opacity={0.92}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

