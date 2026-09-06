import { create } from 'zustand';
import { BlockType, ConcreteBlockType, ToolMode, TimeOfDay, WeatherType, SymmetryMode, BrushSize, GameMode, ChallengeProgress, Language } from '../types';
import { WORLD_PRESETS } from '../utils/presets';
import { PASTEL_THEME_PRESETS, BLOCK_CONFIGS } from '../utils/blockConfig';
import { CHALLENGES } from '../utils/challenges';
import { sounds } from '../utils/audio';
import { particleEvents } from '../utils/particleEvents';
import { haptics } from '../utils/haptics';
import { getInitialLanguage, persistLanguage } from '../utils/i18n';

const STORAGE_KEY = 'voxel_sandbox_world_v1';
const COLORS_STORAGE_KEY = 'voxel_sandbox_colors_v1';
const COMPLETED_CHALLENGES_STORAGE_KEY = 'voxel_completed_challenges_v1';
const AMBIENT_MUSIC_STORAGE_KEY = 'voxel_ambient_music_v1';
const AMBIENT_VOLUME_STORAGE_KEY = 'voxel_ambient_volume_v1';
const SFX_VOLUME_STORAGE_KEY = 'voxel_sfx_volume_v1';
const HAPTICS_STORAGE_KEY = 'voxel_haptics_enabled_v1';
const WEATHER_STORAGE_KEY = 'voxel_weather_v1';
const SYMMETRY_STORAGE_KEY = 'voxel_symmetry_v1';
const TIME_OF_DAY_STORAGE_KEY = 'voxel_time_of_day_v1';
const LANGUAGE_STORAGE_KEY = 'voxel_app_language_v1';
const BLOOM_ENABLED_STORAGE_KEY = 'voxel_bloom_enabled_v1';
const BLOOM_INTENSITY_STORAGE_KEY = 'voxel_bloom_intensity_v1';
const MAX_HISTORY = 30;

export interface WorldStoreState {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  // Game Mode: 'sandbox' or 'challenge'
  gameMode: GameMode;
  activeChallengeId: string | null;
  completedChallengeIds: string[];
  showGhostGuide: boolean;
  sandboxBackupBlocks: Record<string, ConcreteBlockType>;
  isCelebrationOpen: boolean;
  lastCompletedChallengeId: string | null;

  // World blocks map: key "x,y,z" -> concrete block type
  blocks: Record<string, ConcreteBlockType>;
  
  // Custom Material / Pastel Colors
  customBlockColors: Partial<Record<BlockType, string>>;
  activeThemeId: string;

  // UI & Tool state
  mode: ToolMode;
  brushSize: BrushSize;
  continuousDrag: boolean;
  symmetryMode: SymmetryMode;
  selectedBlock: BlockType;
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  showGrid: boolean;
  soundEnabled: boolean;
  sfxVolume: number;
  ambientMusicEnabled: boolean;
  ambientVolume: number;
  hapticsEnabled: boolean;
  bloomEnabled: boolean;
  bloomIntensity: number;
  
  // Undo / Redo history
  history: Array<Record<string, ConcreteBlockType>>;
  historyIndex: number;
  
  // Stats
  blockCount: number;

