import { useRef, useEffect } from 'react';
import { useWorldStore } from '../store/worldStore';
import { HOTBAR_BLOCKS, BLOCK_CONFIGS } from '../utils/blockConfig';
import { BrushSize, BlockType } from '../types';
import { SYMMETRY_LABELS } from '../utils/symmetryUtils';
import { Hammer, Trash2, TreePine, Paintbrush, Boxes, Droplets, FlipHorizontal } from 'lucide-react';
import { t } from '../utils/i18n';

export function VoxelHotbar() {
  const language = useWorldStore((state) => state.language);
  const mode = useWorldStore((state) => state.mode);
  const setMode = useWorldStore((state) => state.setMode);
  const brushSize = useWorldStore((state) => state.brushSize);
  const setBrushSize = useWorldStore((state) => state.setBrushSize);
  const continuousDrag = useWorldStore((state) => state.continuousDrag);
  const setContinuousDrag = useWorldStore((state) => state.setContinuousDrag);
  const symmetryMode = useWorldStore((state) => state.symmetryMode);
  const cycleSymmetryMode = useWorldStore((state) => state.cycleSymmetryMode);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);
  const setSelectedBlock = useWorldStore((state) => state.setSelectedBlock);
  const customBlockColors = useWorldStore((state) => state.customBlockColors);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll selected block into view if needed
  useEffect(() => {
    const el = document.getElementById(`hotbar-item-${selectedBlock}`);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedBlock]);

  const brushSizes: Array<{ size: BrushSize; label: string }> = [
    { size: 1, label: '1x1' },
    { size: 2, label: '2x2' },
    { size: 3, label: '3x3' },
  ];

  const getBlockLabel = (blockType: BlockType) => {
    switch (blockType) {
      case 'grass':
        return t('block_grass_label', language);
      case 'dirt':
        return t('block_dirt_label', language);
      case 'stone':
        return t('block_stone_label', language);
      case 'wood':
        return t('block_wood_label', language);
      case 'brick':
        return t('block_brick_label', language);
      case 'glass':
        return t('block_glass_label', language);
      case 'water':
        return t('block_water_label', language);
      case 'leaves':
        return t('block_leaves_label', language);
      case 'tree':
        return t('block_tree_label', language);
      default:
        return (blockType as string) || '';
    }
  };

  const getSymmetryDisplay = () => {
    if (symmetryMode === 'none') {
      return t('symmetry', language);
    }
    if (symmetryMode === 'x') {
      return t('symmetryX', language);
    }
    if (symmetryMode === 'z') {
      return t('symmetryZ', language);
    }
    return t('symmetryBoth', language);
  };

  return (
    <>
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center px-2 sm:px-4 select-none safe-bottom-padding safe-left-padding safe-right-padding pb-2 sm:pb-3">
        <div className="pointer-events-auto flex flex-col items-center gap-2 w-full max-w-lg md:max-w-2xl">
          
          {/* Top Control Bar: Pastel Blue-Grey Sculpted Panel */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 w-full bg-[#E8EFF5]/95 dark:bg-[#1E2633]/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B]">
            
            {/* Mode Switcher: Mint Green COSTRUISCI vs Coral-Peach DISTRUGGI */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-xl shadow-inner shrink-0">
              {/* Build Button - Delicate Mint Green */}
              <button
                id="btn-mode-build"
                type="button"
                onClick={() => setMode('build')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all touch-manipulation ${
                  mode === 'build'
                    ? 'bg-[#10B981] text-white shadow-pastel-mint scale-102'
                    : 'text-[#065F46] dark:text-[#A7F3D0] hover:bg-[#D1FAE5]/60 dark:hover:bg-[#064E3B]/60'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t('build', language)}</span>
              </button>

              {/* Destroy Button - Soft Coral-Peach */}
              <button
                id="btn-mode-destroy"
                type="button"
                onClick={() => setMode('destroy')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all touch-manipulation ${
                  mode === 'destroy'
                    ? 'bg-[#F43F5E] text-white shadow-pastel-coral scale-102'
                    : 'text-[#9F1239] dark:text-[#FECDD3] hover:bg-[#FFE4E6]/60 dark:hover:bg-[#881337]/60'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t('destroy', language)}</span>
              </button>
            </div>

            {/* Quick Brush Size Selector (1x1, 2x2, 3x3) in Soft Indigo */}
            <div className="flex items-center gap-0.5 bg-white/70 dark:bg-slate-800/70 p-1 rounded-xl shadow-inner shrink-0">
              {brushSizes.map(({ size, label }) => (
                <button
                  key={size}
                  id={`btn-brush-size-${size}`}
                  type="button"
                  onClick={() => setBrushSize(size)}
                  className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all touch-manipulation ${
                    brushSize === size
                      ? 'bg-[#6366F1] text-white shadow-pastel-indigo scale-105'
                      : 'text-indigo-900 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  }`}
                  title={`${t('brushSize', language)}: ${label}`}
                >
                  {size > 1 && <Boxes className="w-3 h-3 hidden xs:inline" />}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Continuous Drag / Paint Stroke Toggle */}
            <button
              id="btn-toggle-continuous-drag"
              type="button"
              onClick={() => setContinuousDrag(!continuousDrag)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all touch-manipulation shrink-0 shadow-pastel-btn ${
                continuousDrag
                  ? 'bg-[#F59E0B] text-white shadow-pastel-sun border border-[#FCD34D]'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white'
              }`}
              title={t('dragTooltip', language)}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('dragContinuous', language)}</span>
            </button>

            {/* Symmetry Mirror Toggle */}
            <button
              id="btn-toggle-symmetry"
              type="button"
              onClick={cycleSymmetryMode}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all touch-manipulation shrink-0 shadow-pastel-btn ${
                symmetryMode === 'x'
                  ? 'bg-[#0EA5E9] text-white shadow-pastel-aqua border border-[#7DD3FC]'
                  : symmetryMode === 'z'
                  ? 'bg-[#EC4899] text-white shadow-pastel-coral border border-[#F472B6]'
                  : symmetryMode === 'both'
                  ? 'bg-[#8B5CF6] text-white shadow-pastel-indigo border border-[#C4B5FD]'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white'
              }`}
              title={`${getSymmetryDisplay()} (Key: M)`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">
                {getSymmetryDisplay()}
              </span>
              {symmetryMode !== 'none' && (
                <span className="xs:hidden text-[10px] font-black">
                  {SYMMETRY_LABELS[symmetryMode].short}
                </span>
              )}
            </button>
          </div>

          {/* Horizontally scrollable hotbar: Sculpted Pastel Carousel */}
          <div className="w-full bg-[#E8EFF5]/95 dark:bg-[#1E2633]/95 backdrop-blur-xl p-1.5 sm:p-2 rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] overflow-hidden flex items-center gap-1 sm:gap-1.5">
            <div
              ref={scrollContainerRef}
              className="flex-1 flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {HOTBAR_BLOCKS.map((blockType) => {
                const config = BLOCK_CONFIGS[blockType];
                const activeColor = customBlockColors[blockType] || config.color;
                const isSelected = selectedBlock === blockType && mode === 'build';
                const isTree = blockType === 'tree';
                const localizedLabel = getBlockLabel(blockType);

                return (
                  <button
                    key={blockType}
                    id={`hotbar-item-${blockType}`}
                    type="button"
                    onClick={() => {
                      setSelectedBlock(blockType);
                      if (mode !== 'build') setMode('build');
                    }}
                    className={`group relative flex flex-col items-center justify-center min-w-[52px] sm:min-w-[58px] md:min-w-[64px] h-[60px] sm:h-[66px] px-1 rounded-xl transition-all touch-manipulation ${
                      isSelected
                        ? 'bg-[#D1FAE5] dark:bg-[#064E3B]/60 shadow-pastel-mint ring-2 ring-[#10B981] scale-105'
                        : 'bg-white/80 dark:bg-slate-800/80 shadow-pastel-btn hover:bg-white dark:hover:bg-slate-800 opacity-95 hover:opacity-100'
                    }`}
                    title={localizedLabel}
                  >
                    {/* Isometric 3D Voxel Swatch Cube */}
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 mb-1 flex items-center justify-center">
                      {isTree ? (
                        <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-pastel-btn">
                          <TreePine className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg shadow-pastel-btn relative transform rotate-6 transition-transform group-hover:rotate-12 flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundColor: activeColor,
                            boxShadow: `inset -2px -2px 0 0 rgba(0,0,0,0.12), inset 2px 2px 0 0 rgba(255,255,255,0.45)`,
                            opacity: config.opacity ?? 1,
                          }}
                        >
                          {config.isTransparent && (
                            <div className="absolute inset-0 rounded-lg border border-sky-300/60 bg-sky-200/30" />
                          )}
                          {blockType === 'water' && (
                            <Droplets className="w-2.5 h-2.5 text-white/90 drop-shadow-xs relative z-10" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold leading-none truncate max-w-[48px] sm:max-w-[54px] ${
                        isSelected
                          ? 'text-[#065F46] dark:text-[#A7F3D0]'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {localizedLabel}
                    </span>

                    {/* Active selection indicator dot */}
                    {isSelected && (
                      <span className="absolute -top-1 w-2 h-2 rounded-full bg-[#10B981] shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

