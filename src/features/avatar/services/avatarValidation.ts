import { DEFAULT_AVATAR_CONFIG } from '../../../config/constants';
import {
  ACCESSORY_REGISTRY,
  ANIMATION_REGISTRY,
  BASE_CHARACTER_MODELS,
  BODY_BUILD_OPTIONS,
  CLOTHING_PALETTE_OPTIONS,
  CLOTHING_REGISTRY,
  EXPRESSION_OPTIONS,
  EYEBROW_SHAPE_OPTIONS,
  EYE_SHAPE_OPTIONS,
  FACE_SHAPE_OPTIONS,
  FABRIC_MATERIAL_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIRSTYLE_REGISTRY,
  LIP_SHAPE_OPTIONS,
  NOSE_SHAPE_OPTIONS,
  SKIN_TONE_OPTIONS,
  getHairstylesForPresentation,
} from '../assets/avatarRegistry';
import type {
  AvatarAccessoryId,
  AvatarClothingStyleId,
  AvatarConfigV3,
  AvatarHairColorId,
  AvatarHairStyleId,
  AvatarPaletteColorId,
  AvatarValidationResult,
  GenderPresentation,
} from '../types/avatarTypes';

const VALID_PRESENTATIONS = new Set<GenderPresentation>(['feminine', 'masculine', 'neutral']);
const VALID_SKIN_TONES = new Set(SKIN_TONE_OPTIONS.map((x) => x.id));
const VALID_BUILDS = new Set(BODY_BUILD_OPTIONS.map((x) => x.id));
const VALID_FACE_SHAPES = new Set(FACE_SHAPE_OPTIONS.map((x) => x.id));
const VALID_EYE_SHAPES = new Set(EYE_SHAPE_OPTIONS.map((x) => x.id));
const VALID_EYEBROW_SHAPES = new Set(EYEBROW_SHAPE_OPTIONS.map((x) => x.id));
const VALID_NOSE_SHAPES = new Set(NOSE_SHAPE_OPTIONS.map((x) => x.id));
const VALID_LIP_SHAPES = new Set(LIP_SHAPE_OPTIONS.map((x) => x.id));
const VALID_EXPRESSIONS = new Set(EXPRESSION_OPTIONS.map((x) => x.id));
const VALID_HAIRSTYLES = new Set(HAIRSTYLE_REGISTRY.map((x) => x.id));
const VALID_HAIR_COLORS = new Set(HAIR_COLOR_OPTIONS.map((x) => x.id));
const VALID_CLOTHING = new Set(CLOTHING_REGISTRY.map((x) => x.id));
const VALID_MATERIALS = new Set(FABRIC_MATERIAL_OPTIONS.map((x) => x.id));
const VALID_PALETTE_COLORS = new Set(CLOTHING_PALETTE_OPTIONS.map((x) => x.id));
const VALID_ACCESSORIES = new Set(ACCESSORY_REGISTRY.map((x) => x.id));
const VALID_ANIMATIONS = new Set(ANIMATION_REGISTRY.map((x) => x.id));
const VALID_CHARACTER_IDS = new Set([
  ...BASE_CHARACTER_MODELS.map((x) => x.id),
  'configured-external-glb',
]);

function clamp(value: number, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value * 100) / 100));
}

export function sanitizeIdentifier(input: unknown, fallback: string): string {
  if (typeof input !== 'string') return fallback;
  const cleaned = input.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  return cleaned || fallback;
}

const LEGACY_HAIR_MAP: Record<string, AvatarHairStyleId> = {
  'low-bun': 'traditional-bun',
  'shoulder-natural': 'loose-natural',
  'short-neat': 'short-natural',
  'pinned-classic': 'traditional-bun',
};

const LEGACY_HAIR_COLOR_MAP: Record<string, AvatarHairColorId> = {
  espresso: 'dark-brown',
  chestnut: 'chestnut',
  silver: 'silver-grey',
};

const LEGACY_CLOTHING_MAP: Record<string, AvatarClothingStyleId> = {
  'natural-linen': 'linen-samue',
  'hanfu-scholar': 'scholar-robe',
  'zen-yukata': 'simple-yukata',
  'tea-robe': 'minimal-kimono',
  'modern-linen': 'linen-shirt-trousers',
};

const LEGACY_COLOR_MAP: Record<string, AvatarPaletteColorId> = {
  'warm-ivory': 'ivory',
  'moss-green': 'moss-green',
  'muted-indigo': 'indigo',
  'walnut-earth': 'walnut',
};

