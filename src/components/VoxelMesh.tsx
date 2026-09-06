import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';
import { CONCRETE_BLOCK_TYPES, BLOCK_CONFIGS } from '../utils/blockConfig';
import { ConcreteBlockType } from '../types';

const MAX_INSTANCES_PER_TYPE = 4000;

interface InstancedGroupProps {
  type: ConcreteBlockType;
  coordinates: Array<[number, number, number]>;
}

function InstancedBlockGroup({ type, coordinates }: InstancedGroupProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const config = BLOCK_CONFIGS[type];
  const customBlockColors = useWorldStore((state) => state.customBlockColors);
  const activeColor = customBlockColors[type] || config.color;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Shared geometry
  const geometry = useMemo(() => {
    // 1x1x1 unit box with subtle edge bevel via chamfer or sharp clean box
    return new THREE.BoxGeometry(1, 1, 1);
  }, []);

  // Dedicated material for this block type
  const material = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: new THREE.Color(activeColor),
      transparent: Boolean(config.isTransparent),
      opacity: config.opacity ?? 1.0,
      depthWrite: true,
    });
  }, [activeColor, config.isTransparent, config.opacity]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const count = coordinates.length;
    mesh.count = Math.min(count, MAX_INSTANCES_PER_TYPE);

    if (count === 0) {
      mesh.visible = false;
      mesh.instanceMatrix.needsUpdate = true;
      return;
    }

    mesh.visible = true;
    for (let i = 0; i < count && i < MAX_INSTANCES_PER_TYPE; i++) {
      const [x, y, z] = coordinates[i];
      dummy.position.set(x, y, z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    try {
      mesh.computeBoundingSphere();
    } catch {
      // Ignore if geometry bounding sphere fails
    }
  }, [coordinates, dummy]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_INSTANCES_PER_TYPE]}
      castShadow
      receiveShadow
      userData={{ isVoxelMesh: true, blockType: type }}
    />
  );
}

export function VoxelMesh() {
  const blocks = useWorldStore((state) => state.blocks);

  // Group coordinates by block type
  const groupedCoords = useMemo(() => {
    const groups: Record<ConcreteBlockType, Array<[number, number, number]>> = {
      grass: [],
      dirt: [],
      stone: [],
      wood: [],
      brick: [],
      glass: [],
      water: [],
      leaves: [],
    };

    for (const [key, type] of Object.entries(blocks)) {
      if (groups[type]) {
        const parts = key.split(',').map(Number);
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          groups[type].push([parts[0], parts[1], parts[2]]);
        }
      }
    }

    return groups;
  }, [blocks]);

  return (
    <group name="voxel-world">
      {CONCRETE_BLOCK_TYPES.map((type) => (
        <InstancedBlockGroup
          key={type}
          type={type}
          coordinates={groupedCoords[type]}
        />
      ))}
    </group>
  );
}
