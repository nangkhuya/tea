import { create } from 'zustand';
import type { SceneBoundaryState } from '../types/domain';

interface SceneStoreState extends SceneBoundaryState {
  detectWebGLSupport: () => boolean;
  enterTeaSpaceBoundary: (roomId: string) => void;
  leaveTeaSpaceBoundary: () => void;
  setCameraMode: (mode: SceneBoundaryState['cameraMode']) => void;
}

export const useSceneStore = create<SceneStoreState>((set) => ({
  activeRoomId: null,
  cameraMode: 'third-person',
  assetPipelineStatus: 'phase-01-boundary',
  webGLSupported: null,
  is3DImplemented: false,
  detectWebGLSupport: () => {
    if (typeof document === 'undefined') {
      return false;
    }
    try {
      const canvas = document.createElement('canvas');
      const supported = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
      );
      set({ webGLSupported: supported });
      return supported;
    } catch {
      set({ webGLSupported: false });
      return false;
    }
  },
  enterTeaSpaceBoundary: (roomId) => set({ activeRoomId: roomId }),
  leaveTeaSpaceBoundary: () => set({ activeRoomId: null }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
}));
