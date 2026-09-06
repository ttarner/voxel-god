import { useState, useRef, useEffect } from 'react';
import { useWorldStore } from '../store/worldStore';
import { CHALLENGES } from '../utils/challenges';
import {
  Undo2,
  Redo2,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Grid,
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  Sparkles,
  HelpCircle,
  Palette,
  Camera,
  Check,
  Trophy,
  Gamepad2,
  Layers,
  MoreHorizontal,
  CloudRain,
  CloudSnow,
  CloudSun,
  ChevronDown,
  LayoutGrid,
  Languages,
} from 'lucide-react';
import { TimeOfDay } from '../types';
import { captureSceneSnapshot } from '../utils/snapshotUtils';
import { haptics } from '../utils/haptics';
import { EnvironmentMenu } from './EnvironmentMenu';
import { normalizeTimeOfDay, ENVIRONMENT_PRESETS } from '../utils/environmentPresets';
import { t } from '../utils/i18n';

// Stylized 3D Perspective Isometric Cube Logo
export function PerspectiveVoxelCube({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Face - Delicate Mint Highlight */}
      <path d="M12 2.5L20.5 7.4L12 12.3L3.5 7.4L12 2.5Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Left Face - Soft Teal Face */}
      <path d="M3.5 7.4L12 12.3V21.5L3.5 16.6V7.4Z" fill="#34D399" stroke="#059669" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Right Face - Vibrant Mint Shade */}
      <path d="M20.5 7.4L12 12.3V21.5L20.5 16.6V7.4Z" fill="#10B981" stroke="#059669" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

