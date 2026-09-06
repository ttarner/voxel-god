import React from 'react';
import { useWorldStore } from '../store/worldStore';
import { ENVIRONMENT_PRESETS, normalizeTimeOfDay } from '../utils/environmentPresets';
import { TimeOfDay, WeatherType } from '../types';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  CloudSun,
  CloudRain,
  CloudSnow,
  Check,
  Sparkles,
} from 'lucide-react';
import { t } from '../utils/i18n';

interface EnvironmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export function EnvironmentMenu({ isOpen, onClose }: EnvironmentMenuProps) {
  const language = useWorldStore((state) => state.language);
  const timeOfDay = useWorldStore((state) => state.timeOfDay);
  const setTimeOfDay = useWorldStore((state) => state.setTimeOfDay);
  const weather = useWorldStore((state) => state.weather);
  const setWeather = useWorldStore((state) => state.setWeather);

  if (!isOpen) return null;

  const currentPresetId = normalizeTimeOfDay(timeOfDay);

  const renderPresetIcon = (id: string, className = 'w-4 h-4') => {
    switch (id) {
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

  const weatherOptions: Array<{ id: WeatherType; nameKey: 'weatherClear' | 'weatherRain' | 'weatherSnow'; icon: React.ReactNode }> = [
    {
      id: 'none',
      nameKey: 'weatherClear',
      icon: <CloudSun className="w-3.5 h-3.5" />,
    },
    {
      id: 'rain',
      nameKey: 'weatherRain',
      icon: <CloudRain className="w-3.5 h-3.5" />,
    },
    {
      id: 'snow',
      nameKey: 'weatherSnow',
      icon: <CloudSnow className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <>
      {/* Backdrop overlay to dismiss on click outside */}
      <div
        className="fixed inset-0 z-40 bg-black/10 dark:bg-black/25 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Sub-menu panel: Pastel Blue-Grey Sculpted Panel */}
      <div
        id="environment-sub-menu"
        className="absolute top-full right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 sm:w-80 bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 backdrop-blur-xl rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D3DFEB]/70 dark:border-[#2D384B]/70">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-100">
              {t('environmentTitle', language)}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs">
            {t('ambientLight3D', language)}
          </span>
        </div>

        {/* Ambient Light Presets List */}
        <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 px-1">
          {t('lightingPresets', language)}
        </div>

        <div className="grid grid-cols-1 gap-1.5 mb-3">
          {ENVIRONMENT_PRESETS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            const name = t(preset.id as any, language) || preset.name;
            const desc = t(`${preset.id}Desc` as any, language) || preset.description;

            return (
              <button
                key={preset.id}
                id={`btn-preset-${preset.id}`}
                type="button"
                onClick={() => {
                  setTimeOfDay(preset.id as TimeOfDay);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all touch-manipulation border ${
                  isSelected
                    ? 'bg-[#D1FAE5] dark:bg-[#064E3B]/80 border-[#A7F3D0] dark:border-[#059669] shadow-pastel-mint'
                    : 'bg-white/70 dark:bg-slate-800/70 border-white/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-pastel-btn'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 shadow-pastel-btn scale-105'
                        : 'bg-white/90 dark:bg-slate-700/80 shadow-2xs'
                    }`}
                  >
                    {renderPresetIcon(preset.id, 'w-4 h-4')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-black ${isSelected ? 'text-[#065F46] dark:text-[#D1FAE5]' : 'text-slate-900 dark:text-slate-100'}`}>
                        {name}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-tight ${isSelected ? 'text-[#047857] dark:text-[#A7F3D0]' : 'text-slate-500 dark:text-slate-400'}`}>
                      {desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-[#10B981] text-white shrink-0 shadow-pastel-mint animate-in zoom-in-75 duration-150">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Weather Sub-section */}
        <div className="pt-2 border-t border-[#D3DFEB]/70 dark:border-[#2D384B]/70">
          <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 px-1">
            {t('weatherTitle', language)}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {weatherOptions.map((opt) => {
              const isWeatherActive = weather === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`btn-weather-${opt.id}`}
                  type="button"
                  onClick={() => setWeather(opt.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all shadow-pastel-btn touch-manipulation ${
                    isWeatherActive
                      ? opt.id === 'rain'
                        ? 'bg-[#0EA5E9] text-white shadow-pastel-aqua border border-[#7DD3FC]'
                        : opt.id === 'snow'
                        ? 'bg-[#06B6D4] text-white shadow-pastel-mint border border-[#67E8F9]'
                        : 'bg-[#F59E0B] text-white shadow-pastel-sun border border-[#FCD34D]'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.icon}
                  <span>{t(opt.nameKey, language)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
