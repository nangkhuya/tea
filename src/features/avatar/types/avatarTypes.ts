export type GenderPresentation = 'masculine' | 'feminine' | 'neutral';

export type BodyBuildPreset = 'slim' | 'average' | 'athletic' | 'fuller';
export type BodyPosturePreset = 'upright-calm' | 'relaxed-tea';

export type SkinToneId = 'porcelain' | 'warm-beige' | 'amber-olive' | 'deep-bronze';
export type FaceShapeId = 'oval' | 'soft' | 'defined' | 'gentle-square';
export type EyeShapeId = 'almond' | 'gentle' | 'narrow';
export type EyebrowShapeId = 'natural' | 'arched' | 'straight';
export type NoseShapeId = 'balanced' | 'refined' | 'soft';
export type LipShapeId = 'natural' | 'thin' | 'full';
export type FacialExpressionId = 'neutral' | 'gentle-smile' | 'serene' | 'thoughtful';

export type AvatarHairStyleId =
  // Masculine
  | 'short-natural'
  | 'medium-natural'
  | 'long-traditional'
  | 'traditional-topknot'
  | 'neatly-tied'
  // Feminine
  | 'long-straight'
  | 'long-tied'
  | 'traditional-bun'
  | 'half-up'
  | 'loose-natural'
  // Neutral
  | 'minimal-short'
  | 'medium-layered'
  | 'minimal-tied';

export type AvatarHairColorId =
  | 'natural-black'
  | 'dark-brown'
  | 'chestnut'
  | 'dark-grey'
  | 'silver-grey'
  | 'white';

export type AvatarClothingTradition = 'japanese' | 'chinese' | 'contemporary';

export type AvatarClothingStyleId =
  // Japanese-inspired
  | 'minimal-kimono'
  | 'simple-yukata'
  | 'traditional-haori'
  | 'linen-samue'
  // Chinese-inspired
  | 'traditional-hanfu'
  | 'scholar-robe'
  | 'tang-shirt'
  // Contemporary Asian-inspired
  | 'linen-shirt-trousers'
  | 'loose-natural-set'
  | 'minimal-long-skirt';

export type AvatarFabricMaterialId = 'linen' | 'cotton' | 'hemp' | 'silk' | 'woven-natural';

export type AvatarPaletteColorId =
  | 'ivory'
  | 'natural-beige'
  | 'sand'
  | 'walnut'
  | 'moss-green'
  | 'muted-sage'
  | 'indigo'
  | 'charcoal'
  | 'warm-grey'
  | 'earth-brown';

export type AvatarAccessoryId =
  | 'wooden-hairpin'
  | 'bamboo-hairpin'
  | 'fabric-hair-tie'
  | 'wooden-bracelet'
  | 'simple-necklace'
  | 'minimal-belt'
  | 'traditional-sash'
  | 'tea-pouch';

export type AvatarAnimationId =
  | 'idle-standing'
  | 'breathing'
  | 'relaxed-standing'
  | 'walking'
  | 'turning'
  | 'sitting-down'
  | 'seated-idle'
  | 'cross-legged'
  | 'kneeling-seiza'
  | 'holding-cup'
  | 'lifting-cup'
  | 'drinking-tea'
  | 'placing-cup'
  | 'greeting'
  | 'looking-scenery';

export type PreviewEnvironmentId = 'neutral-studio' | 'japanese-interior' | 'tea-pavilion';
export type CameraPresetId = 'full-body' | 'front' | 'side' | 'back' | 'face';

export type AvatarStudioCategoryId =
  | 'presets'
  | 'identity-body'
  | 'face-skin'
  | 'hair'
  | 'clothing'
  | 'accessories'
  | 'animations';

export type AssetAvailabilityStatus =
  | 'procedural-rig'
  | 'glb-configured'
  | 'requires-external-glb';

export interface AvatarConfigV3 {
  schemaVersion: 3;
  characterId: string;
  genderPresentation: GenderPresentation;
  body: {
    heightScale: number;
    buildPreset: BodyBuildPreset;
    shoulderWidth: number;
    silhouetteBalance: number;
    posture: BodyPosturePreset;
  };
  face: {
    faceShape: FaceShapeId;
    jawline: number;
    eyeShape: EyeShapeId;
    eyebrowShape: EyebrowShapeId;
    noseShape: NoseShapeId;
    lipShape: LipShapeId;
    expression: FacialExpressionId;
  };
  skin: {
    tone: SkinToneId;
  };
  hairstyle: AvatarHairStyleId;
  hairColor: AvatarHairColorId;
  clothing: {
    style: AvatarClothingStyleId;
    material: AvatarFabricMaterialId;
  };
  clothingColors: {
    primary: AvatarPaletteColorId;
    secondary: AvatarPaletteColorId;
    sash: AvatarPaletteColorId;
  };
  accessories: AvatarAccessoryId[];
  animationPreferences: {
    defaultPose: AvatarAnimationId;
    idleBreathing: boolean;
  };
  updatedAt: string;
}

export interface AvatarAssetMetadata<TId extends string = string> {
  id: TId;
  category: 'base-model' | 'hairstyle' | 'clothing' | 'accessory' | 'animation';
  displayNameVi: string;
  displayNameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  modelPath: string | null;
  previewSwatch?: string;
  supportedSkeleton: 'zen-humanoid-v1' | 'gltf-standard-humanoid';
  compatiblePresentations: GenderPresentation[];
  materialConfig?: {
    roughness: number;
    metalness: number;
    sheen?: number;
  };
  availability: AssetAvailabilityStatus;
  subGroup?: string;
}

export interface AvatarPreset {
  id: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  config: Omit<AvatarConfigV3, 'schemaVersion' | 'updatedAt'>;
}

export interface AvatarModelCapabilities {
  sourceMode: 'procedural-reference-rig' | 'external-glb';
  hasSkeletonRig: boolean;
  supportsBodyScaling: boolean;
  supportsShoulderWidth: boolean;
  supportsFacialMorphs: boolean;
  availableMorphTargets: string[];
  supportsMaterialTinting: boolean;
  availableAnimations: AvatarAnimationId[];
  unavailableAnimations: AvatarAnimationId[];
  meshCount: number;
  skinnedMeshCount: number;
  skeletonBoneCount: number;
  statusDetails: string;
}

export interface AvatarValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: AvatarConfigV3;
}
