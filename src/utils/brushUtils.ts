import { BrushSize } from '../types';

export function getBrushCoordinates(
  centerCoord: [number, number, number],
  normal: [number, number, number],
  brushSize: BrushSize
): Array<[number, number, number]> {
  const [cx, cy, cz] = centerCoord;
  if (brushSize === 1) {
    return [[cx, cy, cz]];
  }

  const coords: Array<[number, number, number]> = [];
  const radius = brushSize === 2 ? 1 : 1; // 2x2 or 3x3

  if (brushSize === 2) {
    // 2x2 patch
    if (Math.abs(normal[1]) > 0.5) {
      // Horizontal surface (floor / ceiling) -> 2x2 on X-Z
      for (let dx = 0; dx <= 1; dx++) {
        for (let dz = 0; dz <= 1; dz++) {
          coords.push([cx + dx, cy, cz + dz]);
        }
      }
    } else if (Math.abs(normal[0]) > 0.5) {
      // X-wall -> 2x2 on Y-Z
      for (let dy = 0; dy <= 1; dy++) {
        for (let dz = 0; dz <= 1; dz++) {
          coords.push([cx, cy + dy, cz + dz]);
        }
      }
    } else {
      // Z-wall -> 2x2 on X-Y
      for (let dx = 0; dx <= 1; dx++) {
        for (let dy = 0; dy <= 1; dy++) {
          coords.push([cx + dx, cy + dy, cz]);
        }
      }
    }
    return coords;
  }

  if (brushSize === 3) {
    // 3x3 centered patch
    if (Math.abs(normal[1]) > 0.5) {
      // Horizontal surface -> 3x3 on X-Z
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          coords.push([cx + dx, cy, cz + dz]);
        }
      }
    } else if (Math.abs(normal[0]) > 0.5) {
      // X-wall -> 3x3 on Y-Z
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          coords.push([cx, cy + dy, cz + dz]);
        }
      }
    } else {
      // Z-wall -> 3x3 on X-Y
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          coords.push([cx + dx, cy + dy, cz]);
        }
      }
    }
    return coords;
  }

  return [[cx, cy, cz]];
}
