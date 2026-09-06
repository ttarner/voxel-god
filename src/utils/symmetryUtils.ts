import { SymmetryMode } from '../types';

/**
 * Calculates symmetric mirrored coordinates across the origin (0, 0, 0)
 * based on the active symmetry mode:
 * - 'none': returns original coordinates
 * - 'x': mirrors across X-axis plane (x -> -x)
 * - 'z': mirrors across Z-axis plane (z -> -z)
 * - 'both': mirrors across both X and Z planes (x -> -x, z -> -z, and -x, -z)
 */
export function getSymmetryCoordinates(
  coords: Array<[number, number, number]>,
  symmetry: SymmetryMode
): Array<[number, number, number]> {
  if (symmetry === 'none' || !coords.length) {
    return coords;
  }

  const result: Array<[number, number, number]> = [];
  const visited = new Set<string>();

  for (const [x, y, z] of coords) {
    const pointsToMirror: Array<[number, number, number]> = [[x, y, z]];

    if (symmetry === 'x' || symmetry === 'both') {
      pointsToMirror.push([-x, y, z]);
    }

    if (symmetry === 'z' || symmetry === 'both') {
      pointsToMirror.push([x, y, -z]);
    }

    if (symmetry === 'both') {
      pointsToMirror.push([-x, y, -z]);
    }

    for (const [mx, my, mz] of pointsToMirror) {
      const key = `${mx},${my},${mz}`;
      if (!visited.has(key)) {
        visited.add(key);
        result.push([mx, my, mz]);
      }
    }
  }

  return result;
}

export const SYMMETRY_LABELS: Record<SymmetryMode, { short: string; label: string; desc: string }> = {
  none: {
    short: 'Off',
    label: 'Simmetria Disattivata',
    desc: 'Posizionamento standard a singolo blocco/pennello.',
  },
  x: {
    short: 'Asse X',
    label: 'Simmetria Asse X',
    desc: 'I blocchi vengono specchiati automaticamente lungo l’asse X.',
  },
  z: {
    short: 'Asse Z',
    label: 'Simmetria Asse Z',
    desc: 'I blocchi vengono specchiati automaticamente lungo l’asse Z.',
  },
  both: {
    short: 'X + Z',
    label: 'Simmetria X + Z',
    desc: 'Quadrupla simmetria speculare sui 4 quadranti per strutture circolari o radiali.',
  },
};