const LEGACY_ACCESSORY_MAP: Record<string, AvatarAccessoryId> = {
  'wooden-hairpin': 'wooden-hairpin',
  'tea-beads': 'wooden-bracelet',
};

export function characterIdForPresentation(presentation: GenderPresentation): string {
  if (presentation === 'feminine') return 'zen-humanoid-feminine';
  if (presentation === 'masculine') return 'zen-humanoid-masculine';
  return 'zen-humanoid-neutral';
}

/**
 * Migrates v1 / v2 / partial AvatarConfig shapes into a valid v3 AvatarConfig.
 */
export function migrateAvatarConfig(raw: unknown): AvatarConfigV3 {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_AVATAR_CONFIG };
  }
  const obj = raw as Record<string, unknown>;

  if (obj.schemaVersion === 3) {
    return sanitizeAvatarConfig(obj as Partial<AvatarConfigV3>);
  }

  // Migrate v2 / v1 format
  const appearance = (obj.appearance ?? {}) as Record<string, unknown>;
  const body = (obj.body ?? {}) as Record<string, unknown>;
  const colors = (obj.colors ?? {}) as Record<string, unknown>;

  const presentation = VALID_PRESENTATIONS.has(appearance.presentation as GenderPresentation)
    ? (appearance.presentation as GenderPresentation)
    : DEFAULT_AVATAR_CONFIG.genderPresentation;

  const legacyHair = typeof obj.hairstyle === 'string' ? LEGACY_HAIR_MAP[obj.hairstyle] ?? obj.hairstyle : undefined;
  const legacyHairColor = typeof obj.hairColor === 'string' ? LEGACY_HAIR_COLOR_MAP[obj.hairColor] ?? obj.hairColor : undefined;
  const legacyClothing = typeof obj.clothing === 'string' ? LEGACY_CLOTHING_MAP[obj.clothing] ?? obj.clothing : undefined;
  const legacyPrimary = typeof colors.primary === 'string' ? LEGACY_COLOR_MAP[colors.primary] ?? colors.primary : undefined;
  const legacyAccent = typeof colors.accent === 'string' ? LEGACY_COLOR_MAP[colors.accent] ?? colors.accent : undefined;
  const legacyFace = appearance.facePreset === 'soft' || appearance.facePreset === 'oval' || appearance.facePreset === 'defined'
    ? appearance.facePreset
    : DEFAULT_AVATAR_CONFIG.face.faceShape;

  const rawAcc = Array.isArray(obj.accessories) ? obj.accessories : [];
  const mappedAcc = rawAcc
    .map((a) => (typeof a === 'string' ? LEGACY_ACCESSORY_MAP[a] ?? a : ''))
    .filter((a): a is AvatarAccessoryId => VALID_ACCESSORIES.has(a as AvatarAccessoryId));

  return sanitizeAvatarConfig({
    schemaVersion: 3,
    characterId: characterIdForPresentation(presentation),
    genderPresentation: presentation,
    body: {
      ...DEFAULT_AVATAR_CONFIG.body,
      heightScale: typeof body.heightScale === 'number' ? body.heightScale : DEFAULT_AVATAR_CONFIG.body.heightScale,
      posture: body.posture === 'relaxed-tea' ? 'relaxed-tea' : 'upright-calm',
    },
    face: {
      ...DEFAULT_AVATAR_CONFIG.face,
      faceShape: legacyFace,
    },
    skin: {
      tone: VALID_SKIN_TONES.has(appearance.skinTone as AvatarConfigV3['skin']['tone'])
        ? (appearance.skinTone as AvatarConfigV3['skin']['tone'])
        : DEFAULT_AVATAR_CONFIG.skin.tone,
    },
    hairstyle: VALID_HAIRSTYLES.has(legacyHair as AvatarHairStyleId)
      ? (legacyHair as AvatarHairStyleId)
      : DEFAULT_AVATAR_CONFIG.hairstyle,
    hairColor: VALID_HAIR_COLORS.has(legacyHairColor as AvatarHairColorId)
      ? (legacyHairColor as AvatarHairColorId)
      : DEFAULT_AVATAR_CONFIG.hairColor,
    clothing: {
      style: VALID_CLOTHING.has(legacyClothing as AvatarClothingStyleId)
        ? (legacyClothing as AvatarClothingStyleId)
        : DEFAULT_AVATAR_CONFIG.clothing.style,
      material: DEFAULT_AVATAR_CONFIG.clothing.material,
    },
    clothingColors: {
      primary: VALID_PALETTE_COLORS.has(legacyPrimary as AvatarPaletteColorId)
        ? (legacyPrimary as AvatarPaletteColorId)
        : DEFAULT_AVATAR_CONFIG.clothingColors.primary,
      secondary: VALID_PALETTE_COLORS.has(legacyAccent as AvatarPaletteColorId)
        ? (legacyAccent as AvatarPaletteColorId)
        : DEFAULT_AVATAR_CONFIG.clothingColors.secondary,
      sash: DEFAULT_AVATAR_CONFIG.clothingColors.sash,
    },
    accessories: mappedAcc,
    animationPreferences: DEFAULT_AVATAR_CONFIG.animationPreferences,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : DEFAULT_AVATAR_CONFIG.updatedAt,
  });
}

