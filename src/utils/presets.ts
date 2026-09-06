import { ConcreteBlockType } from '../types';

export interface WorldPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  blocks: Record<string, ConcreteBlockType>;
}

// Key helper
const k = (x: number, y: number, z: number) => `${x},${y},${z}`;

// Generate starter island
function generateStarterIsland(): Record<string, ConcreteBlockType> {
  const blocks: Record<string, ConcreteBlockType> = {};

  // Base island 7x7 with tapered corners
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      const dist = Math.sqrt(x * x + z * z);
      if (dist <= 3.6) {
        // Bottom dirt layer
        blocks[k(x, 0, z)] = 'dirt';
        // Top grass layer
        blocks[k(x, 1, z)] = 'grass';
      }
    }
  }

  // Stone path
  blocks[k(0, 1, 0)] = 'stone';
  blocks[k(0, 1, 1)] = 'stone';
  blocks[k(1, 1, 1)] = 'stone';
  blocks[k(1, 1, 2)] = 'stone';

  // Small natural spring pool with crystal clear water
  blocks[k(-1, 1, 0)] = 'water';
  blocks[k(-1, 1, -1)] = 'water';
  blocks[k(0, 1, -1)] = 'water';

  // Starter Tree at (-2, 1, 1)
  const tx = -2;
  const ty = 2; // trunk starts on grass (y=1), so trunk is at y=2
  const tz = 1;
  // 2-block trunk
  blocks[k(tx, ty, tz)] = 'wood';
  blocks[k(tx, ty + 1, tz)] = 'wood';

  // Leaves canopy at y=ty+2 and y=ty+3
  const ly = ty + 2;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      blocks[k(tx + dx, ly, tz + dz)] = 'leaves';
    }
  }
  // Top leaves cross
  blocks[k(tx, ly + 1, tz)] = 'leaves';
  blocks[k(tx + 1, ly + 1, tz)] = 'leaves';
  blocks[k(tx - 1, ly + 1, tz)] = 'leaves';
  blocks[k(tx, ly + 1, tz + 1)] = 'leaves';
  blocks[k(tx, ly + 1, tz - 1)] = 'leaves';

  // Cute brick flowerpot / bench at (2, 2, -1)
  blocks[k(2, 2, -1)] = 'brick';
  blocks[k(2, 2, -2)] = 'wood';

  return blocks;
}

// Generate Cozy Cottage
function generateCozyCottage(): Record<string, ConcreteBlockType> {
  const blocks: Record<string, ConcreteBlockType> = {};

  // 9x9 grass base
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      blocks[k(x, 0, z)] = 'grass';
    }
  }

  // Cottage foundation (x: -2..2, z: -2..2)
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      // Wood floor
      blocks[k(x, 1, z)] = 'wood';

      // Walls
      for (let y = 2; y <= 3; y++) {
        const isWall = x === -2 || x === 2 || z === -2 || z === 2;
        if (isWall) {
          // Door gap at (0, 2, 2)
          if (x === 0 && z === 2 && y === 2) continue;
          // Windows
          if ((x === 0 && z === -2 && y === 2) || (x === -2 && z === 0 && y === 2) || (x === 2 && z === 0 && y === 2)) {
            blocks[k(x, y, z)] = 'glass';
          } else {
            blocks[k(x, y, z)] = 'brick';
          }
        }
      }
    }
  }

  // Roof (wood pyramid)
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      blocks[k(x, 4, z)] = 'wood';
    }
  }
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      blocks[k(x, 5, z)] = 'wood';
    }
  }
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      blocks[k(x, 6, z)] = 'wood';
    }
  }

  // Brick Chimney
  blocks[k(2, 4, -1)] = 'brick';
  blocks[k(2, 5, -1)] = 'brick';
  blocks[k(2, 6, -1)] = 'brick';
  blocks[k(2, 7, -1)] = 'brick';

  // Small yard tree
  const tx = -3;
  const tz = 3;
  blocks[k(tx, 1, tz)] = 'wood';
  blocks[k(tx, 2, tz)] = 'wood';
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      blocks[k(tx + dx, 3, tz + dz)] = 'leaves';
    }
  }
  blocks[k(tx, 4, tz)] = 'leaves';

  return blocks;
}

