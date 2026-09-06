import { EnvironmentPreset, TimeOfDay } from '../types';

export const ENVIRONMENT_PRESETS: EnvironmentPreset[] = [
  {
    id: 'sunrise',
    name: 'Alba (Sunrise)',
    shortName: 'Alba',
    description: 'Luce dorata radente e cielo pastello rosato',
    iconName: 'Sunrise',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400/20 to-rose-400/20',
  },
  {
    id: 'noon',
    name: 'Mezzogiorno (Noon)',
    shortName: 'Mezzogiorno',
    description: 'Sole radioso zenitale e massima brillantezza',
    iconName: 'Sun',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-400/20 to-blue-400/20',
  },
  {
    id: 'twilight',
    name: 'Crepuscolo (Twilight)',
    shortName: 'Crepuscolo',
    description: 'Sfumature calde porpora, arancio e corallo',
    iconName: 'Sunset',
    accentColor: '#f97316',
    bgGradient: 'from-purple-500/20 to-orange-500/20',
  },
  {
    id: 'night',
    name: 'Notte (Night)',
    shortName: 'Notte',
    description: 'Luna argentea, atmosfera profonda e stelle scintillanti',
    iconName: 'Moon',
    accentColor: '#818cf8',
    bgGradient: 'from-indigo-900/30 to-slate-900/30',
  },
];

/**
 * Normalizes legacy timeOfDay values ('day' -> 'noon', 'sunset' -> 'twilight')
 */
export function normalizeTimeOfDay(time: TimeOfDay): 'sunrise' | 'noon' | 'twilight' | 'night' {
  if (time === 'day') return 'noon';
  if (time === 'sunset') return 'twilight';
  if (time === 'sunrise' || time === 'noon' || time === 'twilight' || time === 'night') {
    return time;
  }
  return 'noon';
}