export function sanitizeAvatarConfig(input: Partial<AvatarConfigV3>): AvatarConfigV3 {
  const presentation = VALID_PRESENTATIONS.has(input.genderPresentation as GenderPresentation)
    ? (input.genderPresentation as GenderPresentation)
    : DEFAULT_AVATAR_CONFIG.genderPresentation;

  const rawCharId = sanitizeIdentifier(input.characterId, characterIdForPresentation(presentation));
  const characterId = VALID_CHARACTER_IDS.has(rawCharId) ? rawCharId : characterIdForPresentation(presentation);

  const compatibleHair = getHairstylesForPresentation(presentation);
  const hairCandidate = input.hairstyle;
  const hairstyle =
    hairCandidate && compatibleHair.some((h) => h.id === hairCandidate)
      ? hairCandidate
      : compatibleHair[0]?.id ?? DEFAULT_AVATAR_CONFIG.hairstyle;

  const rawAccessories = Array.isArray(input.accessories) ? input.accessories : DEFAULT_AVATAR_CONFIG.accessories;
  const accessories = Array.from(
    new Set(rawAccessories.filter((item): item is AvatarAccessoryId => VALID_ACCESSORIES.has(item))),
  ).slice(0, 6);

  return {
    schemaVersion: 3,
    characterId,
    genderPresentation: presentation,
    body: {
      heightScale: clamp(input.body?.heightScale ?? DEFAULT_AVATAR_CONFIG.body.heightScale, 0.9, 1.1, 1.0),
      buildPreset: VALID_BUILDS.has(input.body?.buildPreset as AvatarConfigV3['body']['buildPreset'])
        ? (input.body!.buildPreset as AvatarConfigV3['body']['buildPreset'])
        : DEFAULT_AVATAR_CONFIG.body.buildPreset,
      shoulderWidth: clamp(input.body?.shoulderWidth ?? DEFAULT_AVATAR_CONFIG.body.shoulderWidth, 0.92, 1.08, 1.0),
      silhouetteBalance: clamp(input.body?.silhouetteBalance ?? DEFAULT_AVATAR_CONFIG.body.silhouetteBalance, -0.5, 0.5, 0),
      posture: input.body?.posture === 'relaxed-tea' ? 'relaxed-tea' : 'upright-calm',
    },
    face: {
      faceShape: VALID_FACE_SHAPES.has(input.face?.faceShape as AvatarConfigV3['face']['faceShape'])
        ? (input.face!.faceShape as AvatarConfigV3['face']['faceShape'])
        : DEFAULT_AVATAR_CONFIG.face.faceShape,
      jawline: clamp(input.face?.jawline ?? DEFAULT_AVATAR_CONFIG.face.jawline, -1, 1, 0),
      eyeShape: VALID_EYE_SHAPES.has(input.face?.eyeShape as AvatarConfigV3['face']['eyeShape'])
        ? (input.face!.eyeShape as AvatarConfigV3['face']['eyeShape'])
        : DEFAULT_AVATAR_CONFIG.face.eyeShape,
      eyebrowShape: VALID_EYEBROW_SHAPES.has(input.face?.eyebrowShape as AvatarConfigV3['face']['eyebrowShape'])
        ? (input.face!.eyebrowShape as AvatarConfigV3['face']['eyebrowShape'])
        : DEFAULT_AVATAR_CONFIG.face.eyebrowShape,
      noseShape: VALID_NOSE_SHAPES.has(input.face?.noseShape as AvatarConfigV3['face']['noseShape'])
        ? (input.face!.noseShape as AvatarConfigV3['face']['noseShape'])
        : DEFAULT_AVATAR_CONFIG.face.noseShape,
      lipShape: VALID_LIP_SHAPES.has(input.face?.lipShape as AvatarConfigV3['face']['lipShape'])
        ? (input.face!.lipShape as AvatarConfigV3['face']['lipShape'])
        : DEFAULT_AVATAR_CONFIG.face.lipShape,
      expression: VALID_EXPRESSIONS.has(input.face?.expression as AvatarConfigV3['face']['expression'])
        ? (input.face!.expression as AvatarConfigV3['face']['expression'])
        : DEFAULT_AVATAR_CONFIG.face.expression,
    },
    skin: {
      tone: VALID_SKIN_TONES.has(input.skin?.tone as AvatarConfigV3['skin']['tone'])
        ? (input.skin!.tone as AvatarConfigV3['skin']['tone'])
        : DEFAULT_AVATAR_CONFIG.skin.tone,
    },
    hairstyle,
    hairColor: VALID_HAIR_COLORS.has(input.hairColor as AvatarHairColorId)
      ? (input.hairColor as AvatarHairColorId)
      : DEFAULT_AVATAR_CONFIG.hairColor,
    clothing: {
      style: VALID_CLOTHING.has(input.clothing?.style as AvatarClothingStyleId)
        ? (input.clothing!.style as AvatarClothingStyleId)
        : DEFAULT_AVATAR_CONFIG.clothing.style,
      material: VALID_MATERIALS.has(input.clothing?.material as AvatarConfigV3['clothing']['material'])
        ? (input.clothing!.material as AvatarConfigV3['clothing']['material'])
        : DEFAULT_AVATAR_CONFIG.clothing.material,
    },
    clothingColors: {
      primary: VALID_PALETTE_COLORS.has(input.clothingColors?.primary as AvatarPaletteColorId)
        ? (input.clothingColors!.primary as AvatarPaletteColorId)
        : DEFAULT_AVATAR_CONFIG.clothingColors.primary,
      secondary: VALID_PALETTE_COLORS.has(input.clothingColors?.secondary as AvatarPaletteColorId)
        ? (input.clothingColors!.secondary as AvatarPaletteColorId)
        : DEFAULT_AVATAR_CONFIG.clothingColors.secondary,
      sash: VALID_PALETTE_COLORS.has(input.clothingColors?.sash as AvatarPaletteColorId)
        ? (input.clothingColors!.sash as AvatarPaletteColorId)
        : DEFAULT_AVATAR_CONFIG.clothingColors.sash,
    },
    accessories,
    animationPreferences: {
      defaultPose: VALID_ANIMATIONS.has(input.animationPreferences?.defaultPose as AvatarConfigV3['animationPreferences']['defaultPose'])
        ? (input.animationPreferences!.defaultPose as AvatarConfigV3['animationPreferences']['defaultPose'])
        : DEFAULT_AVATAR_CONFIG.animationPreferences.defaultPose,
      idleBreathing:
        typeof input.animationPreferences?.idleBreathing === 'boolean'
          ? input.animationPreferences.idleBreathing
          : DEFAULT_AVATAR_CONFIG.animationPreferences.idleBreathing,
    },
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : new Date().toISOString(),
  };
}