// Generate Zen Shrine
function generateZenShrine(): Record<string, ConcreteBlockType> {
  const blocks: Record<string, ConcreteBlockType> = {};

  // Sand/Stone garden platform
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      blocks[k(x, 0, z)] = (x + z) % 2 === 0 ? 'stone' : 'dirt';
    }
  }

  // Torii / Gate posts (Wood)
  for (let y = 1; y <= 4; y++) {
    blocks[k(-2, y, 0)] = 'brick';
    blocks[k(2, y, 0)] = 'brick';
  }
  // Crossbeams
  for (let x = -3; x <= 3; x++) {
    blocks[k(x, 4, 0)] = 'brick';
  }
  for (let x = -2; x <= 2; x++) {
    blocks[k(x, 3, 0)] = 'wood';
  }

  // Shrine center altar
  blocks[k(0, 1, -2)] = 'stone';
  blocks[k(0, 2, -2)] = 'glass';

  // Two flank trees
  const addTree = (tx: number, tz: number) => {
    blocks[k(tx, 1, tz)] = 'wood';
    blocks[k(tx, 2, tz)] = 'wood';
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (Math.abs(dx) + Math.abs(dz) <= 1) {
          blocks[k(tx + dx, 3, tz + dz)] = 'leaves';
        }
      }
    }
    blocks[k(tx, 4, tz)] = 'leaves';
  };

  addTree(-3, -3);
  addTree(3, -3);

  return blocks;
}

// Generate Water Oasis & Fountain
function generateWaterOasis(): Record<string, ConcreteBlockType> {
  const blocks: Record<string, ConcreteBlockType> = {};

  // 9x9 terrain base (dirt bottom, grass surface)
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      blocks[k(x, 0, z)] = 'dirt';
      blocks[k(x, 1, z)] = 'grass';
    }
  }

  // Stone basin border and central water pool
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      const isBorder = Math.abs(x) === 2 || Math.abs(z) === 2;
      if (isBorder) {
        blocks[k(x, 1, z)] = 'stone';
      } else {
        // Deep turquoise water pool
        blocks[k(x, 1, z)] = 'water';
      }
    }
  }

  // Central stone fountain pillar with water jet
  blocks[k(0, 1, 0)] = 'stone';
  blocks[k(0, 2, 0)] = 'stone';
  blocks[k(0, 3, 0)] = 'water'; // fountain crest
  blocks[k(1, 2, 0)] = 'water';
  blocks[k(-1, 2, 0)] = 'water';
  blocks[k(0, 2, 1)] = 'water';
  blocks[k(0, 2, -1)] = 'water';

  // Lilypad & flower in pool
  blocks[k(-1, 2, -1)] = 'leaves';
  blocks[k(-1, 3, -1)] = 'brick';

  // Surrounding palm / sakura trees
  const addCornerTree = (tx: number, tz: number) => {
    blocks[k(tx, 2, tz)] = 'wood';
    blocks[k(tx, 3, tz)] = 'wood';
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        blocks[k(tx + dx, 4, tz + dz)] = 'leaves';
      }
    }
    blocks[k(tx, 5, tz)] = 'leaves';
  };

  addCornerTree(-3, -3);
  addCornerTree(3, 3);

  // Stepping stones
  blocks[k(3, 1, 0)] = 'stone';
  blocks[k(-3, 1, 0)] = 'stone';

  return blocks;
}

// Generate Flat Meadow
function generateFlatMeadow(): Record<string, ConcreteBlockType> {
  const blocks: Record<string, ConcreteBlockType> = {};
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      blocks[k(x, 0, z)] = 'grass';
    }
  }
  return blocks;
}

export const WORLD_PRESETS: WorldPreset[] = [
  {
    id: 'starter',
    name: 'Floating Island',
    description: 'A cozy pastel floating isle with tree, stream, and flora',
    icon: '🏝️',
    blocks: generateStarterIsland(),
  },
  {
    id: 'oasis',
    name: 'Laghetto & Fontana',
    description: 'Un’oasi rilassante con piscina d’acqua cristallina, fontana e ninfee',
    icon: '⛲',
    blocks: generateWaterOasis(),
  },
  {
    id: 'cottage',
    name: 'Cozy Cottage',
    description: 'A warm brick cottage with cedar roof and chimney',
    icon: '🏡',
    blocks: generateCozyCottage(),
  },
  {
    id: 'shrine',
    name: 'Zen Shrine',
    description: 'A peaceful garden with sacred arch and bonsai trees',
    icon: '⛩️',
    blocks: generateZenShrine(),
  },
  {
    id: 'flat',
    name: 'Flat Meadow',
    description: 'A clean 9x9 grass building plate for sandbox freedom',
    icon: '🟩',
    blocks: generateFlatMeadow(),
  },
  {
    id: 'empty',
    name: 'Empty Canvas',
    description: 'A completely clear ground to start from scratch',
    icon: '✨',
    blocks: {},
  },
];