  // Actions
  addBlock: (x: number, y: number, z: number, type?: BlockType) => void;
  addBlocksBatch: (coords: Array<[number, number, number]>, type?: BlockType) => void;
  removeBlock: (x: number, y: number, z: number) => void;
  removeBlocksBatch: (coords: Array<[number, number, number]>) => void;
  setMode: (mode: ToolMode) => void;
  setBrushSize: (size: BrushSize) => void;
  setContinuousDrag: (enabled: boolean) => void;
  setSymmetryMode: (symmetry: SymmetryMode) => void;
  cycleSymmetryMode: () => void;
  setSelectedBlock: (block: BlockType) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeather: (weather: WeatherType) => void;
  cycleWeather: () => void;
  setShowGrid: (show: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientMusicEnabled: (enabled: boolean) => void;
  setAmbientVolume: (volume: number) => void;
  toggleAmbientMusic: () => void;
  setHapticsEnabled: (enabled: boolean) => void;
  toggleHaptics: () => void;
  setBloomEnabled: (enabled: boolean) => void;
  setBloomIntensity: (intensity: number) => void;
  toggleBloom: () => void;
  
  setCustomBlockColor: (block: BlockType, color: string) => void;
  applyPastelTheme: (themeId: string) => void;
  resetCustomColors: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  loadPreset: (presetId: string) => void;
  loadRandomPreset: () => void;
  clearWorld: () => void;
  initFromStorage: () => void;

  // Challenge Mode Actions
  setGameMode: (mode: GameMode) => void;
  startChallenge: (challengeId: string) => void;
  startRandomChallenge: () => void;
  exitChallengeToSandbox: () => void;
  restartCurrentChallenge: () => void;
  toggleGhostGuide: () => void;
  closeCelebrationModal: () => void;
  getChallengeProgress: () => ChallengeProgress;
}

// Coordinate string helper
export const coordKey = (x: number, y: number, z: number): string => `${x},${y},${z}`;

// Helper to push history
const pushHistory = (
  history: Array<Record<string, ConcreteBlockType>>,
  index: number,
  newBlocks: Record<string, ConcreteBlockType>
) => {
  const sliced = history.slice(0, index + 1);
  if (sliced.length >= MAX_HISTORY) {
    sliced.shift();
  }
  sliced.push({ ...newBlocks });
  return {
    history: sliced,
    historyIndex: sliced.length - 1,
  };
};

export const evaluateChallengeProgress = (
  currentBlocks: Record<string, ConcreteBlockType>,
  targetBlocks: Record<string, ConcreteBlockType>
): ChallengeProgress => {
  const targetKeys = Object.keys(targetBlocks);
  const total = targetKeys.length;
  let correct = 0;
  let missing = 0;
  let wrong = 0;

  for (const [key, expectedType] of Object.entries(targetBlocks)) {
    const placedType = currentBlocks[key];
    if (placedType === expectedType) {
      correct++;
    } else {
      missing++;
    }
  }

  for (const [key, placedType] of Object.entries(currentBlocks)) {
    const expectedType = targetBlocks[key];
    if (!expectedType || expectedType !== placedType) {
      wrong++;
    }
  }

  const percent = total > 0 ? Math.min(100, Math.round((correct / total) * 100)) : 0;
  const isCompleted = total > 0 && correct === total && wrong === 0;

  return {
    total,
    correct,
    missing,
    wrong,
    percent,
    isCompleted,
  };
};

export const useWorldStore = create<WorldStoreState>((set, get) => {
  const initialBlocks = WORLD_PRESETS[0].blocks;

  const checkAndHandleChallengeCompletion = (currentBlocks: Record<string, ConcreteBlockType>) => {
    const state = get();
    if (state.gameMode !== 'challenge' || !state.activeChallengeId) return;

    const challenge = CHALLENGES.find((c) => c.id === state.activeChallengeId);
    if (!challenge) return;

    const progress = evaluateChallengeProgress(currentBlocks, challenge.targetBlocks);

    if (progress.isCompleted) {
      const alreadyCompleted = state.completedChallengeIds.includes(challenge.id);
      const nextCompleted = alreadyCompleted
        ? state.completedChallengeIds
        : [...state.completedChallengeIds, challenge.id];

      sounds.playVictory();
      haptics.victory();

      set({
        completedChallengeIds: nextCompleted,
        isCelebrationOpen: true,
        lastCompletedChallengeId: challenge.id,
      });

      try {
        localStorage.setItem(COMPLETED_CHALLENGES_STORAGE_KEY, JSON.stringify(nextCompleted));
      } catch (err) {
        console.warn('Failed to save completed challenges to localStorage:', err);
      }
    }
  };

  return {
    language: getInitialLanguage(),
    setLanguage: (lang: Language) => {
      persistLanguage(lang);
      set({ language: lang });
    },
    toggleLanguage: () => {
      const nextLang: Language = get().language === 'it' ? 'en' : 'it';
      persistLanguage(nextLang);
      set({ language: nextLang });
    },

    gameMode: 'sandbox',
    activeChallengeId: null,
    completedChallengeIds: [],
    showGhostGuide: true,
    sandboxBackupBlocks: { ...initialBlocks },
    isCelebrationOpen: false,
    lastCompletedChallengeId: null,

    blocks: initialBlocks,
    customBlockColors: {},
    activeThemeId: 'classic',
    mode: 'build',
    brushSize: 1,
    continuousDrag: false,
    symmetryMode: 'none',
    selectedBlock: 'grass',
    timeOfDay: 'day',
    weather: 'none',
    showGrid: true,
    soundEnabled: true,
    sfxVolume: 0.8,
    ambientMusicEnabled: true,
    ambientVolume: 0.7,
    hapticsEnabled: true,
    bloomEnabled: true,
    bloomIntensity: 0.35,
    history: [{ ...initialBlocks }],
    historyIndex: 0,
    blockCount: Object.keys(initialBlocks).length,

    addBlock: (x: number, y: number, z: number, blockTypeParam?: BlockType) => {
      get().addBlocksBatch([[x, y, z]], blockTypeParam);
    },

    addBlocksBatch: (coords: Array<[number, number, number]>, blockTypeParam?: BlockType) => {
      if (!coords.length) return;
      const type = blockTypeParam || get().selectedBlock;
      const currentBlocks = { ...get().blocks };

      for (const [x, y, z] of coords) {
        if (type === 'tree') {
          // Tree placement: 1 trunk, 3x3 canopy, top cross
          currentBlocks[coordKey(x, y, z)] = 'wood';
          for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
              currentBlocks[coordKey(x + dx, y + 1, z + dz)] = 'leaves';
            }
          }
          currentBlocks[coordKey(x, y + 2, z)] = 'leaves';
          currentBlocks[coordKey(x + 1, y + 2, z)] = 'leaves';
          currentBlocks[coordKey(x - 1, y + 2, z)] = 'leaves';
          currentBlocks[coordKey(x, y + 2, z + 1)] = 'leaves';
          currentBlocks[coordKey(x, y + 2, z - 1)] = 'leaves';

          const treeColor = get().customBlockColors['leaves'] || BLOCK_CONFIGS['leaves']?.color || '#65c474';
          particleEvents.emitPlace([x, y + 1, z], treeColor);
        } else {
          currentBlocks[coordKey(x, y, z)] = type as ConcreteBlockType;
          const blockColor = get().customBlockColors[type as BlockType] || BLOCK_CONFIGS[type as BlockType]?.color || '#84c77d';
          particleEvents.emitPlace([x, y, z], blockColor);
        }
      }

      if (type === 'water') {
        sounds.playWaterSplash(coords.length > 1 ? 1.1 : 1.0);
      } else {
        sounds.playPlaceBlock(coords.length > 1 ? 1.15 : 1.0);
      }
      haptics.place();

      const nextHistory = pushHistory(get().history, get().historyIndex, currentBlocks);

      set({
        blocks: currentBlocks,
        blockCount: Object.keys(currentBlocks).length,
        ...nextHistory,
      });

      checkAndHandleChallengeCompletion(currentBlocks);
    },

    removeBlock: (x: number, y: number, z: number) => {
      get().removeBlocksBatch([[x, y, z]]);
    },

    removeBlocksBatch: (coords: Array<[number, number, number]>) => {
      if (!coords.length) return;
      const currentBlocks = { ...get().blocks };
      let removedCount = 0;

      for (const [x, y, z] of coords) {
        const key = coordKey(x, y, z);
        const existingType = currentBlocks[key];
        if (existingType) {
          const blockColor = get().customBlockColors[existingType] || BLOCK_CONFIGS[existingType]?.color || '#b2bac4';
          particleEvents.emitDestroy([x, y, z], blockColor);
          delete currentBlocks[key];
          removedCount++;
        }
      }

      if (removedCount === 0) return;

      sounds.playDestroyBlock();
      haptics.destroy();

      const nextHistory = pushHistory(get().history, get().historyIndex, currentBlocks);

      set({
        blocks: currentBlocks,
        blockCount: Object.keys(currentBlocks).length,
        ...nextHistory,
      });

      checkAndHandleChallengeCompletion(currentBlocks);
    },

    setMode: (mode: ToolMode) => {
      sounds.playSelect();
      haptics.selection();
      set({ mode });
    },

    setBrushSize: (brushSize: BrushSize) => {
      sounds.playSelect();
      haptics.selection();
      set({ brushSize });
    },

    setContinuousDrag: (continuousDrag: boolean) => {
      sounds.playSelect();
      haptics.medium();
      set({ continuousDrag });
    },

    setSymmetryMode: (symmetryMode: SymmetryMode) => {
      sounds.playSelect();
      haptics.selection();
      set({ symmetryMode });
      try {
        localStorage.setItem(SYMMETRY_STORAGE_KEY, JSON.stringify(symmetryMode));
      } catch (err) {
        console.warn('Failed to save symmetry mode to localStorage:', err);
      }
    },

    cycleSymmetryMode: () => {
      const current = get().symmetryMode;
      const next: SymmetryMode =
        current === 'none' ? 'x' : current === 'x' ? 'z' : current === 'z' ? 'both' : 'none';
      sounds.playSelect();
      haptics.medium();
      set({ symmetryMode: next });
      try {
        localStorage.setItem(SYMMETRY_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save symmetry mode to localStorage:', err);
      }
    },

    setSelectedBlock: (selectedBlock: BlockType) => {
      sounds.playSelect();
      haptics.selection();
      set({ selectedBlock });
    },

    setTimeOfDay: (timeOfDay: TimeOfDay) => {
      sounds.playSelect();
      haptics.selection();
      set({ timeOfDay });
      try {
        localStorage.setItem(TIME_OF_DAY_STORAGE_KEY, JSON.stringify(timeOfDay));
      } catch (err) {
        console.warn('Failed to save timeOfDay setting to localStorage:', err);
      }
    },

    setWeather: (weather: WeatherType) => {
      sounds.playSelect();
      haptics.selection();
      set({ weather });
      try {
        localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weather));
      } catch (err) {
        console.warn('Failed to save weather setting to localStorage:', err);
      }
    },

