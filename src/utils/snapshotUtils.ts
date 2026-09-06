/**
 * Utility to capture high-resolution snapshots of the Three.js Voxel Canvas
 * Supports downloading to camera roll / photo gallery via Web Share API on mobile (iOS/Android),
 * and standard high-res image download fallback.
 */

export async function captureSceneSnapshot(): Promise<{ success: boolean; message?: string }> {
  try {
    const container = document.getElementById('voxel-canvas-container');
    if (!container) {
      throw new Error('Canvas container not found');
    }

    const canvas = container.querySelector('canvas');
    if (!canvas) {
      throw new Error('WebGL canvas element not found');
    }

    // Force high quality screenshot from WebGL context
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `voxel-world-${timestamp}.png`;

    // Convert dataUrl to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: 'image/png' });

    // 1. If Web Share API with files is supported (iOS Safari, Android Chrome/Samsung Internet)
    // This triggers native system share sheet where users can tap "Save Image" / "Salva immagine" directly to photo gallery
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Voxel Sandbox Snapshot',
          text: 'Screenshot del mio mondo Voxel!',
        });
        return { success: true, message: 'Snapshot condiviso con successo!' };
      } catch (shareErr) {
        // If user cancelled share sheet, fallback or ignore
        if ((shareErr as Error).name === 'AbortError') {
          return { success: true };
        }
      }
    }

    // 2. Direct Anchor download fallback (Desktop & mobile fallback)
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: 'Snapshot scaricato con successo!' };
  } catch (error) {
    console.error('Failed to take snapshot:', error);
    return { success: false, message: 'Errore durante lo scatto dello snapshot.' };
  }
}
