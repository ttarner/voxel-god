import { useMemo } from 'react';
import { useWorldStore } from '../store/worldStore';
import { CHALLENGES } from '../utils/challenges';
import {
  Trophy,
  Sparkles,
  Dice5,
  LayoutGrid,
  X,
  Star,
  CheckCircle,
} from 'lucide-react';
import { t, getLocalizedChallenge } from '../utils/i18n';

interface ChallengeCelebrationModalProps {
  onOpenCollection: () => void;
  onOpenInitialScreen: () => void;
}

export function ChallengeCelebrationModal({
  onOpenCollection,
  onOpenInitialScreen,
}: ChallengeCelebrationModalProps) {
  const language = useWorldStore((state) => state.language);
  const isCelebrationOpen = useWorldStore((state) => state.isCelebrationOpen);
  const lastCompletedChallengeId = useWorldStore((state) => state.lastCompletedChallengeId);
  const completedChallengeIds = useWorldStore((state) => state.completedChallengeIds);
  const closeCelebrationModal = useWorldStore((state) => state.closeCelebrationModal);
  const startRandomChallenge = useWorldStore((state) => state.startRandomChallenge);

  const challenge = useMemo(() => {
    if (!lastCompletedChallengeId) return null;
    const base = CHALLENGES.find((c) => c.id === lastCompletedChallengeId) || null;
    return base ? getLocalizedChallenge(base, language) : null;
  }, [lastCompletedChallengeId, language]);

  if (!isCelebrationOpen || !challenge) return null;

  const totalChallenges = CHALLENGES.length;
  const completedCount = completedChallengeIds.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 select-none overflow-y-auto"
      onClick={closeCelebrationModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md bg-[#E8EFF5]/98 dark:bg-[#1E2633]/98 text-slate-800 dark:text-slate-100 rounded-3xl shadow-pastel-panel border border-[#D3DFEB] dark:border-[#2D384B] p-5 sm:p-6 text-center my-auto flex flex-col items-center gap-4 overflow-hidden backdrop-blur-xl"
      >
        {/* Close Icon */}
        <button
          id="btn-close-celebration"
          type="button"
          onClick={closeCelebrationModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-pastel-btn transition-all"
          title={t('close', language)}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Victory Trophy Badge */}
        <div className="relative mt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FEF3C7] dark:bg-[#78350F]/80 text-[#92400E] dark:text-[#FDE68A] flex items-center justify-center shadow-pastel-sun border border-[#FDE68A] dark:border-[#B45309] animate-bounce">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#D97706] dark:text-[#FBBF24]" />
          </div>
          <div className="absolute -top-1 -right-1 p-1.5 bg-[#10B981] text-white rounded-full shadow-pastel-mint">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title & Celebration message */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center gap-1 text-[#D97706] dark:text-[#FBBF24] font-black text-xs uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{t('solvedTitle', language)}</span>
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            {challenge.icon} {challenge.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {t('solvedDesc', language)}
          </p>
        </div>

        {/* Progress badge */}
        <div className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-[#D3DFEB] dark:border-[#2D384B] shadow-pastel-btn flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
            <div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-100">
                {t('addedToCollection', language)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t('modelsCompleted', language, { completed: completedCount, total: totalChallenges })}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              closeCelebrationModal();
              onOpenCollection();
            }}
            className="px-3 py-1.5 text-xs font-bold text-[#92400E] dark:text-[#FDE68A] bg-[#FEF3C7] dark:bg-[#78350F]/80 rounded-xl shadow-pastel-btn hover:bg-[#FDE68A] transition-all"
          >
            {t('seeCollection', language)}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2 mt-2">
          <button
            id="btn-celebration-next-random"
            type="button"
            onClick={() => {
              closeCelebrationModal();
              startRandomChallenge();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-pastel-mint transition-all touch-manipulation"
          >
            <Dice5 className="w-4 h-4" />
            <span>{t('nextRandomChallenge', language)}</span>
          </button>

          <button
            id="btn-celebration-to-menu"
            type="button"
            onClick={() => {
              closeCelebrationModal();
              onOpenInitialScreen();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-pastel-btn transition-all touch-manipulation"
          >
            <LayoutGrid className="w-4 h-4 text-[#10B981]" />
            <span>{t('mainMenuBtn', language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