    cycleWeather: () => {
      const current = get().weather;
      const next: WeatherType =
        current === 'none' ? 'rain' : current === 'rain' ? 'snow' : 'none';
      sounds.playSelect();
      haptics.medium();
      set({ weather: next });
      try {
        localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save weather setting to localStorage:', err);
      }
    },

    setShowGrid: (showGrid: boolean) => {
      haptics.light();
      set({ showGrid });
    },

    setSoundEnabled: (soundEnabled: boolean) => {
      sounds.sfxEnabled = soundEnabled;
      sounds.setSfxVolume(soundEnabled ? (get().sfxVolume || 0.8) : 0);
      haptics.light();
      set({ soundEnabled });
    },

    setSfxVolume: (sfxVolume: number) => {
      sounds.setSfxVolume(sfxVolume);
      haptics.light();
      set({ sfxVolume, soundEnabled: sfxVolume > 0 });
      try {
        localStorage.setItem(SFX_VOLUME_STORAGE_KEY, JSON.stringify(sfxVolume));
      } catch (err) {
        console.warn('Failed to save sfx volume setting to localStorage:', err);
      }
    },

    setAmbientMusicEnabled: (ambientMusicEnabled: boolean) => {
      sounds.setAmbientEnabled(ambientMusicEnabled);
      if (ambientMusicEnabled && get().ambientVolume === 0) {
        sounds.setAmbientVolume(0.7);
        set({ ambientVolume: 0.7 });
      }
      haptics.light();
      set({ ambientMusicEnabled });
      try {
        localStorage.setItem(AMBIENT_MUSIC_STORAGE_KEY, JSON.stringify(ambientMusicEnabled));
      } catch (err) {
        console.warn('Failed to save ambient music setting to localStorage:', err);
      }
    },