export function validateAvatarConfig(raw: unknown): AvatarValidationResult {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') {
    return {
      valid: false,
      errors: ['Avatar configuration must be an object.'],
      sanitized: { ...DEFAULT_AVATAR_CONFIG },
    };
  }
  const input = raw as Partial<AvatarConfigV3>;

  if (input.schemaVersion !== 3) {
    errors.push('Unsupported or missing schemaVersion (expected 3).');
  }
  if (!input.characterId || !VALID_CHARACTER_IDS.has(input.characterId)) {
    errors.push('Unapproved or missing characterId.');
  }
  if (!input.genderPresentation || !VALID_PRESENTATIONS.has(input.genderPresentation)) {
    errors.push('Invalid genderPresentation.');
  }
  if (!input.hairstyle || !VALID_HAIRSTYLES.has(input.hairstyle)) {
    errors.push('Unknown hairstyle asset ID.');
  }
  if (!input.hairColor || !VALID_HAIR_COLORS.has(input.hairColor)) {
    errors.push('Unknown hairColor ID.');
  }
  if (!input.clothing?.style || !VALID_CLOTHING.has(input.clothing.style)) {
    errors.push('Unknown clothing style asset ID.');
  }
  if (!input.clothing?.material || !VALID_MATERIALS.has(input.clothing.material)) {
    errors.push('Unknown fabric material ID.');
  }
  if (!input.skin?.tone || !VALID_SKIN_TONES.has(input.skin.tone)) {
    errors.push('Invalid skin tone.');
  }
  if (
    typeof input.body?.heightScale !== 'number' ||
    input.body.heightScale < 0.9 ||
    input.body.heightScale > 1.1
  ) {
    errors.push('heightScale must be between 0.90 and 1.10.');
  }
  if (
    typeof input.body?.shoulderWidth !== 'number' ||
    input.body.shoulderWidth < 0.92 ||
    input.body.shoulderWidth > 1.08
  ) {
    errors.push('shoulderWidth must be between 0.92 and 1.08.');
  }
  if (!Array.isArray(input.accessories) || input.accessories.some((a) => !VALID_ACCESSORIES.has(a))) {
    errors.push('Accessories contain invalid asset ID.');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizeAvatarConfig(input),
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

const HARMONIOUS_PALETTES: Array<{
  primary: AvatarPaletteColorId;
  secondary: AvatarPaletteColorId;
  sash: AvatarPaletteColorId;
}> = [
  { primary: 'ivory', secondary: 'moss-green', sash: 'walnut' },
  { primary: 'natural-beige', secondary: 'walnut', sash: 'charcoal' },
  { primary: 'moss-green', secondary: 'ivory', sash: 'earth-brown' },
  { primary: 'indigo', secondary: 'sand', sash: 'charcoal' },
  { primary: 'muted-sage', secondary: 'natural-beige', sash: 'walnut' },
  { primary: 'walnut', secondary: 'sand', sash: 'ivory' },
  { primary: 'warm-grey', secondary: 'ivory', sash: 'indigo' },
  { primary: 'charcoal', secondary: 'sand', sash: 'moss-green' },
];

export function randomizeAvatarConfig(rng: () => number = Math.random): AvatarConfigV3 {
  const presentation = pick<GenderPresentation>(['feminine', 'masculine', 'neutral'], rng);
  const hairChoices = getHairstylesForPresentation(presentation);
  const hairstyle = pick(hairChoices, rng).id;
  const hairColor = pick(HAIR_COLOR_OPTIONS, rng).id;
  const skinTone = pick(SKIN_TONE_OPTIONS, rng).id;
  const clothingChoices = CLOTHING_REGISTRY.filter((c) => c.compatiblePresentations.includes(presentation));
  const clothing = pick(clothingChoices, rng);
  const material = pick(FABRIC_MATERIAL_OPTIONS, rng).id;
  const palette = pick(HARMONIOUS_PALETTES, rng);

  const accPool: AvatarAccessoryId[] = ['wooden-bracelet', 'simple-necklace', 'tea-pouch', 'minimal-belt'];
  if (hairstyle.includes('bun') || hairstyle.includes('topknot') || hairstyle.includes('tied')) {
    accPool.push('wooden-hairpin', 'bamboo-hairpin', 'fabric-hair-tie');
  }
  if (clothing.supportsSash) {
    accPool.push('traditional-sash');
  }
  const accCount = Math.floor(rng() * 3); // 0..2 restrained accessories
  const chosenAcc: AvatarAccessoryId[] = [];
  for (let i = 0; i < accCount; i += 1) {
    const candidate = pick(accPool, rng);
    if (!chosenAcc.includes(candidate)) chosenAcc.push(candidate);
  }

  return sanitizeAvatarConfig({
    schemaVersion: 3,
    characterId: characterIdForPresentation(presentation),
    genderPresentation: presentation,
    body: {
      heightScale: Number((0.95 + rng() * 0.1).toFixed(2)),
      buildPreset: pick(BODY_BUILD_OPTIONS, rng).id,
      shoulderWidth: Number((0.96 + rng() * 0.08).toFixed(2)),
      silhouetteBalance: Number((-0.2 + rng() * 0.4).toFixed(2)),
      posture: rng() > 0.5 ? 'upright-calm' : 'relaxed-tea',
    },
    face: {
      faceShape: pick(FACE_SHAPE_OPTIONS, rng).id,
      jawline: Number((-0.3 + rng() * 0.6).toFixed(2)),
      eyeShape: pick(EYE_SHAPE_OPTIONS, rng).id,
      eyebrowShape: pick(EYEBROW_SHAPE_OPTIONS, rng).id,
      noseShape: pick(NOSE_SHAPE_OPTIONS, rng).id,
      lipShape: pick(LIP_SHAPE_OPTIONS, rng).id,
      expression: pick(EXPRESSION_OPTIONS, rng).id,
    },
    skin: { tone: skinTone },
    hairstyle,
    hairColor,
    clothing: { style: clothing.id, material },
    clothingColors: palette,
    accessories: chosenAcc,
    animationPreferences: {
      defaultPose: pick(['idle-standing', 'relaxed-standing', 'holding-cup', 'seated-idle'] as const, rng),
      idleBreathing: true,
    },
    updatedAt: new Date().toISOString(),
  });
}
