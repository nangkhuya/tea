import { AnimationClip, Group, Object3D, SkinnedMesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type AvatarMotion = 'idle' | 'walk' | 'seated-meditation' | 'tea-cup';
export interface AvatarModelAsset {
  id: string;
  url: string;
  source: 'configured-glb';
}
export interface AvatarModelReport {
  meshCount: number;
  skinnedMeshCount: number;
  skeletonCount: number;
  animationClips: string[];
  hasRig: boolean;
}

const configuredUrl = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
  ?.VITE_AVATAR_GLB_URL;

/** Empty unless a real model URL is configured. No demo or fabricated asset paths are registered. */
export const AVATAR_MODEL_MANIFEST: AvatarModelAsset[] = configuredUrl
  ? [{ id: 'primary-humanoid', url: configuredUrl, source: 'configured-glb' }]
  : [];

const cache = new Map<string, Promise<{ scene: Group; animations: AnimationClip[]; report: AvatarModelReport }>>();

export function inspectAvatarModel(root: Object3D, animations: AnimationClip[]): AvatarModelReport {
  let meshCount = 0;
  let skinnedMeshCount = 0;
  let skeletonCount = 0;
  root.traverse((node) => {
    const mesh = node as SkinnedMesh;
    if ((mesh as { isMesh?: boolean }).isMesh) meshCount += 1;
    if (mesh.isSkinnedMesh) {
      skinnedMeshCount += 1;
      if (mesh.skeleton) skeletonCount += 1;
    }
  });
  return {
    meshCount,
    skinnedMeshCount,
    skeletonCount,
    animationClips: animations.map((clip) => clip.name),
    hasRig: skinnedMeshCount > 0 && skeletonCount > 0,
  };
}

export function loadAvatarModel(asset: AvatarModelAsset, onProgress: (ratio: number) => void) {
  const cached = cache.get(asset.url);
  if (cached) return cached;
  const promise = new Promise<{ scene: Group; animations: AnimationClip[]; report: AvatarModelReport }>((resolve, reject) => {
    new GLTFLoader().load(
      asset.url,
      (gltf) => {
        const report = inspectAvatarModel(gltf.scene, gltf.animations);
        resolve({ scene: gltf.scene, animations: gltf.animations, report });
      },
      (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total);
      },
      reject,
    );
  });
  cache.set(asset.url, promise);
  promise.catch(() => cache.delete(asset.url));
  return promise;
}

export const MOTION_CLIP_HINTS: Record<AvatarMotion, string[]> = {
  idle: ['idle', 'breath', 'standing'],
  walk: ['walk', 'walking'],
  'seated-meditation': ['meditat', 'sit', 'seated'],
  'tea-cup': ['tea', 'cup', 'drink', 'raise'],
};

export function findMotionClip(clips: AnimationClip[], motion: AvatarMotion): AnimationClip | undefined {
  const hints = MOTION_CLIP_HINTS[motion];
  return clips.find((clip) => hints.some((hint) => clip.name.toLowerCase().includes(hint)));
}
