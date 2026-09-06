import { useMemo } from 'react';
import * as THREE from 'three';
import { useWorldStore } from '../store/worldStore';
import { CHALLENGES } from '../utils/challenges';
import { BLOCK_CONFIGS } from '../utils/blockConfig';
import { ConcreteBlockType } from '../types';

export function ChallengeGhostMesh() {
  const gameMode = useWorldStore((state) => state.gameMode);
  const activeChallengeId = useWorldStore((state) => state.activeChallengeId);
  const showGhostGuide = useWorldStore((state) => state.showGhostGuide);
  const currentBlocks = useWorldStore((state) => state.blocks);
  const customBlockColors = useWorldStore((state) => state.customBlockColors);

  const challenge = useMemo(() => {
    if (gameMode !== 'challenge' || !activeChallengeId) return null;
    return CHALLENGES.find((c) => c.id === activeChallengeId) || null;
  }, [gameMode, activeChallengeId]);

  // Compute ghost blocks that need to be shown (missing or wrong block type)
  const ghostBlocks = useMemo(() => {
    if (!challenge || !showGhostGuide) return [];

    const items: Array<{
      key: string;
      coord: [number, number, number];
      expectedType: ConcreteBlockType;
      color: string;
      secondaryColor: string;
      label: string;
    }> = [];

    for (const [key, expectedType] of Object.entries(challenge.targetBlocks)) {
      const placedType = currentBlocks[key];
      // Only show ghost if not correctly placed
      if (placedType !== expectedType) {
        const parts = key.split(',').map(Number);
        if (parts.length === 3) {
          const config = BLOCK_CONFIGS[expectedType];
          const color = customBlockColors[expectedType] || config.color;
          items.push({
            key,
            coord: [parts[0], parts[1], parts[2]],
            expectedType,
            color,
            secondaryColor: config.secondaryColor || color,
            label: config.label,
          });
        }
      }
    }

    return items;
  }, [challenge, showGhostGuide, currentBlocks, customBlockColors]);

  if (!challenge || !showGhostGuide || ghostBlocks.length === 0) {
    return null;
  }

  return (
    <group name="challenge-ghost-blueprints">
      {ghostBlocks.map((item) => (
        <group key={item.key} position={item.coord}>
          {/* Hologram block body matching the target block's exact color */}
          <mesh>
            <boxGeometry args={[0.96, 0.96, 0.96]} />
            <meshStandardMaterial
              color={item.color}
              emissive={item.color}
              emissiveIntensity={0.28}
              transparent
              opacity={0.52}
              roughness={0.2}
              metalness={0.1}
              depthWrite={false}
            />
          </mesh>

          {/* Distinct colored glowing wireframe borders */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.99, 0.99, 0.99)]} />
            <lineBasicMaterial
              color={item.color}
              transparent
              opacity={0.9}
              linewidth={2}
            />
          </lineSegments>

          {/* Subtle white accent corner edges */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.0, 1.0, 1.0)]} />
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.4}
              linewidth={1}
            />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}
