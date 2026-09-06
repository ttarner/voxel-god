import { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  Pipette,
} from 'lucide-react';
import { useWorldStore } from '../store/worldStore';
import {
  HOTBAR_BLOCKS,
  BLOCK_CONFIGS,
  PASTEL_SWATCHES,
  PASTEL_THEME_PRESETS,
} from '../utils/blockConfig';
import { BlockType } from '../types';
import { t, getLocalizedTheme, getLocalizedBlockLabel } from '../utils/i18n';

interface PastelColorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PastelColorStudioModal({
  isOpen,
  onClose,
}: PastelColorStudioModalProps) {
  const language = useWorldStore((state) => state.language);
  const customBlockColors = useWorldStore((state) => state.customBlockColors);
  const activeThemeId = useWorldStore((state) => state.activeThemeId);
  const setCustomBlockColor = useWorldStore(
    (state) => state.setCustomBlockColor
  );
  const applyPastelTheme = useWorldStore((state) => state.applyPastelTheme);
  const resetCustomColors = useWorldStore((state) => state.resetCustomColors);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);
  const setSelectedBlock = useWorldStore((state) => state.setSelectedBlock);

  const [activeTab, setActiveTab] = useState<'themes' | 'custom'>('themes');
  const [targetBlock, setTargetBlock] = useState<BlockType>(selectedBlock);

  if (!isOpen) return null;

  const currentBlockConfig = BLOCK_CONFIGS[targetBlock];
  const activeBlockColor =
    customBlockColors[targetBlock] || currentBlockConfig.color;
  const currentBlockLabel = getLocalizedBlockLabel(targetBlock, language) || currentBlockConfig.label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="pastel-color-studio-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 text-slate-800 dark:text-slate-100 rounded-3xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] flex flex-col max-h-[92vh] sm:max-h-[86vh] overflow-hidden my-auto backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#D3DFEB]/70 dark:border-[#2D384B]/70 bg-white/40 dark:bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#6366F1] text-white shadow-pastel-indigo">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 leading-tight">
                {t('colorStudioTitle', language)}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t('colorStudioSubtitle', language)}
              </p>
            </div>
          </div>
          <button
            id="btn-close-color-studio"
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white shadow-pastel-btn transition-all touch-manipulation"
            title={t('closeModal', language)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-1.5 shrink-0">
          <div className="flex p-1 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-inner border border-[#D3DFEB]/50 dark:border-[#2D384B]/50 gap-1.5">
            <button
              type="button"
              id="tab-theme-presets"
              onClick={() => setActiveTab('themes')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all touch-manipulation ${
                activeTab === 'themes'
                  ? 'bg-[#6366F1] text-white shadow-pastel-indigo scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('tabThemes', language)}</span>
            </button>

            <button
              type="button"
              id="tab-custom-picker"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all touch-manipulation ${
                activeTab === 'custom'
                  ? 'bg-[#6366F1] text-white shadow-pastel-indigo scale-102'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Pipette className="w-3.5 h-3.5" />
              <span>{t('tabCustom', language)}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-2.5 sm:py-3 space-y-3 sm:space-y-4">
          {activeTab === 'themes' ? (
            /* PRESET THEMES */
            <div className="space-y-2">
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 px-0.5">
                {t('applyThemePrompt', language)}
              </div>

              <div className="grid gap-2 sm:gap-2.5">
                {PASTEL_THEME_PRESETS.map((rawPreset) => {
                  const preset = getLocalizedTheme(rawPreset, language);
                  const isSelected = activeThemeId === preset.id;
                  const colorList = Object.values(preset.colors) as string[];

                  return (
                    <button
                      key={preset.id}
                      id={`btn-preset-theme-${preset.id}`}
                      type="button"
                      onClick={() => applyPastelTheme(preset.id)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex flex-col gap-1.5 sm:gap-2 touch-manipulation ${
                        isSelected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {preset.name}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5" /> {t('themeActive', language)}
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {t('applyThemeTap', language)}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {preset.description}
                      </p>

                      {/* Swatch Strip */}
                      <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
                        {colorList.map((c, i) => (
                          <div
                            key={i}
                            className="flex-1 h-4 sm:h-5 rounded-md shadow-2xs border border-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CUSTOM COLOR & SWATCHES */
            <div className="space-y-3 sm:space-y-4">
              {/* Block Selector */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('stepChooseBlock', language)}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1 sm:gap-1.5">
                  {HOTBAR_BLOCKS.map((blk) => {
                    const cfg = BLOCK_CONFIGS[blk];
                    const clr = customBlockColors[blk] || cfg.color;
                    const isTarget = targetBlock === blk;
                    const label = getLocalizedBlockLabel(blk, language) || cfg.label;

                    return (
                      <button
                        key={blk}
                        id={`btn-target-block-${blk}`}
                        type="button"
                        onClick={() => {
                          setTargetBlock(blk);
                          setSelectedBlock(blk);
                        }}
                        className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-all touch-manipulation ${
                          isTarget
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-md shadow-2xs border border-black/15 mb-0.5 sm:mb-1"
                          style={{ backgroundColor: clr }}
                        />
                        <span className="truncate w-full text-center text-[9px] sm:text-[10px]">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color picker box */}
              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-2xs border border-slate-300 dark:border-slate-700 shrink-0 cursor-pointer">
                    <input
                      id="native-color-picker-input"
                      type="color"
                      value={activeBlockColor}
                      onChange={(e) =>
                        setCustomBlockColor(targetBlock, e.target.value)
                      }
                      className="absolute -inset-4 w-20 h-20 opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: activeBlockColor }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {currentBlockLabel}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                      {t('touchColorWheel', language)}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  {activeBlockColor}
                </span>
              </div>

              {/* Curated Pastel Swatches */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('stepTouchPastel', language)}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-1.5 max-h-[30vh] sm:max-h-none overflow-y-auto">
                  {PASTEL_SWATCHES.map((swatch) => {
                    const isCurrent =
                      activeBlockColor.toLowerCase() ===
                      swatch.color.toLowerCase();

                    return (
                      <button
                        key={swatch.name}
                        id={`btn-swatch-${swatch.name.toLowerCase().replace(/\s+/g, '-')}`}
                        type="button"
                        onClick={() =>
                          setCustomBlockColor(targetBlock, swatch.color)
                        }
                        className={`group flex flex-col items-center p-1 sm:p-1.5 rounded-xl border transition-all touch-manipulation ${
                          isCurrent
                            ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/40'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                        title={`${swatch.name} (${swatch.color})`}
                      >
                        <div
                          className="w-full h-5 sm:h-6 rounded-lg shadow-2xs border border-black/10 transition-transform group-hover:scale-105 flex items-center justify-center"
                          style={{ backgroundColor: swatch.color }}
                        >
                          {isCurrent && (
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-800 drop-shadow-2xs" />
                          )}
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-medium text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 truncate w-full text-center">
                          {swatch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            id="btn-reset-default-colors"
            type="button"
            onClick={resetCustomColors}
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetBtn', language)}</span>
          </button>

          <button
            id="btn-done-color-studio"
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all touch-manipulation"
          >
            {t('doneBtn', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
