import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { cameraEvents, CameraPose } from './cameraEvents';
import { ConcreteBlockType } from '../types';

export interface TurntableOptions {
  format: 'gif' | 'webm';
  resolution: number; // e.g. 400
  fps: number; // e.g. 15 for gif, 30 for webm
  duration: number; // e.g. 3 seconds
  elevationAngle?: number; // degrees, default 35
  onProgress?: (progress: number, statusText: string) => void;
  shouldCancel?: () => boolean;
}

export interface TurntableResult {
  blob: Blob;
  url: string;
  filename: string;
  sizeBytes: number;
  format: 'gif' | 'webm';
  width: number;
  height: number;
}

/**
 * Calculates optimal framing (center, radius, height) for the turntable loop
 * based on current placed blocks in the scene.
 */
export function calculateBuildFraming(
  blocks: Record<string, ConcreteBlockType>,
  elevationAngleDeg = 35
): { target: [number, number, number]; radius: number; height: number } {
  const keys = Object.keys(blocks);

  if (keys.length === 0) {
    return {
      target: [0, 1.2, 0],
      radius: 15,
      height: 9,
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const key of keys) {
    const [x, y, z] = key.split(',').map(Number);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = Math.max((minY + maxY) / 2, 0.5);
  const centerZ = (minZ + maxZ) / 2;

  const sizeX = maxX - minX + 1;
  const sizeY = maxY - minY + 1;
  const sizeZ = maxZ - minZ + 1;
  const maxHorizontal = Math.max(sizeX, sizeZ, 3);
  const maxHeight = Math.max(sizeY, 2);

  // Optical distance framing
  const baseDistance = Math.max(maxHorizontal * 1.5, maxHeight * 1.6, 9);
  const clampedRadius = Math.min(Math.max(baseDistance, 8), 34);

  const angleRad = (elevationAngleDeg * Math.PI) / 180;
  const height = centerY + clampedRadius * Math.tan(angleRad);

  return {
    target: [centerX, centerY, centerZ],
    radius: clampedRadius,
    height: Math.min(Math.max(height, 4), 30),
  };
}

/**
 * Captures an offscreen square crop from the WebGL canvas.
 */
function grabCanvasSquare(
  webglCanvas: HTMLCanvasElement,
  offscreenCanvas: HTMLCanvasElement,
  offscreenCtx: CanvasRenderingContext2D,
  targetSize: number
): ImageData {
  const srcW = webglCanvas.width;
  const srcH = webglCanvas.height;

  const minDim = Math.min(srcW, srcH);
  const srcX = Math.round((srcW - minDim) / 2);
  const srcY = Math.round((srcH - minDim) / 2);

  offscreenCtx.imageSmoothingEnabled = true;
  offscreenCtx.imageSmoothingQuality = 'high';

  offscreenCtx.clearRect(0, 0, targetSize, targetSize);
  offscreenCtx.drawImage(
    webglCanvas,
    srcX,
    srcY,
    minDim,
    minDim,
    0,
    0,
    targetSize,
    targetSize
  );

  return offscreenCtx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * Records a spinning 3D loop and outputs a lightweight animated GIF
 */
export async function recordTurntableGIF(
  blocks: Record<string, ConcreteBlockType>,
  options: TurntableOptions
): Promise<TurntableResult> {
  const {
    resolution = 400,
    fps = 15,
    duration = 2.8,
    elevationAngle = 35,
    onProgress,
    shouldCancel,
  } = options;

  const container = document.getElementById('voxel-canvas-container');
  if (!container) throw new Error('Voxel canvas container not found');
  const webglCanvas = container.querySelector('canvas');
  if (!webglCanvas) throw new Error('WebGL canvas not found');

  // Save current camera pose for seamless restoration
  const originalPose: CameraPose = cameraEvents.getCurrentPose() || {
    position: [11, 14, 16],
    target: [0, 1.2, 0],
  };

  const framing = calculateBuildFraming(blocks, elevationAngle);
  const totalFrames = Math.max(Math.round(fps * duration), 18);
  const frameDelayMs = Math.round(1000 / fps);

  // Setup offscreen canvas
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = resolution;
  offscreenCanvas.height = resolution;
  const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
  if (!offscreenCtx) throw new Error('Could not create offscreen canvas context');

  const encoder = GIFEncoder();

  try {
    onProgress?.(5, 'Inizializzazione vista 3D...');

    for (let frame = 0; frame < totalFrames; frame++) {
      if (shouldCancel?.()) {
        throw new Error('Cancellato dall’utente');
      }

      // Compute camera angle around 360° circle (0 to 2PI)
      const angle = (frame / totalFrames) * (Math.PI * 2);
      const posX = framing.target[0] + framing.radius * Math.sin(angle);
      const posZ = framing.target[2] + framing.radius * Math.cos(angle);
      const posY = framing.height;

      // Update camera pose
      cameraEvents.setPose({
        position: [posX, posY, posZ],
        target: framing.target,
      });

      // Allow Three.js to render
      cameraEvents.requestRender();
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 16));

      // Grab frame
      const imageData = grabCanvasSquare(
        webglCanvas,
        offscreenCanvas,
        offscreenCtx,
        resolution
      );

      // Quantize & write frame to GIF
      const palette = quantize(imageData.data, 256);
      const index = applyPalette(imageData.data, palette);

      encoder.writeFrame(index, resolution, resolution, {
        palette,
        delay: frameDelayMs,
        repeat: 0, // loop forever
      });

      const pct = Math.round(10 + ((frame + 1) / totalFrames) * 85);
      onProgress?.(pct, `Cattura fotogramma ${frame + 1}/${totalFrames}...`);
    }

    onProgress?.(96, 'Finalizzazione file GIF...');
    encoder.finish();
    const bytes = encoder.bytes();
    const blob = new Blob([bytes], { type: 'image/gif' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `voxel-loop-${timestamp}.gif`;

    onProgress?.(100, 'Animazione GIF pronta!');

    return {
      blob,
      url,
      filename,
      sizeBytes: blob.size,
      format: 'gif',
      width: resolution,
      height: resolution,
    };
  } finally {
    // Restore initial camera pose
    cameraEvents.setPose(originalPose);
    cameraEvents.requestRender();
  }
}

/**
 * Records a spinning 3D loop in real-time and outputs a WebM video
 */
export async function recordTurntableWebM(
  blocks: Record<string, ConcreteBlockType>,
  options: TurntableOptions
): Promise<TurntableResult> {
  const {
    resolution = 480,
    fps = 30,
    duration = 3.0,
    elevationAngle = 35,
    onProgress,
    shouldCancel,
  } = options;

  const container = document.getElementById('voxel-canvas-container');
  if (!container) throw new Error('Voxel canvas container not found');
  const webglCanvas = container.querySelector('canvas');
  if (!webglCanvas) throw new Error('WebGL canvas not found');

  if (typeof MediaRecorder === 'undefined') {
    throw new Error('MediaRecorder non è supportato in questo browser');
  }

  const originalPose: CameraPose = cameraEvents.getCurrentPose() || {
    position: [11, 14, 16],
    target: [0, 1.2, 0],
  };

  const framing = calculateBuildFraming(blocks, elevationAngle);

  // Setup offscreen canvas for square stream
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = resolution;
  offscreenCanvas.height = resolution;
  const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: false });
  if (!offscreenCtx) throw new Error('Could not create offscreen canvas context');

  // Find supported mime type
  const mimeType = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ].find((type) => MediaRecorder.isTypeSupported(type)) || 'video/webm';

  const stream = offscreenCanvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2500000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  try {
    onProgress?.(5, 'Avvio registrazione WebM...');

    const startTime = performance.now();
    const durationMs = duration * 1000;

    recorder.start(100);

    await new Promise<void>((resolve, reject) => {
      function step() {
        if (shouldCancel?.()) {
          recorder.stop();
          reject(new Error('Cancellato dall’utente'));
          return;
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1.0);

        // Compute turntable angle (0 to 2PI)
        const angle = progress * (Math.PI * 2);
        const posX = framing.target[0] + framing.radius * Math.sin(angle);
        const posZ = framing.target[2] + framing.radius * Math.cos(angle);
        const posY = framing.height;

        cameraEvents.setPose({
          position: [posX, posY, posZ],
          target: framing.target,
        });

        cameraEvents.requestRender();

        // Draw centered square to offscreen canvas
        grabCanvasSquare(webglCanvas, offscreenCanvas, offscreenCtx!, resolution);

        const pct = Math.round(10 + progress * 80);
        onProgress?.(pct, `Registrazione 3D in corso (${Math.round(progress * 100)}%)...`);

        if (progress < 1.0) {
          requestAnimationFrame(step);
        } else {
          recorder.onstop = () => resolve();
          recorder.stop();
        }
      }

      requestAnimationFrame(step);
    });

    onProgress?.(95, 'Finalizzazione video WebM...');
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `voxel-loop-${timestamp}.webm`;

    onProgress?.(100, 'Video WebM pronto!');

    return {
      blob,
      url,
      filename,
      sizeBytes: blob.size,
      format: 'webm',
      width: resolution,
      height: resolution,
    };
  } finally {
    cameraEvents.setPose(originalPose);
    cameraEvents.requestRender();
  }
}

/**
 * Native file sharing or download helper
 */
export async function downloadOrShareTurntable(result: TurntableResult): Promise<boolean> {
  try {
    const file = new File([result.blob], result.filename, { type: result.blob.type });

    // 1. If Web Share API with files is available (mobile iOS/Android)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Voxel 3D Loop',
          text: 'Guarda la mia animazione 3D Voxel!',
        });
        return true;
      } catch (shareErr) {
        if ((shareErr as Error).name === 'AbortError') {
          return true;
        }
      }
    }

    // 2. Direct Anchor download fallback
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download or share animation:', err);
    return false;
  }
}

/**
 * Format bytes nicely
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
