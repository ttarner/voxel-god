import {
  Hammer,
  Trophy,
  Sparkles,
  Palette,
  Settings,
  Volume2,
  VolumeX,
  Languages,
  Shuffle,
  ChevronRight,
} from 'lucide-react';
import { useWorldStore } from '../store/worldStore';
import { sounds } from '../utils/audio';
import { t } from '../utils/i18n';
import { PerspectiveVoxelCube } from './TopBar';

interface InitialModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
  onOpenPresets: () => void;
  onOpenColors: () => void;
  onOpenCollection: () => void;
}

export function InitialModeModal({
  isOpen,
  onClose,
  onOpenHelp,
  onOpenPresets,
  onOpenColors,
  onOpenCollection,
}: InitialModeModalProps) {
  const language = useWorldStore((state) => state.language);
  const toggleLanguage = useWorldStore((state) => state.toggleLanguage);
  const loadRandomPreset = useWorldStore((state) => state.loadRandomPreset);
  const soundEnabled = useWorldStore((state) => state.soundEnabled);
  const setSoundEnabled = useWorldStore((state) => state.setSoundEnabled);
  const gameMode = useWorldStore((state) => state.gameMode);
  const exitChallengeToSandbox = useWorldStore((state) => state.exitChallengeToSandbox);

  if (!isOpen) return null;

  const handleSelectSandbox = () => {
    sounds.playSelect();
    if (gameMode !== 'sandbox') {
      exitChallengeToSandbox();
    }
    onClose();
  };

  const handleOpenChallenges = () => {
    sounds.playChime();
    onOpenCollection();
  };

  const handleOpenPresets = () => {
    sounds.playSelect();
    onOpenPresets();
  };

  const handleOpenColors = () => {
    sounds.playSelect();
    onOpenColors();
  };

  const handleOptions = () => {
    sounds.playSelect();
    onOpenHelp();
  };

  const handleShuffleBackground = () => {
    loadRandomPreset();
  };

  return (
    <div
      id="main-menu-overlay"
      className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-3 sm:p-6 select-none bg-transparent safe-top-padding safe-bottom-padding safe-left-padding safe-right-padding"
    >
      {/* Top Floating Modules - Direct floating elements, no dark overlay or window */}
      <div className="w-full flex items-start justify-between gap-2 pointer-events-none">
        {/* Top-Left: Brand Badge matched with TopBar aesthetic */}
        <div
          id="menu-brand-tag"
          className="pointer-events-auto flex items-center gap-2 bg-[#D1FAE5]/95 dark:bg-[#064E3B]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-pastel-mint border border-[#A7F3D0] dark:border-[#059669]/70"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white/90 dark:bg-emerald-900/90 shadow-pastel-btn flex items-center justify-center shrink-0">
            <PerspectiveVoxelCube className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-[#065F46] dark:text-[#A7F3D0] leading-tight font-sans">
              VOXEL STUDIO
            </span>
            <span className="text-[9px] font-bold tracking-tight text-[#047857] dark:text-[#6EE7B7] uppercase">
              PASTEL 3D
            </span>
          </div>
        </div>

        {/* Top-Right: Utility Controls unified with TopBar button styles */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5">
          {/* Shuffle 3D Model */}
          <button
            id="btn-menu-shuffle-model"
            type="button"
            onClick={handleShuffleBackground}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn text-xs font-bold transition-all active:scale-95 touch-manipulation backdrop-blur-md"
            title={t('menuShuffleBg', language)}
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline text-[11px]">{t('menuShuffleBg', language)}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-menu-toggle-audio"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn text-xs font-bold transition-all active:scale-95 touch-manipulation backdrop-blur-md"
            title={soundEnabled ? t('soundMute', language) : t('soundOn', language)}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline text-[11px]">{soundEnabled ? 'Audio' : 'Muto'}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="btn-menu-toggle-lang"
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn text-xs font-bold transition-all active:scale-95 touch-manipulation backdrop-blur-md"
            title={`${t('language', language)}: ${language === 'it' ? 'Italiano' : 'English'}`}
          >
            <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="uppercase font-black text-[11px]">{language === 'it' ? 'IT' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Center: Minimal rectangular buttons floating directly over the 3D scene */}
      {/* NO background window, NO container card, styled identically to the app's tactile buttons */}
      <div className="my-auto mx-auto flex flex-col items-center gap-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
        {/* Button 1: Creazione Libera */}
        <button
          id="btn-menu-sandbox"
          type="button"
          onClick={handleSelectSandbox}
          className="pointer-events-auto w-48 sm:w-52 h-9 sm:h-9.5 px-3 rounded-xl bg-white/85 dark:bg-[#1E2633]/85 hover:bg-white dark:hover:bg-[#283344] text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn backdrop-blur-md flex items-center justify-between text-xs font-bold transition-all active:scale-95 touch-manipulation group"
        >
          <div className="flex items-center gap-2.5">
            <Hammer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('freeCreation', language)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Button 2: Sfide 3D */}
        <button
          id="btn-menu-challenges"
          type="button"
          onClick={handleOpenChallenges}
          className="pointer-events-auto w-48 sm:w-52 h-9 sm:h-9.5 px-3 rounded-xl bg-white/85 dark:bg-[#1E2633]/85 hover:bg-white dark:hover:bg-[#283344] text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn backdrop-blur-md flex items-center justify-between text-xs font-bold transition-all active:scale-95 touch-manipulation group"
        >
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t('challengesTitle', language)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Button 3: Preset Mondi */}
        <button
          id="btn-menu-presets"
          type="button"
          onClick={handleOpenPresets}
          className="pointer-events-auto w-48 sm:w-52 h-9 sm:h-9.5 px-3 rounded-xl bg-white/85 dark:bg-[#1E2633]/85 hover:bg-white dark:hover:bg-[#283344] text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn backdrop-blur-md flex items-center justify-between text-xs font-bold transition-all active:scale-95 touch-manipulation group"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{t('presetsBtn', language)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Button 4: Tavolozza Colori */}
        <button
          id="btn-menu-colors"
          type="button"
          onClick={handleOpenColors}
          className="pointer-events-auto w-48 sm:w-52 h-9 sm:h-9.5 px-3 rounded-xl bg-white/85 dark:bg-[#1E2633]/85 hover:bg-white dark:hover:bg-[#283344] text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn backdrop-blur-md flex items-center justify-between text-xs font-bold transition-all active:scale-95 touch-manipulation group"
        >
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            <span>{t('paletteBtn', language)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Button 5: Opzioni */}
        <button
          id="btn-menu-options"
          type="button"
          onClick={handleOptions}
          className="pointer-events-auto w-48 sm:w-52 h-9 sm:h-9.5 px-3 rounded-xl bg-white/85 dark:bg-[#1E2633]/85 hover:bg-white dark:hover:bg-[#283344] text-slate-700 dark:text-slate-200 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn backdrop-blur-md flex items-center justify-between text-xs font-bold transition-all active:scale-95 touch-manipulation group"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{t('menuOptions', language)}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Floating Minimal Hint: Matching the app's pill styling */}
      <div className="w-full flex items-center justify-center pointer-events-none">
        <span className="pointer-events-auto text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-[#1E2633]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-pastel-btn border border-[#D3DFEB] dark:border-[#2D384B]">
          {language === 'it'
            ? 'Trascina per ruotare la scena 3D'
            : 'Drag to orbit the 3D scene'}
        </span>
      </div>
    </div>
  );
}
