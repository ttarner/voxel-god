import { X, Hand, Move, ZoomIn, Vibrate, Sparkles, Boxes, Paintbrush, CloudSun, CloudRain, FlipHorizontal, Volume2, Music, Sliders } from 'lucide-react';
import { useWorldStore } from '../store/worldStore';
import { t } from '../utils/i18n';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const language = useWorldStore((state) => state.language);
  const ambientVolume = useWorldStore((state) => state.ambientVolume);
  const sfxVolume = useWorldStore((state) => state.sfxVolume);
  const setAmbientVolume = useWorldStore((state) => state.setAmbientVolume);
  const setSfxVolume = useWorldStore((state) => state.setSfxVolume);
  const bloomEnabled = useWorldStore((state) => state.bloomEnabled);
  const bloomIntensity = useWorldStore((state) => state.bloomIntensity);
  const setBloomIntensity = useWorldStore((state) => state.setBloomIntensity);
  const toggleBloom = useWorldStore((state) => state.toggleBloom);

  if (!isOpen) return null;

  const gestures = [
    {
      icon: <CloudSun className="w-4 h-4 text-amber-500" />,
      title: t('helpEnvironmentTitle', language),
      desc: t('helpEnvironmentDesc', language),
    },
    {
      icon: <FlipHorizontal className="w-4 h-4 text-purple-500" />,
      title: t('helpSymmetryTitle', language),
      desc: t('helpSymmetryDesc', language),
    },
    {
      icon: <Boxes className="w-4 h-4 text-indigo-500" />,
      title: t('helpBrushTitle', language),
      desc: t('helpBrushDesc', language),
    },
    {
      icon: <Paintbrush className="w-4 h-4 text-amber-500" />,
      title: t('helpDragTitle', language),
      desc: t('helpDragDesc', language),
    },
    {
      icon: <CloudRain className="w-4 h-4 text-sky-500" />,
      title: t('helpWeatherTitle', language),
      desc: t('helpWeatherDesc', language),
    },
    {
      icon: <Vibrate className="w-4 h-4 text-pink-500" />,
      title: t('helpHapticsTitle', language),
      desc: t('helpHapticsDesc', language),
    },
    {
      icon: <Hand className="w-4 h-4 text-emerald-500" />,
      title: t('helpRotateTitle', language),
      desc: t('helpRotateDesc', language),
    },
    {
      icon: <Move className="w-4 h-4 text-sky-500" />,
      title: t('helpPanTitle', language),
      desc: t('helpPanDesc', language),
    },
    {
      icon: <ZoomIn className="w-4 h-4 text-purple-500" />,
      title: t('helpZoomTitle', language),
      desc: t('helpZoomDesc', language),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 text-slate-800 dark:text-slate-100 rounded-3xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-4 sm:p-5 overflow-hidden my-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D3DFEB]/70 dark:border-[#2D384B]/70 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              {t('helpTitle', language)}
            </h2>
          </div>
          <button
            id="btn-close-help"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-pastel-btn transition-all touch-manipulation"
            title={t('close', language)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="mt-3 flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
          {/* Audio & Volume Settings Panel */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-white/80 dark:border-slate-700/80 shadow-pastel-btn flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DFEB]/60 dark:border-[#2D384B]/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#EEF2FF] dark:bg-[#312E81] text-[#4338CA] dark:text-[#C7D2FE] shadow-2xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {t('audioSettingsTitle', language)}
                </h3>
              </div>
            </div>

            {/* Ambient Music Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Music className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{t('ambientMusicLabel', language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[11px] text-[#10B981] w-9 text-right">
                    {Math.round(ambientVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVol = ambientVolume > 0 ? 0 : 0.7;
                      setAmbientVolume(nextVol);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all shadow-pastel-btn ${
                      ambientVolume > 0
                        ? 'bg-[#D1FAE5] dark:bg-[#064E3B] text-[#065F46] dark:text-[#A7F3D0]'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {ambientVolume > 0 ? t('soundOn', language) : t('soundMute', language)}
                  </button>
                </div>
              </div>
              <input
                id="slider-ambient-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#10B981] touch-manipulation"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {t('ambientVolumeDesc', language)}
              </span>
            </div>

            {/* Sound Effects (SFX) Slider */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#D3DFEB]/60 dark:border-[#2D384B]/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('sfxLabel', language)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[11px] text-amber-600 dark:text-amber-400 w-9 text-right">
                    {Math.round(sfxVolume * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVol = sfxVolume > 0 ? 0 : 0.8;
                      setSfxVolume(nextVol);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all shadow-pastel-btn ${
                      sfxVolume > 0
                        ? 'bg-[#FEF3C7] dark:bg-[#78350F] text-[#92400E] dark:text-[#FDE68A]'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {sfxVolume > 0 ? t('soundOn', language) : t('soundMute', language)}
                  </button>
                </div>
              </div>
              <input
                id="slider-sfx-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F59E0B] touch-manipulation"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {t('sfxVolumeDesc', language)}
              </span>
            </div>
          </div>

          {/* Graphics & Aesthetics (Dreamy Bloom) Panel */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-white/80 dark:border-slate-700/80 shadow-pastel-btn flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D3DFEB]/60 dark:border-[#2D384B]/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#FDF2F8] dark:bg-[#831843]/40 text-[#DB2777] dark:text-[#FBCFE8] shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                  {t('graphicsSettingsTitle', language)}
                </h3>
              </div>
              <button
                type="button"
                onClick={toggleBloom}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all shadow-pastel-btn flex items-center gap-1 ${
                  bloomEnabled
                    ? 'bg-[#FCE7F3] dark:bg-[#9D174D] text-[#BE185D] dark:text-[#FDF2F8]'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{bloomEnabled ? 'Bloom ON' : 'Bloom OFF'}</span>
              </button>
            </div>

            {/* Bloom Intensity Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>{t('bloomIntensityLabel', language)}</span>
                </div>
                <span className="font-black text-[11px] text-pink-600 dark:text-pink-400 w-9 text-right">
                  {bloomEnabled ? `${Math.round(bloomIntensity * 100)}%` : '0%'}
                </span>
              </div>
              <input
                id="slider-bloom-intensity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bloomEnabled ? bloomIntensity : 0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBloomIntensity(val);
                }}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#EC4899] touch-manipulation"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                {t('bloomDesc', language)}
              </span>
            </div>
          </div>

          {/* Gestures guide */}
          {gestures.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-slate-700/60 shadow-pastel-btn"
            >
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-2xs mt-0.5 shrink-0 border border-[#D3DFEB]/60 dark:border-[#2D384B]/60">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-3 p-3 rounded-2xl bg-[#D1FAE5]/80 dark:bg-[#064E3B]/40 border border-[#A7F3D0] dark:border-[#059669] text-[10px] sm:text-[11px] text-[#065F46] dark:text-[#A7F3D0] font-bold shadow-pastel-btn shrink-0">
          💡 {t('helpProTip', language)}
        </div>
      </div>
    </div>
  );
}
