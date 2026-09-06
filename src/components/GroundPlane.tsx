import { useMemo } from 'react';
import { useWorldStore } from '../store/worldStore';

export function GroundPlane() {
  const showGrid = useWorldStore((state) => state.showGrid);

  const planeSize = 30;

  return (
    <group position={[0, -0.5, 0]}>
      {/* Base shadow catcher & raycast receptor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        userData={{ isGroundPlane: true }}
      >
        <planeGeometry args={[planeSize, planeSize]} />
        <meshLambertMaterial
          color="#dbe6f0"
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      {/* Subtle modern minimalist grid lines */}
      {showGrid && (
        <gridHelper
          args={[planeSize, planeSize, '#94a3b8', '#cbd5e1']}
          position={[0, 0.005, 0]}
        />
      )}

      {/* Subtle boundary pedestal */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[planeSize + 0.4, 0.5, planeSize + 0.4]} />
        <meshLambertMaterial color="#c8d6e5" />
      </mesh>
    </group>
  );
}