// Stylized Soft Pastel Sun Icon
function StylizedPastelSun({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5M5.28 5.28L7.05 7.05M16.95 16.95L18.72 18.72M5.28 18.72L7.05 16.95M16.95 7.05L18.72 5.28" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface TopBarProps {
  onOpenPresets: () => void;
  onOpenHelp: () => void;
  onOpenColors: () => void;
  onOpenCollection: () => void;
  onOpenInitialScreen: () => void;
}

export function TopBar({
  onOpenPresets,
  onOpenHelp,
  onOpenColors,
  onOpenCollection,
  onOpenInitialScreen,
}: TopBarProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSuccess, setCapturedSuccess] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEnvironmentMenuOpen, setIsEnvironmentMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const language = useWorldStore((state) => state.language);
  const toggleLanguage = useWorldStore((state) => state.toggleLanguage);
  const gameMode = useWorldStore((state) => state.gameMode);
  const completedChallengeIds = useWorldStore((state) => state.completedChallengeIds);
  const timeOfDay = useWorldStore((state) => state.timeOfDay);
  const setTimeOfDay = useWorldStore((state) => state.setTimeOfDay);
  const weather = useWorldStore((state) => state.weather);
  const cycleWeather = useWorldStore((state) => state.cycleWeather);
  const showGrid = useWorldStore((state) => state.showGrid);
  const setShowGrid = useWorldStore((state) => state.setShowGrid);
  const soundEnabled = useWorldStore((state) => state.soundEnabled);
  const setSoundEnabled = useWorldStore((state) => state.setSoundEnabled);
  const ambientMusicEnabled = useWorldStore((state) => state.ambientMusicEnabled);
  const toggleAmbientMusic = useWorldStore((state) => state.toggleAmbientMusic);
  const hapticsEnabled = useWorldStore((state) => state.hapticsEnabled);
  const toggleHaptics = useWorldStore((state) => state.toggleHaptics);
  const undo = useWorldStore((state) => state.undo);
  const redo = useWorldStore((state) => state.redo);
  const historyIndex = useWorldStore((state) => state.historyIndex);
  const historyLength = useWorldStore((state) => state.history.length);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSnapshot = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    haptics.snapshot();
    try {
      const result = await captureSceneSnapshot();
      if (result.success) {
        setCapturedSuccess(true);
        setTimeout(() => setCapturedSuccess(false), 2000);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const getTimeIcon = (className = 'w-3.5 h-3.5') => {
    const currentNorm = normalizeTimeOfDay(timeOfDay);
    switch (currentNorm) {
      case 'sunrise':
        return <Sunrise className={`${className} text-amber-500`} />;
      case 'noon':
        return <Sun className={`${className} text-sky-500`} />;
      case 'twilight':
        return <Sunset className={`${className} text-orange-500`} />;
      case 'night':
        return <Moon className={`${className} text-indigo-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  const getCurrentPresetName = () => {
    const currentNorm = normalizeTimeOfDay(timeOfDay);
    switch (currentNorm) {
      case 'sunrise':
        return t('sunrise', language);
      case 'noon':
        return t('noon', language);
      case 'twilight':
        return t('twilight', language);
      case 'night':
        return t('night', language);
      default:
        return t('noon', language);
    }
  };

  const getWeatherName = () => {
    switch (weather) {
      case 'rain':
        return t('weatherRain', language);
      case 'snow':
        return t('weatherSnow', language);
      case 'none':
      default:
        return t('weatherClear', language);
    }
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-sky-500" />;
      case 'snow':
        return <CloudSnow className="w-3.5 h-3.5 text-cyan-400" />;
      case 'none':
      default:
        return <CloudSun className="w-3.5 h-3.5 text-amber-500/80" />;
    }
  };

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4 select-none safe-top-padding safe-left-padding safe-right-padding gap-1.5">
      {/* Left Module: Pastel Mint Green Frame sculpted directly into the frame */}
      <div className="pointer-events-auto flex items-center gap-2 bg-[#D1FAE5]/95 dark:bg-[#064E3B]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-pastel-mint border border-[#A7F3D0] dark:border-[#059669]/70">
        <button
          id="btn-open-initial-screen-topbar"
          type="button"
          onClick={onOpenInitialScreen}
          className="flex items-center gap-2 group transition-all touch-manipulation text-left"
          title={`${t('initialScreen', language)}: ${t('menu', language)}`}
        >
          {/* Stylized 3D Perspective Cube Logo */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white/90 dark:bg-emerald-900/90 shadow-pastel-btn flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <PerspectiveVoxelCube className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-[#065F46] dark:text-[#A7F3D0] leading-tight font-sans">
              VOXEL STUDIO
            </span>
            <span className="text-[9px] font-bold tracking-tight text-[#047857] dark:text-[#6EE7B7] uppercase">
              {gameMode === 'sandbox' ? 'MENU | LIBERA' : 'MENU | SFIDE'}
            </span>
          </div>
        </button>

        {gameMode === 'challenge' && (
          <button
            id="btn-open-collection-topbar"
            type="button"
            onClick={onOpenCollection}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FED7AA]/90 dark:bg-[#7C2D12]/70 text-[#9A3412] dark:text-[#FDBA74] hover:bg-[#FDBA74] transition-all touch-manipulation shadow-pastel-btn ml-0.5"
            title={t('collectionTitle', language)}
          >
            <Trophy className="w-3.5 h-3.5 text-[#EA580C] dark:text-[#FB923C]" />
            <span className="text-[10px] font-black">
              {completedChallengeIds.length}/{CHALLENGES.length}
            </span>
          </button>
        )}
      </div>

      {/* Right Module: Pastel Blue-Grey Sculpted Controls */}
      <div
        ref={menuRef}
        className="pointer-events-auto relative flex items-center gap-0.5 sm:gap-1 bg-[#E8EFF5]/95 dark:bg-[#1E2633]/95 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B]"
      >
        {/* Undo */}
        <button
          id="btn-undo"
          type="button"
          disabled={!canUndo}
          onClick={undo}
          title={t('undo', language)}
          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 shadow-pastel-btn disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none transition-all touch-manipulation"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          id="btn-redo"
          type="button"
          disabled={!canRedo}
          onClick={redo}
          title={t('redo', language)}
          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 shadow-pastel-btn disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none transition-all touch-manipulation"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Desktop / Tablet Full Controls */}
        <div className="hidden sm:flex items-center gap-0.5 sm:gap-1">
          {/* Environment / Ambient Light Sub-Menu Trigger with Stylized Pastel Sun */}
          <button
            id="btn-environment-menu-desktop"
            type="button"
            onClick={() => setIsEnvironmentMenuOpen(!isEnvironmentMenuOpen)}
            title={`${t('environmentTitle', language)}: ${getCurrentPresetName()}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all touch-manipulation shadow-pastel-btn border ${
              isEnvironmentMenuOpen
                ? 'bg-[#FEF3C7] dark:bg-[#78350F]/70 text-[#92400E] dark:text-[#FDE68A] border-[#FCD34D] dark:border-[#B45309]'
                : 'bg-white/80 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <StylizedPastelSun className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline text-[11px] font-bold">{t('environment', language)}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isEnvironmentMenuOpen ? 'rotate-180 text-amber-600' : 'text-amber-500'}`} />
          </button>

          {/* Weather Cycle Quick Toggle */}
          <button
            id="btn-toggle-weather-desktop"
            type="button"
            onClick={cycleWeather}
            title={`${t('weatherTitle', language)}: ${getWeatherName()}`}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-all touch-manipulation bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 ${
              weather === 'rain'
                ? 'text-sky-600 dark:text-sky-400 bg-sky-100/80 dark:bg-sky-950/60'
                : weather === 'snow'
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-100/80 dark:bg-cyan-950/60'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {getWeatherIcon()}
          </button>

          {/* Grid Toggle */}
          <button
            id="btn-toggle-grid-desktop"
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            title={showGrid ? t('gridHide', language) : t('gridShow', language)}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-all touch-manipulation ${
              showGrid
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60'
                : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 bg-white/60 dark:bg-slate-800/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Sound Effects Toggle */}
          <button
            id="btn-toggle-sound-desktop"
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={`${t('sfxTitle', language)}: ${soundEnabled ? t('active', language) : t('disabled', language)}`}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-all touch-manipulation ${
              soundEnabled
                ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60'
                : 'text-slate-400 opacity-60 bg-white/50 dark:bg-slate-800/50'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Ambient Soundscape Music Toggle */}
          <button
            id="btn-toggle-ambient-desktop"
            type="button"
            onClick={toggleAmbientMusic}
            title={`${t('ambientMusicTitle', language)}: ${ambientMusicEnabled ? t('active', language) : t('disabled', language)}`}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-all touch-manipulation relative ${
              ambientMusicEnabled
                ? 'text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/60'
                : 'text-slate-400 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            {ambientMusicEnabled && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            )}
          </button>

          {/* Language Switcher Button on Desktop */}
          <button
            id="btn-toggle-language-desktop"
            type="button"
            onClick={toggleLanguage}
            title={`${t('language', language)}: ${language === 'it' ? 'Italiano' : 'English'}`}
            className="flex items-center gap-1 px-2 py-1 rounded-xl shadow-pastel-btn text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all touch-manipulation"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="uppercase">{language === 'it' ? 'IT' : 'EN'}</span>
          </button>

          {/* Color Studio in Soft Pastel Lavender */}
          <button
            id="btn-open-colors-topbar-desktop"
            type="button"
            onClick={onOpenColors}
            title={t('colorStudio', language)}
            className="p-1.5 rounded-xl shadow-pastel-btn text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all touch-manipulation"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Snapshot Button */}
          <button
            id="btn-take-snapshot-desktop"
            type="button"
            onClick={handleSnapshot}
            disabled={isCapturing}
            title={t('takeSnapshot', language)}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-all touch-manipulation ${
              capturedSuccess
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 scale-105'
                : 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60'
            }`}
          >
            {capturedSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Camera className={`w-3.5 h-3.5 ${isCapturing ? 'animate-pulse' : ''}`} />
            )}
          </button>

          {/* Presets Modal */}
          {gameMode === 'sandbox' && (
            <button
              id="btn-open-presets-desktop"
              type="button"
              onClick={onOpenPresets}
              title={t('worldTemplates', language)}
              className="p-1.5 rounded-xl shadow-pastel-btn text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all touch-manipulation"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Help Modal */}
          <button
            id="btn-open-help-desktop"
            type="button"
            onClick={onOpenHelp}
            title={t('helpAndInfo', language)}
            className="p-1.5 rounded-xl shadow-pastel-btn text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 transition-all touch-manipulation"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Quick Trigger: Environment / Palette / More */}
        <div className="flex sm:hidden items-center gap-0.5">
          <button
            id="btn-environment-menu-mobile"
            type="button"
            onClick={() => {
              setIsEnvironmentMenuOpen(!isEnvironmentMenuOpen);
              setIsMenuOpen(false);
            }}
            title={`${t('environmentTitle', language)}: ${getCurrentPresetName()}`}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-colors touch-manipulation ${
              isEnvironmentMenuOpen
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                : 'text-amber-600 bg-white/70 dark:bg-slate-800/70'
            }`}
          >
            <StylizedPastelSun className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-open-colors-mobile"
            type="button"
            onClick={onOpenColors}
            title={t('colorStudio', language)}
            className="p-1.5 rounded-xl shadow-pastel-btn text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 transition-colors touch-manipulation"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Mobile 3-Dots Menu Trigger */}
          <button
            id="btn-topbar-mobile-menu"
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsEnvironmentMenuOpen(false);
            }}
            className={`p-1.5 rounded-xl shadow-pastel-btn transition-colors touch-manipulation ${
              isMenuOpen
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={t('menu', language)}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full right-0 mt-2 w-56 bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 backdrop-blur-lg rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-2 flex flex-col gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              id="btn-open-initial-screen-mobile"
              type="button"
              onClick={() => {
                onOpenInitialScreen();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#065F46] dark:text-[#A7F3D0] bg-[#D1FAE5] dark:bg-[#064E3B]/80 shadow-pastel-btn hover:bg-[#A7F3D0] transition-all"
            >
              <div className="flex items-center gap-2">
                <PerspectiveVoxelCube className="w-4 h-4" />
                <span>{t('initialScreen', language)}</span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-wider text-[#047857] dark:text-[#6EE7B7]">{t('menu', language)}</span>
            </button>

            {/* Language Switcher in Mobile Menu */}
            <button
              id="btn-toggle-language-mobile"
              type="button"
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Languages className="w-3.5 h-3.5 text-sky-500" />
                <span>{t('language', language)}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold uppercase">
                {language === 'it' ? 'Italiano (IT)' : 'English (EN)'}
              </span>
            </button>

            <button
              id="btn-open-environment-from-mobile-menu"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsEnvironmentMenuOpen(true);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {getTimeIcon('w-3.5 h-3.5')}
                <span>{t('environment', language)}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                {getCurrentPresetName()}
              </span>
            </button>

            <button
              id="btn-toggle-weather-mobile"
              type="button"
              onClick={() => {
                cycleWeather();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {getWeatherIcon()}
              <span>{t('weather', language)}: {getWeatherName()}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowGrid(!showGrid);
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('grid', language)}: {showGrid ? t('visible', language) : t('hidden', language)}</span>
            </button>

            <button
              id="btn-toggle-sound-mobile"
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{t('sfxTitle', language)}: {soundEnabled ? t('active', language) : t('disabled', language)}</span>
            </button>

            <button
              id="btn-toggle-ambient-mobile"
              type="button"
              onClick={() => {
                toggleAmbientMusic();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Music className={`w-3.5 h-3.5 ${ambientMusicEnabled ? 'text-violet-500' : 'text-slate-400'}`} />
              <div className="flex items-center gap-1.5 flex-1 justify-between">
                <span>{t('ambientMusicTitle', language)}: {ambientMusicEnabled ? t('active', language) : t('disabled', language)}</span>
                {ambientMusicEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                )}
              </div>
            </button>

            <button
              id="btn-toggle-haptics-mobile"
              type="button"
              onClick={() => {
                toggleHaptics();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Vibrate className={`w-3.5 h-3.5 ${hapticsEnabled ? 'text-pink-500' : 'text-slate-400'}`} />
              <span>{t('hapticsTitle', language)}: {hapticsEnabled ? t('active', language) : t('disabled', language)}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleSnapshot();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-sky-500" />
              <span>{t('takeSnapshot', language)}</span>
            </button>

            {gameMode === 'sandbox' && (
              <button
                type="button"
                onClick={() => {
                  onOpenPresets();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('worldTemplates', language)}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenHelp();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('helpAndInfo', language)}</span>
            </button>
          </div>
        )}

        {/* Environment Sub-Menu Dropdown */}
        <EnvironmentMenu
          isOpen={isEnvironmentMenuOpen}
          onClose={() => setIsEnvironmentMenuOpen(false)}
        />
      </div>
    </div>
  );
}
