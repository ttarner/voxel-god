import { useState } from 'react';
import { useWorldStore } from '../store/worldStore';
import { CHALLENGES } from '../utils/challenges';
import {
  Trophy,
  X,
  CheckCircle2,
  Dice5,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { t, getLocalizedChallenge } from '../utils/i18n';

interface ChallengeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'all' | 'uncompleted' | 'completed';

export function ChallengeCollectionModal({ isOpen, onClose }: ChallengeCollectionModalProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const language = useWorldStore((state) => state.language);
  const activeChallengeId = useWorldStore((state) => state.activeChallengeId);
  const completedChallengeIds = useWorldStore((state) => state.completedChallengeIds);
  const startChallenge = useWorldStore((state) => state.startChallenge);
  const startRandomChallenge = useWorldStore((state) => state.startRandomChallenge);

  if (!isOpen) return null;

  const totalCount = CHALLENGES.length;
  const completedCount = completedChallengeIds.length;
  const percentCompleted = Math.round((completedCount / totalCount) * 100);

  const filteredList = CHALLENGES.filter((c) => {
    const isCompleted = completedChallengeIds.includes(c.id);
    if (filter === 'completed') return isCompleted;
    if (filter === 'uncompleted') return !isCompleted;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg md:max-w-2xl bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 text-slate-800 dark:text-slate-100 rounded-3xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-4 sm:p-6 overflow-hidden my-auto max-h-[90vh] sm:max-h-[85vh] flex flex-col backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D3DFEB]/70 dark:border-[#2D384B]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#FEF3C7] dark:bg-[#78350F]/80 text-[#92400E] dark:text-[#FDE68A] shadow-pastel-sun border border-[#FDE68A] dark:border-[#B45309]">
              <Trophy className="w-5 h-5 text-[#D97706] dark:text-[#FBBF24]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {t('collectionTitle', language)}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('collectionSubtitle', language)}
              </p>
            </div>
          </div>
          <button
            id="btn-close-collection-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-pastel-btn transition-all touch-manipulation"
            title={t('close', language)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn shrink-0 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('collectionProgress', language)}:</span>
              <strong className="text-[#D97706] dark:text-[#FBBF24] font-black">
                {t('modelsCompleted', language, { completed: completedCount, total: totalCount })}
              </strong>
            </div>
            <span className="font-black text-[#10B981]">{percentCompleted}%</span>
          </div>

          <div className="w-full h-2.5 bg-white dark:bg-slate-900 rounded-full overflow-hidden p-0.5 shadow-inner border border-[#D3DFEB] dark:border-[#2D384B]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-[#10B981] to-[#34D399] rounded-full transition-all duration-500"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>

        {/* Filter Toolbar & Random button */}
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap shrink-0">
          <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-inner border border-[#D3DFEB]/50 dark:border-[#2D384B]/50">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-[#10B981] text-white shadow-pastel-mint'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t('allFilter', language)} ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('uncompleted')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filter === 'uncompleted'
                  ? 'bg-[#10B981] text-white shadow-pastel-mint'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t('toDoFilter', language)} ({totalCount - completedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filter === 'completed'
                  ? 'bg-[#10B981] text-white shadow-pastel-mint'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t('completedFilter', language)} ({completedCount})
            </button>
          </div>

          <button
            id="btn-collection-play-random"
            type="button"
            onClick={() => {
              startRandomChallenge();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black uppercase tracking-wider shadow-pastel-mint transition-all touch-manipulation"
          >
            <Dice5 className="w-4 h-4" />
            <span>{t('randomChallenge', language)}</span>
          </button>
        </div>

        {/* Challenge Cards Grid */}
        <div className="mt-3 overflow-y-auto flex-1 pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredList.map((rawItem) => {
            const item = getLocalizedChallenge(rawItem, language);
            const isCompleted = completedChallengeIds.includes(item.id);
            const isCurrentActive = activeChallengeId === item.id;
            const blockCount = Object.keys(item.targetBlocks).length;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 relative shadow-pastel-btn ${
                  isCurrentActive
                    ? 'border-[#10B981] ring-2 ring-[#10B981]/30 bg-[#D1FAE5]/50 dark:bg-[#064E3B]/30'
                    : isCompleted
                    ? 'border-[#FDE68A] dark:border-[#B45309]/60 bg-[#FEF3C7]/40 dark:bg-[#78350F]/20'
                    : 'border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 hover:bg-white'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-3xl select-none shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-500">
                          {'★'.repeat(item.difficulty)}
                          {'☆'.repeat(3 - item.difficulty)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          • {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Completed Badge */}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F]/80 dark:text-[#FDE68A] border border-[#FDE68A] dark:border-[#B45309] shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#D97706] dark:text-[#FBBF24]" />
                      {t('completedBadge', language)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                  {item.description}
                </p>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#D3DFEB]/70 dark:border-[#2D384B]/70">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                    {t('blocksRequired', language, { count: blockCount })}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      startChallenge(item.id);
                      onClose();
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all touch-manipulation ${
                      isCurrentActive
                        ? 'bg-[#10B981] text-white shadow-pastel-mint'
                        : isCompleted
                        ? 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-[#D1FAE5] dark:hover:bg-[#064E3B]/40 hover:text-[#065F46] shadow-pastel-btn'
                        : 'bg-[#10B981] hover:bg-[#059669] text-white shadow-pastel-mint'
                    }`}
                  >
                    <span>{isCurrentActive ? t('inProgress', language) : isCompleted ? t('replay', language) : t('buildChallenge', language)}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
