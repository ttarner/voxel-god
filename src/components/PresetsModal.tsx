import { WORLD_PRESETS } from '../utils/presets';
import { useWorldStore } from '../store/worldStore';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { t, getLocalizedPreset } from '../utils/i18n';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresetsModal({ isOpen, onClose }: PresetsModalProps) {
  const language = useWorldStore((state) => state.language);
  const loadPreset = useWorldStore((state) => state.loadPreset);
  const clearWorld = useWorldStore((state) => state.clearWorld);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

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
              {t('templatesModalTitle', language)}
            </h2>
          </div>
          <button
            id="btn-close-presets"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-pastel-btn transition-all touch-manipulation"
            title={t('close', language)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets List */}
        <div className="mt-3 flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
          {WORLD_PRESETS.map((rawPreset) => {
            const preset = getLocalizedPreset(rawPreset, language);
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                onClick={() => {
                  loadPreset(preset.id);
                  onClose();
                }}
                className="flex items-start gap-3 p-3 rounded-2xl text-left border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 hover:bg-[#D1FAE5] dark:hover:bg-[#064E3B]/60 shadow-pastel-btn hover:shadow-pastel-mint transition-all group touch-manipulation"
              >
                <span className="text-2xl select-none group-hover:scale-110 transition-transform shrink-0">
                  {preset.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-[#065F46] dark:group-hover:text-[#A7F3D0]">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-0.5 leading-snug">
                    {preset.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clear World Option */}
        <div className="mt-3 pt-3 border-t border-[#D3DFEB]/70 dark:border-[#2D384B]/70 flex flex-col gap-2 shrink-0">
          {confirmClear ? (
            <div className="p-3 rounded-2xl bg-[#FFE4E6] dark:bg-[#881337]/70 border border-[#FECDD3] dark:border-[#BE123C] shadow-pastel-coral flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#9F1239] dark:text-[#FECDD3]">
                {t('confirmClearPrompt', language)}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-confirm-clear"
                  type="button"
                  onClick={() => {
                    clearWorld();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-[11px] font-black uppercase bg-[#E11D48] text-white rounded-xl shadow-pastel-coral hover:bg-[#BE123C] transition-all touch-manipulation"
                >
                  {t('confirmClearYes', language)}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 rounded-xl shadow-pastel-btn transition-all touch-manipulation"
                >
                  {t('confirmClearCancel', language)}
                </button>
              </div>
            </div>
          ) : (
            <button
              id="btn-clear-canvas"
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-[#FFE4E6] dark:hover:bg-[#881337]/40 text-[#BE123C] dark:text-[#FDA4AF] text-xs font-bold shadow-pastel-btn transition-all touch-manipulation"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('clearWorldTitle', language)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
