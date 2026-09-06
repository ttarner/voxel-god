import { BlockConfig, BlockType, ConcreteBlockType } from '../types';

export const BLOCK_CONFIGS: Record<BlockType, BlockConfig> = {
  grass: {
    id: 'grass',
    label: 'Grass',
    color: '#84c77d',
    secondaryColor: '#70b369',
    description: 'Soft lush topsoil with fresh grass',
    category: 'terrain',
  },
  dirt: {
    id: 'dirt',
    label: 'Dirt',
    color: '#b6895b',
    secondaryColor: '#a17448',
    description: 'Rich warm earthen clay',
    category: 'terrain',
  },
  stone: {
    id: 'stone',
    label: 'Stone',
    color: '#b2bac4',
    secondaryColor: '#9ea7b3',
    description: 'Smooth light grey natural rock',
    category: 'building',
  },
  wood: {
    id: 'wood',
    label: 'Wood',
    color: '#d6a36c',
    secondaryColor: '#c49059',
    description: 'Warm tan cedar wood grain',
    category: 'nature',
  },
  brick: {
    id: 'brick',
    label: 'Brick',
    color: '#e27b68',
    secondaryColor: '#ce6754',
    description: 'Warm terracotta masonry block',
    category: 'building',
  },
  glass: {
    id: 'glass',
    label: 'Glass',
    color: '#a3dcf2',
    secondaryColor: '#88cde8',
    isTransparent: true,
    opacity: 0.6,
    description: 'Semi-transparent pastel sky glass',
    category: 'building',
  },
  water: {
    id: 'water',
    label: 'Water',
    color: '#5eb6f6',
    secondaryColor: '#3b82f6',
    isTransparent: true,
    opacity: 0.72,
    description: 'Crystal clear calm aqua spring water',
    category: 'nature',
  },
  leaves: {
    id: 'leaves',
    label: 'Leaves',
    color: '#65c474',
    secondaryColor: '#52b061',
    description: 'Vibrant spring tree foliage',
    category: 'nature',
  },
  tree: {
    id: 'tree',
    label: 'Tree',
    color: '#4fa85e',
    secondaryColor: '#b8824a',
    description: 'Spawns a wood trunk with foliage canopy',
    category: 'special',
  },
};

export const HOTBAR_BLOCKS: BlockType[] = [
  'grass',
  'dirt',
  'stone',
  'wood',
  'brick',
  'glass',
  'water',
  'leaves',
  'tree',
];

export const CONCRETE_BLOCK_TYPES: ConcreteBlockType[] = [
  'grass',
  'dirt',
  'stone',
  'wood',
  'brick',
  'glass',
  'water',
  'leaves',
];

export interface PastelSwatch {
  name: string;
  color: string;
}

export const PASTEL_SWATCHES: PastelSwatch[] = [
  { name: 'Matcha', color: '#84c77d' },
  { name: 'Mint Frost', color: '#a7f3d0' },
  { name: 'Sage Leaf', color: '#65c474' },
  { name: 'Pistachio', color: '#bbf7d0' },
  { name: 'Aqua Blue', color: '#5eb6f6' },
  { name: 'Sky Pastel', color: '#a3dcf2' },
  { name: 'Baby Blue', color: '#bae6fd' },
  { name: 'Deep Ocean', color: '#38bdf8' },
  { name: 'Lavender', color: '#c4b5fd' },
  { name: 'Lilac Fog', color: '#e9d5ff' },
  { name: 'Sakura Pink', color: '#fbcfe8' },
  { name: 'Cotton Candy', color: '#f472b6' },
  { name: 'Peach Sorbet', color: '#fecdd3' },
  { name: 'Apricot', color: '#fed7aa' },
  { name: 'Buttercup', color: '#fef08a' },
  { name: 'Warm Cedar', color: '#d6a36c' },
  { name: 'Clay Brown', color: '#b6895b' },
  { name: 'Terracotta', color: '#e27b68' },
  { name: 'Pearl Slate', color: '#b2bac4' },
  { name: 'Soft Obsidian', color: '#64748b' },
  { name: 'Cream Chalk', color: '#f1f5f9' },
  { name: 'Seafoam Gem', color: '#99f6e4' },
];

export interface PastelThemePreset {
  id: string;
  name: string;
  description: string;
  colors: Record<ConcreteBlockType, string>;
}

export const PASTEL_THEME_PRESETS: PastelThemePreset[] = [
  {
    id: 'classic',
    name: 'Classico Pastello',
    description: 'Toni naturali e freschi con morbide sfumature bilanciate.',
    colors: {
      grass: '#84c77d',
      dirt: '#b6895b',
      stone: '#b2bac4',
      wood: '#d6a36c',
      brick: '#e27b68',
      glass: '#a3dcf2',
      water: '#5eb6f6',
      leaves: '#65c474',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura & Caramella',
    description: 'Sfumature delicate rosa ciliegio, lilla e toni floreali.',
    colors: {
      grass: '#fbcfe8',
      dirt: '#d8b4e2',
      stone: '#e9d5ff',
      wood: '#f472b6',
      brick: '#f43f5e',
      glass: '#fed7aa',
      water: '#a5f3fc',
      leaves: '#f9a8d4',
    },
  },
  {
    id: 'nordic',
    name: 'Nordico & Salvia',
    description: 'Essenze botaniche minimali, ardesia chiara e toni salvia freddi.',
    colors: {
      grass: '#86efac',
      dirt: '#94a3b8',
      stone: '#cbd5e1',
      wood: '#a8a29e',
      brick: '#64748b',
      glass: '#99f6e4',
      water: '#38bdf8',
      leaves: '#4ade80',
    },
  },
  {
    id: 'sunset_peach',
    name: 'Tramonto & Pesca',
    description: 'Atmosfera calda all’albicocca, terracotta e legno ambrato.',
    colors: {
      grass: '#fdba74',
      dirt: '#ea580c',
      stone: '#fed7aa',
      wood: '#fb923c',
      brick: '#f87171',
      glass: '#fde047',
      water: '#60a5fa',
      leaves: '#fca5a5',
    },
  },
  {
    id: 'cyber_vapor',
    name: 'Vaporwave Etereo',
    description: 'Colori celesti, menta pastello e lavanda crepuscolare.',
    colors: {
      grass: '#6ee7b7',
      dirt: '#818cf8',
      stone: '#a5b4fc',
      wood: '#c084fc',
      brick: '#e879f9',
      glass: '#38bdf8',
      water: '#06b6d4',
      leaves: '#2dd4bf',
    },
  },
];