    setAmbientVolume: (ambientVolume: number) => {
      sounds.setAmbientVolume(ambientVolume);
      const ambientMusicEnabled = ambientVolume > 0;
      haptics.light();
      set({ ambientVolume, ambientMusicEnabled });
      try {
        localStorage.setItem(AMBIENT_VOLUME_STORAGE_KEY, JSON.stringify(ambientVolume));
        localStorage.setItem(AMBIENT_MUSIC_STORAGE_KEY, JSON.stringify(ambientMusicEnabled));
      } catch (err) {
        console.warn('Failed to save ambient volume setting to localStorage:', err);
      }
    },

    toggleAmbientMusic: () => {
      const nextState = !get().ambientMusicEnabled;
      if (nextState) {
        const targetVol = get().ambientVolume > 0 ? get().ambientVolume : 0.7;
        sounds.setAmbientVolume(targetVol);
        set({ ambientVolume: targetVol, ambientMusicEnabled: true });
      } else {
        sounds.setAmbientEnabled(false);
        set({ ambientMusicEnabled: false });
      }
      haptics.light();
      try {
        localStorage.setItem(AMBIENT_MUSIC_STORAGE_KEY, JSON.stringify(nextState));
      } catch (err) {
        console.warn('Failed to save ambient music setting to localStorage:', err);
      }
    },

