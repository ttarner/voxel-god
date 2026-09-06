export type BlockType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'brick'
  | 'glass'
  | 'water'
  | 'leaves'
  | 'tree';

export type Language = 'it' | 'en';

export type ConcreteBlockType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'wood'
  | 'brick'
  | 'glass'
  | 'water'
  | 'leaves';

export type ToolMode = 'build' | 'destroy';

export type GameMode = 'sandbox' | 'challenge';

export type BrushSize = 1 | 2 | 3;

export type TimeOfDay = 'sunrise' | 'noon' | 'twilight' | 'night' | 'day' | 'sunset';

export interface EnvironmentPreset {
  id: 'sunrise' | 'noon' | 'twilight' | 'night';
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  accentColor: string;
  bgGradient: string;
}

export type WeatherType = 'none' | 'rain' | 'snow';

export type SymmetryMode = 'none' | 'x' | 'z' | 'both';

export interface ChallengeConfig {
  id: string;
  name: string;
  category: 'principiante' | 'natura' | 'architettura' | 'oggetti' | 'esperto';
  icon: string;
  description: string;
  difficulty: 1 | 2 | 3;
  targetBlocks: Record<string, ConcreteBlockType>;
  tips?: string;
}

export interface ChallengeProgress {
  total: number;
  correct: number;
  missing: number;
  wrong: number;
  percent: number;
  isCompleted: boolean;
}

export interface BlockConfig {
  id: BlockType;
  label: string;
  color: string;
  secondaryColor?: string;
  isTransparent?: boolean;
  opacity?: number;
  description: string;
  category: 'terrain' | 'building' | 'nature' | 'special';
}

export interface RaycastHitInfo {
  point: [number, number, number];
  normal: [number, number, number];
  blockCoord?: [number, number, number];
  isGround?: boolean;
}
