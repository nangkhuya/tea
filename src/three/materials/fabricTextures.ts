import * as THREE from 'three';
import {
  CLOTHING_PALETTE_OPTIONS,
  FABRIC_MATERIAL_OPTIONS,
  HAIR_COLOR_OPTIONS,
  SKIN_TONE_OPTIONS,
} from '../../features/avatar/assets/avatarRegistry';
import type {
  AvatarFabricMaterialId,
  AvatarHairColorId,
  AvatarPaletteColorId,
  SkinToneId,
} from '../../features/avatar/types/avatarTypes';

const textureCache = new Map<string, THREE.CanvasTexture>();

function createCanvas(size = 256): [HTMLCanvasElement, CanvasRenderingContext2D] | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return [canvas, ctx];
}

export function getFabricWeaveBumpTexture(
  materialId: AvatarFabricMaterialId,
  anisotropy = 4,
): THREE.CanvasTexture | null {
  const key = `fabric-bump-${materialId}`;
  const existing = textureCache.get(key);
  if (existing) {
    existing.anisotropy = anisotropy;
    return existing;
  }

  const pair = createCanvas(256);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  const spec =
    FABRIC_MATERIAL_OPTIONS.find((item) => item.id === materialId) ?? FABRIC_MATERIAL_OPTIONS[0];

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  const step = materialId === 'hemp' ? 8 : materialId === 'silk' ? 4 : 6;
  for (let y = 0; y < 256; y += step) {
    for (let x = 0; x < 256; x += step) {
      const parity = ((x / step + y / step) | 0) % 2 === 0;
      const jitter = ((Math.sin(x * 0.37 + y * 0.71) + 1) * 0.5) * 14 - 7;
      const base = parity ? 148 : 110;
      const val = Math.max(40, Math.min(220, Math.round(base + jitter)));
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(x, y, step - 1, step - 1);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(spec.weaveScale, spec.weaveScale);
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;

  textureCache.set(key, tex);
  return tex;
}

export function getWoodGrainTexture(anisotropy = 4): THREE.CanvasTexture | null {
  const key = 'wood-grain-albedo';
  const existing = textureCache.get(key);
  if (existing) {
    existing.anisotropy = anisotropy;
    return existing;
  }

  const pair = createCanvas(256);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  ctx.fillStyle = '#c4a886';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 2) {
    const wave = Math.sin(y * 0.09) * 12 + Math.cos(y * 0.23) * 6;
    const tone = Math.round(168 + wave);
    ctx.fillStyle = `rgba(${tone}, ${Math.round(tone * 0.82)}, ${Math.round(tone * 0.63)}, 0.42)`;
    ctx.fillRect(0, y, 256, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

export function getTatamiWeaveTexture(anisotropy = 4): THREE.CanvasTexture | null {
  const key = 'tatami-weave-albedo';
  const existing = textureCache.get(key);
  if (existing) {
    existing.anisotropy = anisotropy;
    return existing;
  }

  const pair = createCanvas(256);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  ctx.fillStyle = '#c9bf9d';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? '#bfb48f' : '#d2c9a9';
    ctx.fillRect(0, y, 256, 3);
  }
  for (let x = 0; x < 256; x += 16) {
    ctx.fillStyle = 'rgba(110, 102, 76, 0.14)';
    ctx.fillRect(x, 0, 1, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

export function getContactShadowTexture(): THREE.CanvasTexture | null {
  const key = 'contact-shadow-disc';
  const existing = textureCache.get(key);
  if (existing) return existing;

  const pair = createCanvas(128);
  if (!pair) return null;
  const [canvas, ctx] = pair;

  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
  grad.addColorStop(0, 'rgba(32, 26, 20, 0.55)');
  grad.addColorStop(0.55, 'rgba(32, 26, 20, 0.24)');
  grad.addColorStop(1, 'rgba(32, 26, 20, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

export function resolveSkinColors(toneId: SkinToneId) {
  return SKIN_TONE_OPTIONS.find((item) => item.id === toneId) ?? SKIN_TONE_OPTIONS[1];
}

export function resolveHairColors(colorId: AvatarHairColorId) {
  return HAIR_COLOR_OPTIONS.find((item) => item.id === colorId) ?? HAIR_COLOR_OPTIONS[0];
}

export function resolvePaletteHex(colorId: AvatarPaletteColorId): string {
  return CLOTHING_PALETTE_OPTIONS.find((item) => item.id === colorId)?.hex ?? '#F8F5EF';
}

export function resolveFabricSpec(materialId: AvatarFabricMaterialId) {
  return FABRIC_MATERIAL_OPTIONS.find((item) => item.id === materialId) ?? FABRIC_MATERIAL_OPTIONS[0];
}

export interface CharacterMaterialSet {
  skin: THREE.MeshPhysicalMaterial;
  skinLip: THREE.MeshStandardMaterial;
  eyeIris: THREE.MeshStandardMaterial;
  eyeSclera: THREE.MeshStandardMaterial;
  hair: THREE.MeshPhysicalMaterial;
  clothPrimary: THREE.MeshPhysicalMaterial;
  clothSecondary: THREE.MeshPhysicalMaterial;
  clothSash: THREE.MeshPhysicalMaterial;
  wood: THREE.MeshStandardMaterial;
  bamboo: THREE.MeshStandardMaterial;
  ceramic: THREE.MeshPhysicalMaterial;
  footwear: THREE.MeshStandardMaterial;
}

export function createCharacterMaterials(anisotropy = 4): CharacterMaterialSet {
  const skin = new THREE.MeshPhysicalMaterial({
    color: '#d7ad8d',
    roughness: 0.64,
    metalness: 0.0,
    sheen: 0.25,
    sheenRoughness: 0.78,
    sheenColor: new THREE.Color('#c88b74'),
  });

  const skinLip = new THREE.MeshStandardMaterial({
    color: '#b47463',
    roughness: 0.54,
    metalness: 0.0,
  });

  const eyeIris = new THREE.MeshStandardMaterial({
    color: '#2d231d',
    roughness: 0.22,
    metalness: 0.05,
  });

  const eyeSclera = new THREE.MeshStandardMaterial({
    color: '#f2eee7',
    roughness: 0.3,
    metalness: 0.0,
  });

  const hair = new THREE.MeshPhysicalMaterial({
    color: '#1e1c1a',
    roughness: 0.48,
    metalness: 0.04,
    sheen: 0.45,
    sheenRoughness: 0.42,
    sheenColor: new THREE.Color('#4a433d'),
  });

  const bump = getFabricWeaveBumpTexture('linen', anisotropy);

  const clothPrimary = new THREE.MeshPhysicalMaterial({
    color: '#F8F5EF',
    roughness: 0.88,
    metalness: 0.01,
    sheen: 0.22,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color('#ffffff'),
    bumpMap: bump,
    bumpScale: 0.016,
  });

  const clothSecondary = new THREE.MeshPhysicalMaterial({
    color: '#737B62',
    roughness: 0.88,
    metalness: 0.01,
    sheen: 0.2,
    sheenRoughness: 0.8,
    bumpMap: bump,
    bumpScale: 0.014,
  });

  const clothSash = new THREE.MeshPhysicalMaterial({
    color: '#72543D',
    roughness: 0.82,
    metalness: 0.02,
    sheen: 0.28,
    sheenRoughness: 0.75,
    bumpMap: bump,
    bumpScale: 0.012,
  });

  const wood = new THREE.MeshStandardMaterial({
    color: '#6b4d35',
    roughness: 0.56,
    metalness: 0.04,
  });

  const bamboo = new THREE.MeshStandardMaterial({
    color: '#8f966f',
    roughness: 0.48,
    metalness: 0.02,
  });

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: '#e8e1d3',
    roughness: 0.28,
    metalness: 0.02,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
  });

  const footwear = new THREE.MeshStandardMaterial({
    color: '#3c342d',
    roughness: 0.78,
    metalness: 0.02,
  });

  return {
    skin,
    skinLip,
    eyeIris,
    eyeSclera,
    hair,
    clothPrimary,
    clothSecondary,
    clothSash,
    wood,
    bamboo,
    ceramic,
    footwear,
  };
}

export function updateCharacterMaterials(
  mats: CharacterMaterialSet,
  params: {
    skinTone: SkinToneId;
    hairColor: AvatarHairColorId;
    fabric: AvatarFabricMaterialId;
    primary: AvatarPaletteColorId;
    secondary: AvatarPaletteColorId;
    sash: AvatarPaletteColorId;
    anisotropy?: number;
  },
) {
  const skinSpec = resolveSkinColors(params.skinTone);
  mats.skin.color.set(skinSpec.hex);
  mats.skin.sheenColor.set(skinSpec.subsurfaceHex);

  const lipColor = new THREE.Color(skinSpec.subsurfaceHex).lerp(new THREE.Color('#9a5248'), 0.48);
  mats.skinLip.color.copy(lipColor);

  const hairSpec = resolveHairColors(params.hairColor);
  mats.hair.color.set(hairSpec.hex);
  mats.hair.sheenColor.set(hairSpec.highlightHex);

  const fabricSpec = resolveFabricSpec(params.fabric);
  const bump = getFabricWeaveBumpTexture(params.fabric, params.anisotropy ?? 4);

  mats.clothPrimary.color.set(resolvePaletteHex(params.primary));
  mats.clothSecondary.color.set(resolvePaletteHex(params.secondary));
  mats.clothSash.color.set(resolvePaletteHex(params.sash));

  for (const clothMat of [mats.clothPrimary, mats.clothSecondary, mats.clothSash]) {
    clothMat.roughness = fabricSpec.roughness;
    clothMat.metalness = fabricSpec.metalness;
    clothMat.sheen = fabricSpec.sheen;
    clothMat.bumpMap = bump;
    clothMat.bumpScale = fabricSpec.bumpScale;
    clothMat.needsUpdate = true;
  }
}

export function disposeCharacterMaterials(mats: CharacterMaterialSet) {
  Object.values(mats).forEach((m) => m.dispose());
}