    setHapticsEnabled: (enabled: boolean) => {
      haptics.setEnabled(enabled);
      set({ hapticsEnabled: enabled });
    },

    toggleHaptics: () => {
      const next = haptics.toggle();
      set({ hapticsEnabled: next });
    },

    setBloomEnabled: (enabled: boolean) => {
      haptics.light();
      set({ bloomEnabled: enabled });
      try {
        localStorage.setItem(BLOOM_ENABLED_STORAGE_KEY, JSON.stringify(enabled));
      } catch (err) {
        console.warn('Failed to save bloom enabled setting to localStorage:', err);
      }
    },

    setBloomIntensity: (intensity: number) => {
      const clamped = Math.max(0, Math.min(1, intensity));
      haptics.light();
      set({ bloomIntensity: clamped, bloomEnabled: clamped > 0 });
      try {
        localStorage.setItem(BLOOM_INTENSITY_STORAGE_KEY, JSON.stringify(clamped));
        localStorage.setItem(BLOOM_ENABLED_STORAGE_KEY, JSON.stringify(clamped > 0));
      } catch (err) {
        console.warn('Failed to save bloom intensity to localStorage:', err);
      }
    },

    toggleBloom: () => {
      const nextState = !get().bloomEnabled;
      haptics.selection();
      set({ bloomEnabled: nextState });
      try {
        localStorage.setItem(BLOOM_ENABLED_STORAGE_KEY, JSON.stringify(nextState));
      } catch (err) {
        console.warn('Failed to save bloom enabled to localStorage:', err);
      }
    },

    setCustomBlockColor: (block: BlockType, color: string) => {
      const nextColors = {
        ...get().customBlockColors,
        [block]: color,
      };
      sounds.playSelect();
      haptics.selection();
      set({
        customBlockColors: nextColors,
        activeThemeId: 'custom',
      });
      try {
        localStorage.setItem(
          COLORS_STORAGE_KEY,
          JSON.stringify({ colors: nextColors, themeId: 'custom' })
        );
      } catch (err) {
        console.warn('Failed to save colors to localStorage:', err);
      }
    },

    applyPastelTheme: (themeId: string) => {
      const theme = PASTEL_THEME_PRESETS.find((t) => t.id === themeId);
      if (!theme) return;
      sounds.playChime();
      haptics.preset();
      const nextColors = { ...theme.colors };
      set({
        customBlockColors: nextColors,
        activeThemeId: themeId,
      });
      try {
        localStorage.setItem(
          COLORS_STORAGE_KEY,
          JSON.stringify({ colors: nextColors, themeId })
        );
      } catch (err) {
        console.warn('Failed to save colors to localStorage:', err);
      }
    },

