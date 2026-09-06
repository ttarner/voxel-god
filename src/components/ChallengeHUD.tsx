import { useMemo, useState } from 'react';
import { useWorldStore } from '../store/worldStore';
import { CHALLENGES } from '../utils/challenges';
import { BLOCK_CONFIGS } from '../utils/blockConfig';
import { ConcreteBlockType, BlockType } from '../types';
import {
  Trophy,
  RotateCcw,
  Dice5,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { t, getLocalizedChallenge } from '../utils/i18n';

interface ChallengeHUDProps {
  onOpenCollection: () => void;
  onOpenInitialScreen: () => void;
}

export function ChallengeHUD({ onOpenCollection, onOpenInitialScreen }: ChallengeHUDProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const language = useWorldStore((state) => state.language);
  const gameMode = useWorldStore((state) => state.gameMode);
  const activeChallengeId = useWorldStore((state) => state.activeChallengeId);
  const showGhostGuide = useWorldStore((state) => state.showGhostGuide);
  const completedChallengeIds = useWorldStore((state) => state.completedChallengeIds);
  const blocks = useWorldStore((state) => state.blocks);
  const selectedBlock = useWorldStore((state) => state.selectedBlock);
  const setSelectedBlock = useWorldStore((state) => state.setSelectedBlock);
  const customBlockColors = useWorldStore((state) => state.customBlockColors);

  const toggleGhostGuide = useWorldStore((state) => state.toggleGhostGuide);
  const restartCurrentChallenge = useWorldStore((state) => state.restartCurrentChallenge);
  const startRandomChallenge = useWorldStore((state) => state.startRandomChallenge);

  const challenge = useMemo(() => {
    if (!activeChallengeId) return null;
    const base = CHALLENGES.find((c) => c.id === activeChallengeId) || null;
    return base ? getLocalizedChallenge(base, language) : null;
  }, [activeChallengeId, language]);

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

  // Calculate required block breakdown
  const requiredBlocksSummary = useMemo(() => {
    if (!challenge) return [];
    const counts: Partial<Record<ConcreteBlockType, { required: number; placed: number }>> = {};

    for (const [key, rawType] of Object.entries(challenge.targetBlocks)) {
      const type = rawType as ConcreteBlockType;
      if (!counts[type]) {
        counts[type] = { required: 0, placed: 0 };
      }
      counts[type]!.required++;
      if (blocks[key] === type) {
        counts[type]!.placed++;
      }
    }

    return (Object.entries(counts) as [ConcreteBlockType, { required: number; placed: number }][]).map(([type, stats]) => ({
      type,
      config: BLOCK_CONFIGS[type],
      ...stats,
      isComplete: stats.placed >= stats.required,
    }));
  }, [challenge, blocks]);

  // Re-calculate progress on blocks state change
  const progress = useMemo(() => {
    if (!challenge) {
      return { total: 0, correct: 0, missing: 0, wrong: 0, percent: 0, isCompleted: false };
    }
    const targetEntries = Object.entries(challenge.targetBlocks);
    const total = targetEntries.length;
    let correct = 0;
    let missing = 0;
    let wrong = 0;

    for (const [key, targetType] of targetEntries) {
      const placedType = blocks[key];
      if (!placedType) {
        missing++;
      } else if (placedType === targetType) {
        correct++;
      } else {
        wrong++;
      }
    }

    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const isCompleted = total > 0 && correct === total;

    return { total, correct, missing, wrong, percent, isCompleted };
  }, [challenge, blocks]);

  if (gameMode !== 'challenge' || !challenge) return null;

  const isCompletedAlready = completedChallengeIds.includes(challenge.id);

  return (
    <div
      className="fixed left-0 right-0 z-25 pointer-events-none px-2 sm:px-4 flex flex-col items-center challenge-hud-top safe-left-padding safe-right-padding animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="w-full max-w-lg md:max-w-xl bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 backdrop-blur-md rounded-2xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-2.5 sm:p-3.5 pointer-events-auto flex flex-col gap-2 transition-all">
        {/* Top Info Header Line: Name + Progress % + Action Pills */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl select-none shrink-0 leading-none">{challenge.icon}</span>
            <div className="min-w-0 flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate">
                {challenge.name}
              </h2>
              {isCompletedAlready && (
                <span className="shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F]/80 dark:text-[#FDE68A] border border-[#FDE68A] dark:border-[#B45309]">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#D97706] dark:text-[#FBBF24]" />
                  <span className="hidden xs:inline">{t('completedBadge', language)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Header Buttons (Trophy, Exit, Collapse) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id="btn-hud-open-collection"
              type="button"
              onClick={onOpenCollection}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 text-amber-800 dark:text-amber-300 shadow-pastel-btn hover:bg-white text-[11px] font-bold transition-all touch-manipulation"
              title={t('collectionTitle', language)}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black">
                {completedChallengeIds.length}/{CHALLENGES.length}
              </span>
            </button>

            <button
              id="btn-hud-exit-to-menu"
              type="button"
              onClick={onOpenInitialScreen}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white shadow-pastel-btn text-[11px] font-bold transition-all touch-manipulation"
              title={t('exitToMenu', language)}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('exit', language)}</span>
            </button>

            <button
              id="btn-hud-toggle-collapse"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:bg-white shadow-pastel-btn transition-all"
              title={isCollapsed ? t('expandDetails', language) : t('collapseDetails', language)}
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/80 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-[#D3DFEB] dark:border-[#2D384B]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progress.isCompleted
                  ? 'bg-gradient-to-r from-[#10B981] to-[#34D399]'
                  : progress.percent > 60
                  ? 'bg-gradient-to-r from-[#10B981] to-[#6EE7B7]'
                  : 'bg-gradient-to-r from-[#F59E0B] to-[#10B981]'
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 shrink-0">
            {progress.correct}/{progress.total} ({progress.percent}%)
          </span>
          {progress.wrong > 0 && (
            <span className="inline-flex items-center gap-0.5 text-rose-500 font-black text-[10px] shrink-0">
              <AlertCircle className="w-2.5 h-2.5" />
              {progress.wrong} {t('extraMismatch', language)}
            </span>
          )}
        </div>

        {/* Expandable Details: Required Materials & Quick Controls */}
        {!isCollapsed && (
          <div className="flex flex-col gap-2 pt-1">
            {/* Required Material Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0 uppercase tracking-wider">{t('materials', language)}:</span>
              {requiredBlocksSummary.map((item) => {
                const currentColor = customBlockColors[item.type] || item.config.color;
                const isSelected = selectedBlock === item.type;
                const localizedLabel = getBlockLabel(item.type);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSelectedBlock(item.type)}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-all shadow-pastel-btn touch-manipulation ${
                      isSelected
                        ? 'ring-2 ring-[#10B981] bg-[#D1FAE5] dark:bg-[#064E3B] text-[#065F46] dark:text-[#A7F3D0]'
                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white'
                    }`}
                    title={`${t('selectBlock', language)} ${localizedLabel}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs border border-white/60"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span>{localizedLabel}</span>
                    <span
                      className={`ml-0.5 font-black ${
                        item.isComplete
                          ? 'text-[#059669] dark:text-[#34D399]'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.placed}/{item.required}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls: Ghost Guide Toggle + Restart + Next Random */}
            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#D3DFEB]/70 dark:border-[#2D384B]/70">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-hud-toggle-ghost"
                  type="button"
                  onClick={toggleGhostGuide}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shadow-pastel-btn touch-manipulation ${
                    showGhostGuide
                      ? 'bg-[#EEF2FF] dark:bg-[#312E81] text-[#4338CA] dark:text-[#C7D2FE] border border-[#C7D2FE]'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white'
                  }`}
                  title={showGhostGuide ? t('ghostGuideHide', language) : t('ghostGuideShow', language)}
                >
                  {showGhostGuide ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{t('guideOn', language)}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>{t('guideOff', language)}</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-hud-restart-challenge"
                  type="button"
                  onClick={restartCurrentChallenge}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-600 dark:text-slate-300 shadow-pastel-btn text-[11px] font-bold transition-all touch-manipulation"
                  title={t('restartChallenge', language)}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t('reset', language)}</span>
                </button>
              </div>

              <button
                id="btn-hud-random-challenge"
                type="button"
                onClick={startRandomChallenge}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-black uppercase tracking-wider shadow-pastel-mint transition-all touch-manipulation"
                title={t('randomChallenge', language)}
              >
                <Dice5 className="w-3.5 h-3.5" />
                <span>{t('randomChallenge', language)}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
