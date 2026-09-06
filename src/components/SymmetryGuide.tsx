import { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';

export function SymmetryGuide() {
  const symmetryMode = useWorldStore((state) => state.symmetryMode);

  // Reusable plane geometry & edge geometries
  const { xPlaneEdges, zPlaneEdges } = useMemo(() => {
    const xBox = new THREE.PlaneGeometry(36, 16);
    const zBox = new THREE.PlaneGeometry(36, 16);
    return {
      xPlaneEdges: new THREE.EdgesGeometry(xBox),
      zPlaneEdges: new THREE.EdgesGeometry(zBox),
    };
  }, []);

  if (symmetryMode === 'none') {
    return null;
  }

  const showX = symmetryMode === 'x' || symmetryMode === 'both';
  const showZ = symmetryMode === 'z' || symmetryMode === 'both';

  return (
    <group name="symmetry-guides">
      {/* X-Axis Mirror Plane (at x = 0, extending along Z and Y) */}
      {showX && (
        <group position={[0, 8, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Subtle translucent colored plane */}
          <mesh raycast={() => null}>
            <planeGeometry args={[36, 16]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Border contour */}
          <lineSegments geometry={xPlaneEdges} raycast={() => null}>
            <lineBasicMaterial
              color="#0284c7"
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </lineSegments>

          {/* Ground axis center line */}
          <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
            <planeGeometry args={[36, 0.12]} />
            <meshBasicMaterial
              color="#0284c7"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Z-Axis Mirror Plane (at z = 0, extending along X and Y) */}
      {showZ && (
        <group position={[0, 8, 0]} rotation={[0, 0, 0]}>
          {/* Subtle translucent colored plane */}
          <mesh raycast={() => null}>
            <planeGeometry args={[36, 16]} />
            <meshBasicMaterial
              color="#f43f5e"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Border contour */}
          <lineSegments geometry={zPlaneEdges} raycast={() => null}>
            <lineBasicMaterial
              color="#e11d48"
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </lineSegments>

          {/* Ground axis center line */}
          <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
            <planeGeometry args={[36, 0.12]} />
            <meshBasicMaterial
              color="#e11d48"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
