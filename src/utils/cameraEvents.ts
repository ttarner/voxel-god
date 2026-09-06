// Event bus for camera zoom, focus, and turntable recording operations across 2D HUD and 3D Canvas
type ZoomCallback = (deltaRatio: number) => void;
type ResetCallback = () => void;

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
}

type PoseCallback = (pose: CameraPose) => void;
type RenderRequestCallback = () => void;

class CameraEventBus {
  private zoomListeners: Set<ZoomCallback> = new Set();
  private resetListeners: Set<ResetCallback> = new Set();
  private poseListeners: Set<PoseCallback> = new Set();
  private renderListeners: Set<RenderRequestCallback> = new Set();
  private currentPoseGetter: (() => CameraPose | null) | null = null;

  onZoom(cb: ZoomCallback) {
    this.zoomListeners.add(cb);
    return () => {
      this.zoomListeners.delete(cb);
    };
  }

  onReset(cb: ResetCallback) {
    this.resetListeners.add(cb);
    return () => {
      this.resetListeners.delete(cb);
    };
  }

  onSetPose(cb: PoseCallback) {
    this.poseListeners.add(cb);
    return () => {
      this.poseListeners.delete(cb);
    };
  }

  onRenderRequest(cb: RenderRequestCallback) {
    this.renderListeners.add(cb);
    return () => {
      this.renderListeners.delete(cb);
    };
  }

  registerPoseGetter(getter: () => CameraPose | null) {
    this.currentPoseGetter = getter;
    return () => {
      if (this.currentPoseGetter === getter) {
        this.currentPoseGetter = null;
      }
    };
  }

  getCurrentPose(): CameraPose | null {
    if (this.currentPoseGetter) {
      return this.currentPoseGetter();
    }
    return null;
  }

  setPose(pose: CameraPose) {
    this.poseListeners.forEach((cb) => {
      try {
        cb(pose);
      } catch (err) {
        console.warn('Error in camera pose listener:', err);
      }
    });
  }

  requestRender() {
    this.renderListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('Error in render listener:', err);
      }
    });
  }

  zoom(deltaRatio: number) {
    this.zoomListeners.forEach((cb) => {
      try {
        cb(deltaRatio);
      } catch (err) {
        console.warn('Error in camera zoom listener:', err);
      }
    });
  }

  reset() {
    this.resetListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('Error in camera reset listener:', err);
      }
    });
  }
}

export const cameraEvents = new CameraEventBus();

