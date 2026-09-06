/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { VoxelScene } from './components/VoxelScene';
import { VoxelHotbar } from './components/VoxelHotbar';
import { TopBar } from './components/TopBar';
import { ChallengeHUD } from './components/ChallengeHUD';
import { ChallengeCollectionModal } from './components/ChallengeCollectionModal';
import { ChallengeCelebrationModal } from './components/ChallengeCelebrationModal';
import { PresetsModal } from './components/PresetsModal';
import { HelpModal } from './components/HelpModal';
import { PastelColorStudioModal } from './components/PastelColorStudioModal';
import { ZoomControls } from './components/ZoomControls';
import { InitialModeModal } from './components/InitialModeModal';
import { useWorldStore } from './store/worldStore';
import { HOTBAR_BLOCKS } from './utils/blockConfig';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'voxel_sandbox_world_v1';

export default function App() {
  const [isInitialScreenOpen, setIsInitialScreenOpen] = useState(true);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  const gameMode = useWorldStore((state) => state.gameMode);
  const blocks = useWorldStore((state) => state.blocks);
  const initFromStorage = useWorldStore((state) => state.initFromStorage);
  const setMode = useWorldStore((state) => state.setMode);
  const setSelectedBlock = useWorldStore((state) => state.setSelectedBlock);
  const cycleSymmetryMode = useWorldStore((state) => state.cycleSymmetryMode);
  const undo = useWorldStore((state) => state.undo);
  const redo = useWorldStore((state) => state.redo);

  // Initial mount: load world from localStorage
  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  // Persistence: Serialize and save sandbox world to localStorage on change
  useEffect(() => {
    try {
      if (gameMode === 'sandbox' && blocks && typeof blocks === 'object') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
      }
    } catch (err) {
      console.warn('Failed to save voxel world to localStorage:', err);
    }
  }, [blocks, gameMode]);

  // Global desktop keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // 1-8 for selecting hotbar blocks
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= HOTBAR_BLOCKS.length) {
        setSelectedBlock(HOTBAR_BLOCKS[num - 1]);
        setMode('build');
      } else if (e.key.toLowerCase() === 'b') {
        setMode('build');
      } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'x') {
        setMode('destroy');
      } else if (e.key.toLowerCase() === 'm') {
        cycleSymmetryMode();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redo, setMode, setSelectedBlock, undo]);

  // Audio Context wake-up on first user interaction / touch / pointerdown
  useEffect(() => {
    const handleFirstInteraction = () => {
      sounds.resumeContextOnUserGesture();
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return (
    <main
      id="app-root"
      className="fixed inset-0 w-full h-full h-[100dvh] overflow-hidden bg-[#e8f0fe] select-none touch-none overscroll-none"
    >
      {/* 3D Voxel Viewport Canvas */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <VoxelScene isInitialScreenOpen={isInitialScreenOpen} />
      </div>

      {/* Top HUD overlay */}
      {!isInitialScreenOpen && (
        <TopBar
          onOpenPresets={() => setIsPresetsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenColors={() => setIsColorsOpen(true)}
          onOpenCollection={() => setIsCollectionOpen(true)}
          onOpenInitialScreen={() => setIsInitialScreenOpen(true)}
        />
      )}

      {/* Challenge Mode Floating HUD Banner */}
      {!isInitialScreenOpen && (
        <ChallengeHUD
          onOpenCollection={() => setIsCollectionOpen(true)}
          onOpenInitialScreen={() => setIsInitialScreenOpen(true)}
        />
      )}

      {/* Bottom HUD Hotbar overlay */}
      {!isInitialScreenOpen && <VoxelHotbar />}

      {/* 1-Finger Zoom Controls (Side Floating HUD) */}
      {!isInitialScreenOpen && <ZoomControls />}

      {/* Initial Screen / Mode Selector Modal */}
      <InitialModeModal
        isOpen={isInitialScreenOpen}
        onClose={() => setIsInitialScreenOpen(false)}
        onOpenHelp={() => {
          setIsInitialScreenOpen(false);
          setIsHelpOpen(true);
        }}
        onOpenPresets={() => {
          setIsInitialScreenOpen(false);
          setIsPresetsOpen(true);
        }}
        onOpenColors={() => {
          setIsInitialScreenOpen(false);
          setIsColorsOpen(true);
        }}
        onOpenCollection={() => {
          setIsInitialScreenOpen(false);
          setIsCollectionOpen(true);
        }}
      />

      {/* Challenge Collection Modal (Raccolta configurazioni completate e da completare) */}
      <ChallengeCollectionModal
        isOpen={isCollectionOpen}
        onClose={() => setIsCollectionOpen(false)}
      />

      {/* Challenge Victory Celebration Modal */}
      <ChallengeCelebrationModal
        onOpenCollection={() => setIsCollectionOpen(true)}
        onOpenInitialScreen={() => setIsInitialScreenOpen(true)}
      />

      {/* Pastel Color Studio Modal */}
      <PastelColorStudioModal
        isOpen={isColorsOpen}
        onClose={() => setIsColorsOpen(false)}
      />

      {/* World Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
      />

      {/* Gesture & Controls Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </main>
  );
}