    resetCustomColors: () => {
      sounds.playSelect();
      haptics.selection();
      set({
        customBlockColors: {},
        activeThemeId: 'classic',
      });
      try {
        localStorage.removeItem(COLORS_STORAGE_KEY);
      } catch (err) {
        console.warn('Failed to clear colors from localStorage:', err);
      }
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        const restoredBlocks = { ...history[nextIndex] };
        sounds.playSelect();
        haptics.undoRedo();
        set({
          blocks: restoredBlocks,
          historyIndex: nextIndex,
          blockCount: Object.keys(restoredBlocks).length,
        });
        checkAndHandleChallengeCompletion(restoredBlocks);
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        const restoredBlocks = { ...history[nextIndex] };
        sounds.playSelect();
        haptics.undoRedo();
        set({
          blocks: restoredBlocks,
          historyIndex: nextIndex,
          blockCount: Object.keys(restoredBlocks).length,
        });
        checkAndHandleChallengeCompletion(restoredBlocks);
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    loadPreset: (presetId: string) => {
      const preset = WORLD_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      const loadedBlocks = { ...preset.blocks };
      sounds.playChime();
      haptics.preset();

      set({
        blocks: loadedBlocks,
        blockCount: Object.keys(loadedBlocks).length,
        history: [{ ...loadedBlocks }],
        historyIndex: 0,
      });
    },

    loadRandomPreset: () => {
      const validPresets = WORLD_PRESETS.filter((p) => p.id !== 'empty' && p.id !== 'flat');
      if (validPresets.length === 0) return;
      const currentBlocks = get().blocks;
      // Filter out preset if it's identical or pick next random
      const candidatePresets = validPresets.length > 1
        ? validPresets.filter((p) => Object.keys(p.blocks).length !== Object.keys(currentBlocks).length)
        : validPresets;
      const chosenPool = candidatePresets.length > 0 ? candidatePresets : validPresets;
      const randomIndex = Math.floor(Math.random() * chosenPool.length);
      const selectedPreset = chosenPool[randomIndex];

      const loadedBlocks = { ...selectedPreset.blocks };
      sounds.playChime();
      haptics.preset();

      set({
        blocks: loadedBlocks,
        blockCount: Object.keys(loadedBlocks).length,
        history: [{ ...loadedBlocks }],
        historyIndex: 0,
      });
    },

    clearWorld: () => {
      sounds.playDestroyBlock();
      haptics.destroy();
      set({
        blocks: {},
        blockCount: 0,
        history: [{}],
        historyIndex: 0,
      });
    },

    initFromStorage: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            set({
              blocks: parsed,
              sandboxBackupBlocks: { ...parsed },
              blockCount: Object.keys(parsed).length,
              history: [{ ...parsed }],
              historyIndex: 0,
            });
          } else {
            get().loadRandomPreset();
          }
        } else {
          get().loadRandomPreset();
        }
      } catch (err) {
        console.warn('Failed to load voxel world from localStorage:', err);
        get().loadRandomPreset();
      }

      try {
        const savedColors = localStorage.getItem(COLORS_STORAGE_KEY);
        if (savedColors) {
          const parsedColors = JSON.parse(savedColors);
          if (parsedColors && typeof parsedColors === 'object') {
            set({
              customBlockColors: parsedColors.colors || {},
              activeThemeId: parsedColors.themeId || 'custom',
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load custom colors from localStorage:', err);
      }

      try {
        const savedCompleted = localStorage.getItem(COMPLETED_CHALLENGES_STORAGE_KEY);
        if (savedCompleted) {
          const parsedCompleted = JSON.parse(savedCompleted);
          if (Array.isArray(parsedCompleted)) {
            set({ completedChallengeIds: parsedCompleted });
          }
        }
      } catch (err) {
        console.warn('Failed to load completed challenges from localStorage:', err);
      }

      try {
        const savedAmbient = localStorage.getItem(AMBIENT_MUSIC_STORAGE_KEY);
        if (savedAmbient !== null) {
          const parsedAmbient = JSON.parse(savedAmbient);
          if (typeof parsedAmbient === 'boolean') {
            sounds.ambientEnabled = parsedAmbient;
            set({ ambientMusicEnabled: parsedAmbient });
          }
        }
      } catch (err) {
        console.warn('Failed to load ambient music setting from localStorage:', err);
      }

      try {
        const savedAmbientVol = localStorage.getItem(AMBIENT_VOLUME_STORAGE_KEY);
        if (savedAmbientVol !== null) {
          const parsedVol = JSON.parse(savedAmbientVol);
          if (typeof parsedVol === 'number' && !isNaN(parsedVol)) {
            sounds.setAmbientVolume(parsedVol);
            set({ ambientVolume: parsedVol, ambientMusicEnabled: parsedVol > 0 });
          }
        }
      } catch (err) {
        console.warn('Failed to load ambient volume from localStorage:', err);
      }

      try {
        const savedSfxVol = localStorage.getItem(SFX_VOLUME_STORAGE_KEY);
        if (savedSfxVol !== null) {
          const parsedSfxVol = JSON.parse(savedSfxVol);
          if (typeof parsedSfxVol === 'number' && !isNaN(parsedSfxVol)) {
            sounds.setSfxVolume(parsedSfxVol);
            set({ sfxVolume: parsedSfxVol, soundEnabled: parsedSfxVol > 0 });
          }
        }
      } catch (err) {
        console.warn('Failed to load sfx volume from localStorage:', err);
      }

      try {
        const savedHaptics = localStorage.getItem(HAPTICS_STORAGE_KEY);
        if (savedHaptics !== null) {
          const parsedHaptics = JSON.parse(savedHaptics);
          if (typeof parsedHaptics === 'boolean') {
            haptics.enabled = parsedHaptics;
            set({ hapticsEnabled: parsedHaptics });
          }
        }
      } catch (err) {
        console.warn('Failed to load haptics setting from localStorage:', err);
      }

      try {
        const savedWeather = localStorage.getItem(WEATHER_STORAGE_KEY);
        if (savedWeather !== null) {
          const parsedWeather = JSON.parse(savedWeather);
          if (parsedWeather === 'none' || parsedWeather === 'rain' || parsedWeather === 'snow') {
            set({ weather: parsedWeather });
          }
        }
      } catch (err) {
        console.warn('Failed to load weather setting from localStorage:', err);
      }

      try {
        const savedSymmetry = localStorage.getItem(SYMMETRY_STORAGE_KEY);
        if (savedSymmetry !== null) {
          const parsedSymmetry = JSON.parse(savedSymmetry);
          if (
            parsedSymmetry === 'none' ||
            parsedSymmetry === 'x' ||
            parsedSymmetry === 'z' ||
            parsedSymmetry === 'both'
          ) {
            set({ symmetryMode: parsedSymmetry });
          }
        }
      } catch (err) {
        console.warn('Failed to load symmetry setting from localStorage:', err);
      }

      try {
        const savedTimeOfDay = localStorage.getItem(TIME_OF_DAY_STORAGE_KEY);
        if (savedTimeOfDay !== null) {
          const parsedTime = JSON.parse(savedTimeOfDay);
          if (
            parsedTime === 'sunrise' ||
            parsedTime === 'noon' ||
            parsedTime === 'twilight' ||
            parsedTime === 'night' ||
            parsedTime === 'day' ||
            parsedTime === 'sunset'
          ) {
            set({ timeOfDay: parsedTime });
          }
        }
      } catch (err) {
        console.warn('Failed to load timeOfDay setting from localStorage:', err);
      }

      try {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'it' || savedLanguage === 'en') {
          set({ language: savedLanguage });
        } else {
          set({ language: getInitialLanguage() });
        }
      } catch (err) {
        console.warn('Failed to load language from localStorage:', err);
      }

      try {
        const savedBloom = localStorage.getItem(BLOOM_ENABLED_STORAGE_KEY);
        if (savedBloom !== null) {
          const parsedBloom = JSON.parse(savedBloom);
          if (typeof parsedBloom === 'boolean') {
            set({ bloomEnabled: parsedBloom });
          }
        }
      } catch (err) {
        console.warn('Failed to load bloomEnabled from localStorage:', err);
      }

      try {
        const savedIntensity = localStorage.getItem(BLOOM_INTENSITY_STORAGE_KEY);
        if (savedIntensity !== null) {
          const parsedIntensity = JSON.parse(savedIntensity);
          if (typeof parsedIntensity === 'number' && !isNaN(parsedIntensity)) {
            set({ bloomIntensity: Math.max(0, Math.min(1, parsedIntensity)) });
          }
        }
      } catch (err) {
        console.warn('Failed to load bloomIntensity from localStorage:', err);
      }
    },

    // Challenge Mode Handlers
    setGameMode: (gameMode: GameMode) => {
      if (gameMode === get().gameMode) return;
      sounds.playSelect();

      if (gameMode === 'challenge') {
        get().startRandomChallenge();
      } else {
        get().exitChallengeToSandbox();
      }
    },

    startChallenge: (challengeId: string) => {
      const challenge = CHALLENGES.find((c) => c.id === challengeId);
      if (!challenge) return;

      sounds.playChime();

      // If switching from sandbox, backup sandbox blocks
      const currentBlocks = get().blocks;
      const backup = get().gameMode === 'sandbox' ? { ...currentBlocks } : get().sandboxBackupBlocks;

      set({
        gameMode: 'challenge',
        activeChallengeId: challenge.id,
        sandboxBackupBlocks: backup,
        blocks: {},
        blockCount: 0,
        history: [{}],
        historyIndex: 0,
        isCelebrationOpen: false,
      });
    },

    startRandomChallenge: () => {
      const { completedChallengeIds, activeChallengeId } = get();
      // First try to find uncompleted challenges
      const uncompleted = CHALLENGES.filter((c) => !completedChallengeIds.includes(c.id) && c.id !== activeChallengeId);
      const candidateList = uncompleted.length > 0
        ? uncompleted
        : CHALLENGES.filter((c) => c.id !== activeChallengeId);

      const target = candidateList.length > 0
        ? candidateList[Math.floor(Math.random() * candidateList.length)]
        : CHALLENGES[0];

      get().startChallenge(target.id);
    },

    exitChallengeToSandbox: () => {
      sounds.playSelect();
      const restored = { ...get().sandboxBackupBlocks };
      set({
        gameMode: 'sandbox',
        activeChallengeId: null,
        blocks: restored,
        blockCount: Object.keys(restored).length,
        history: [{ ...restored }],
        historyIndex: 0,
        isCelebrationOpen: false,
      });
    },

    restartCurrentChallenge: () => {
      sounds.playDestroyBlock();
      set({
        blocks: {},
        blockCount: 0,
        history: [{}],
        historyIndex: 0,
        isCelebrationOpen: false,
      });
    },

    toggleGhostGuide: () => {
      sounds.playSelect();
      set((s) => ({ showGhostGuide: !s.showGhostGuide }));
    },

    closeCelebrationModal: () => {
      set({ isCelebrationOpen: false });
    },

    getChallengeProgress: () => {
      const { gameMode, activeChallengeId, blocks } = get();
      if (gameMode !== 'challenge' || !activeChallengeId) {
        return { total: 0, correct: 0, missing: 0, wrong: 0, percent: 0, isCompleted: false };
      }
      const challenge = CHALLENGES.find((c) => c.id === activeChallengeId);
      if (!challenge) {
        return { total: 0, correct: 0, missing: 0, wrong: 0, percent: 0, isCompleted: false };
      }
      return evaluateChallengeProgress(blocks, challenge.targetBlocks);
    },
  };
});

