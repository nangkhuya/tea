import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeletonScene } from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  ANIMATION_REGISTRY,
  type ConfiguredGlbAsset,
} from '../../features/avatar/assets/avatarRegistry';
import type {
  AvatarAnimationId,
  AvatarConfigV3,
  AvatarModelCapabilities,
} from '../../features/avatar/types/avatarTypes';
import {
  resolveFabricSpec,
  resolveHairColors,
  resolvePaletteHex,
  resolveSkinColors,
} from '../materials/fabricTextures';

THREE.Cache.enabled = true;

export interface LoadedGlbEntry {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  capabilities: AvatarModelCapabilities;
}

const gltfPromiseCache = new Map<string, Promise<LoadedGlbEntry>>();

export function findGlbClipForAnimation(
  clips: THREE.AnimationClip[],
  animationId: AvatarAnimationId,
): THREE.AnimationClip | undefined {
  const entry = ANIMATION_REGISTRY.find((item) => item.id === animationId);
  if (!entry) return undefined;
  return clips.find((clip) => {
    const lower = clip.name.toLowerCase();
    return entry.glbClipHints.some((hint) => lower.includes(hint));
  });
}

export function inspectLoadedGlb(
  root: THREE.Object3D,
  animations: THREE.AnimationClip[],
): AvatarModelCapabilities {
  let meshCount = 0;
  let skinnedMeshCount = 0;
  let skeletonBoneCount = 0;
  const morphTargets = new Set<string>();
  let supportsMaterialTinting = false;

  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.isMesh) {
      meshCount += 1;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      const label = `${node.name} ${mat?.name ?? ''}`.toLowerCase();
      if (/skin|body|face|head|cloth|robe|outfit|garment|hair/.test(label)) {
        supportsMaterialTinting = true;
      }
      if (mesh.morphTargetDictionary) {
        Object.keys(mesh.morphTargetDictionary).forEach((key) => morphTargets.add(key));
      }
    }
    const skinned = node as THREE.SkinnedMesh;
    if (skinned.isSkinnedMesh && skinned.skeleton) {
      skinnedMeshCount += 1;
      skeletonBoneCount = Math.max(skeletonBoneCount, skinned.skeleton.bones.length);
    }
  });

  const hasSkeletonRig = skinnedMeshCount > 0 && skeletonBoneCount > 0;
  const availableAnimations = ANIMATION_REGISTRY.filter((anim) =>
    Boolean(findGlbClipForAnimation(animations, anim.id)),
  ).map((anim) => anim.id);
  const unavailableAnimations = ANIMATION_REGISTRY.filter(
    (anim) => !availableAnimations.includes(anim.id),
  ).map((anim) => anim.id);

  return {
    sourceMode: 'external-glb',
    hasSkeletonRig,
    supportsBodyScaling: true,
    supportsShoulderWidth: hasSkeletonRig,
    supportsFacialMorphs: morphTargets.size > 0,
    availableMorphTargets: Array.from(morphTargets),
    supportsMaterialTinting,
    availableAnimations,
    unavailableAnimations,
    meshCount,
    skinnedMeshCount,
    skeletonBoneCount,
    statusDetails: `${meshCount} meshes · ${skeletonBoneCount} bones · ${animations.length} clips`,
  };
}

export function loadGlbAvatarAsset(
  asset: ConfiguredGlbAsset,
  onProgress?: (ratio: number) => void,
): Promise<LoadedGlbEntry> {
  const cached = gltfPromiseCache.get(asset.url);
  if (cached) {
    return cached.then((entry) => ({
      scene: cloneSkeletonScene(entry.scene) as THREE.Group,
      animations: entry.animations,
      capabilities: entry.capabilities,
    }));
  }

  const loader = new GLTFLoader();
  const promise = new Promise<LoadedGlbEntry>((resolve, reject) => {
    loader.load(
      asset.url,
      (gltf) => {
        gltf.scene.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        const capabilities = inspectLoadedGlb(gltf.scene, gltf.animations);
        resolve({
          scene: gltf.scene,
          animations: gltf.animations,
          capabilities,
        });
      },
      (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(event.loaded / event.total);
        }
      },
      reject,
    );
  });

  gltfPromiseCache.set(asset.url, promise);
  promise.catch(() => gltfPromiseCache.delete(asset.url));

  return promise.then((entry) => ({
    scene: cloneSkeletonScene(entry.scene) as THREE.Group,
    animations: entry.animations,
    capabilities: entry.capabilities,
  }));
}

export function applyConfigToLoadedGlb(root: THREE.Object3D, config: AvatarConfigV3) {
  root.scale.setScalar(config.body.heightScale);

  const skinHex = resolveSkinColors(config.skin.tone).hex;
  const hairHex = resolveHairColors(config.hairColor).hex;
  const primaryHex = resolvePaletteHex(config.clothingColors.primary);
  const secondaryHex = resolvePaletteHex(config.clothingColors.secondary);
  const sashHex = resolvePaletteHex(config.clothingColors.sash);
  const fabricSpec = resolveFabricSpec(config.clothing.material);

  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of materials) {
      const std = mat as THREE.MeshStandardMaterial;
      if (!std) continue;
      const name = `${node.name} ${std.name ?? ''}`.toLowerCase();
      if (/skin|body|face|head/.test(name)) {
        std.color?.set(skinHex);
      } else if (/sash|belt|obi/.test(name)) {
        std.color?.set(sashHex);
        std.roughness = fabricSpec.roughness;
      } else if (/trim|collar|accent|secondary/.test(name)) {
        std.color?.set(secondaryHex);
        std.roughness = fabricSpec.roughness;
      } else if (/cloth|robe|outfit|garment|kimono|hanfu|shirt|pants|skirt/.test(name)) {
        std.color?.set(primaryHex);
        std.roughness = fabricSpec.roughness;
      } else if (/hair/.test(name)) {
        std.color?.set(hairHex);
      }
    }

    if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
      const dict = mesh.morphTargetDictionary;
      const inf = mesh.morphTargetInfluences;
      for (const [key, idx] of Object.entries(dict)) {
        const lower = key.toLowerCase();
        if (/smile|happy/.test(lower)) {
          inf[idx] =
            config.face.expression === 'gentle-smile'
              ? 0.45
              : config.face.expression === 'serene'
                ? 0.22
                : 0;
        } else if (/jaw|chin/.test(lower)) {
          inf[idx] = Math.max(0, config.face.jawline);
        }
      }
    }
  });
}
