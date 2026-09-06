import { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Minus, Focus, ZoomIn, ChevronRight } from 'lucide-react';
import { cameraEvents } from '../utils/cameraEvents';
import { useWorldStore } from '../store/worldStore';
import { t } from '../utils/i18n';

export function ZoomControls() {
  const language = useWorldStore((state) => state.language);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [sliderOffset, setSliderOffset] = useState(0);
  const startYRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleZoomIn = useCallback(() => {
    cameraEvents.zoom(0.88); // Zoom in closer
  }, []);

  const handleZoomOut = useCallback(() => {
    cameraEvents.zoom(1.14); // Zoom out further
  }, []);

  const handleResetCamera = useCallback(() => {
    cameraEvents.reset();
  }, []);

  const startHoldZoom = (direction: 'in' | 'out') => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    const step = direction === 'in' ? 0.94 : 1.06;
    cameraEvents.zoom(step);
    holdIntervalRef.current = setInterval(() => {
      cameraEvents.zoom(step);
    }, 60);
  };

  const stopHoldZoom = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // 1-Finger drag on the zoom scrubber slider
  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    startYRef.current = e.clientY;
    setIsScrubbing(true);
    setSliderOffset(0);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;
    const dy = e.clientY - startYRef.current;
    const clampedOffset = Math.max(-18, Math.min(18, dy));
    setSliderOffset(clampedOffset);

    // dy < 0 means dragging finger up -> zoom in
    // dy > 0 means dragging finger down -> zoom out
    const deltaRatio = 1 + dy * 0.008;
    cameraEvents.zoom(deltaRatio);
    startYRef.current = e.clientY;
  };

  const handleSliderPointerUp = () => {
    startYRef.current = null;
    setIsScrubbing(false);
    setSliderOffset(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <div
      id="one-finger-zoom-hud"
      className="pointer-events-none fixed right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center select-none"
    >
      {!isExpanded ? (
        /* Retracted Dot State: Minimalist round button */
        <button
          id="btn-expand-zoom"
          type="button"
          aria-label={t('zoomExpand', language)}
          title={t('zoomExpand', language)}
          onClick={() => setIsExpanded(true)}
          className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 active:scale-90 touch-manipulation relative group animate-in fade-in zoom-in-95 duration-150"
        >
          <ZoomIn className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span className="sr-only">Zoom</span>
        </button>
      ) : (
        /* Expanded Full Tool State */
        <div
          id="zoom-expanded-panel"
          className="pointer-events-auto flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800/90 gap-1 text-slate-700 dark:text-slate-200 animate-in fade-in slide-in-from-right-2 duration-150"
        >
          {/* Header: Retract / Close button */}
          <button
            id="btn-collapse-zoom"
            type="button"
            aria-label={t('zoomCollapse', language)}
            title={t('zoomCollapse', language)}
            onClick={() => setIsExpanded(false)}
            className="w-8 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Zoom In (+) Button - 1 Finger Tap or Hold */}
          <button
            id="btn-zoom-in"
            type="button"
            aria-label={t('zoomIn', language)}
            title={t('zoomIn', language)}
            onClick={handleZoomIn}
            onPointerDown={() => startHoldZoom('in')}
            onPointerUp={stopHoldZoom}
            onPointerLeave={stopHoldZoom}
            onPointerCancel={stopHoldZoom}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors active:scale-95 touch-manipulation shadow-2xs"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* 1-Finger Touch Slider / Scrubber */}
          <div
            id="zoom-scrubber-track"
            title={t('zoomScrubber', language)}
            onPointerDown={handleSliderPointerDown}
            onPointerMove={handleSliderPointerMove}
            onPointerUp={handleSliderPointerUp}
            onPointerCancel={handleSliderPointerUp}
            className={`relative w-8 h-12 rounded-xl flex flex-col items-center justify-center cursor-ns-resize touch-none transition-colors ${
              isScrubbing
                ? 'bg-emerald-100/80 dark:bg-emerald-950/60'
                : 'bg-slate-100/60 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {/* Vertical track line */}
            <div className="absolute top-2 bottom-2 w-0.5 bg-slate-300 dark:bg-slate-700 rounded-full pointer-events-none" />

            {/* Draggable thumb */}
            <div
              className={`w-6 h-3 rounded-md flex items-center justify-center shadow-xs transition-transform duration-75 pointer-events-none ${
                isScrubbing
                  ? 'bg-emerald-500 text-white scale-110'
                  : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
              }`}
              style={{ transform: `translateY(${sliderOffset}px)` }}
            >
              <div className="flex gap-0.5">
                <span
                  className={`w-0.5 h-1 rounded-full ${isScrubbing ? 'bg-white' : 'bg-slate-400 dark:bg-slate-300'}`}
                />
                <span
                  className={`w-0.5 h-1 rounded-full ${isScrubbing ? 'bg-white' : 'bg-slate-400 dark:bg-slate-300'}`}
                />
              </div>
            </div>
          </div>

          {/* Zoom Out (-) Button - 1 Finger Tap or Hold */}
          <button
            id="btn-zoom-out"
            type="button"
            aria-label={t('zoomOut', language)}
            title={t('zoomOut', language)}
            onClick={handleZoomOut}
            onPointerDown={() => startHoldZoom('out')}
            onPointerUp={stopHoldZoom}
            onPointerLeave={stopHoldZoom}
            onPointerCancel={stopHoldZoom}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors active:scale-95 touch-manipulation shadow-2xs"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Reset / Center View Button */}
          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-0.5" />
          <button
            id="btn-reset-camera-focus"
            type="button"
            aria-label={t('zoomCenter', language)}
            title={t('zoomCenter', language)}
            onClick={handleResetCamera}
            className="w-8 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 touch-manipulation"
          >
            <Focus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

