import type {
  AvatarAccessoryId,
  AvatarAnimationId,
  AvatarAssetMetadata,
  AvatarClothingStyleId,
  AvatarClothingTradition,
  AvatarFabricMaterialId,
  AvatarHairColorId,
  AvatarHairStyleId,
  AvatarPaletteColorId,
  BodyBuildPreset,
  CameraPresetId,
  EyeShapeId,
  EyebrowShapeId,
  FaceShapeId,
  FacialExpressionId,
  GenderPresentation,
  LipShapeId,
  NoseShapeId,
  PreviewEnvironmentId,
  SkinToneId,
} from '../types/avatarTypes';

export interface ConfiguredGlbAsset {
  id: string;
  url: string;
  source: 'configured-glb';
}

const configuredUrl =
  typeof import.meta !== 'undefined'
    ? (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_AVATAR_GLB_URL?.trim()
    : undefined;

/** Empty unless VITE_AVATAR_GLB_URL is explicitly configured. Never fabricates unverified GLB paths. */
export const AVATAR_MODEL_MANIFEST: ConfiguredGlbAsset[] = configuredUrl
  ? [{ id: 'configured-external-glb', url: configuredUrl, source: 'configured-glb' }]
  : [];

export const BASE_CHARACTER_MODELS: Array<
  AvatarAssetMetadata<'zen-humanoid-masculine' | 'zen-humanoid-feminine' | 'zen-humanoid-neutral'> & {
    presentation: GenderPresentation;
  }
> = [
  {
    id: 'zen-humanoid-feminine',
    presentation: 'feminine',
    category: 'base-model',
    displayNameVi: 'Hình mẫu Nữ tính (Tham chiếu giải phẫu)',
    displayNameEn: 'Feminine Reference Rig',
    descriptionVi: 'Tỷ lệ giải phẫu người tự nhiên, vai thon và khung xương hài hòa.',
    descriptionEn: 'Natural human anatomical proportions with balanced shoulders.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine'],
    availability: 'procedural-rig',
  },
  {
    id: 'zen-humanoid-neutral',
    presentation: 'neutral',
    category: 'base-model',
    displayNameVi: 'Hình mẫu Trung tính (Tham chiếu giải phẫu)',
    displayNameEn: 'Androgynous / Neutral Reference Rig',
    descriptionVi: 'Tỷ lệ trung tính thanh thoát, phù hợp đa dạng phong cách trà phục.',
    descriptionEn: 'Balanced neutral proportions suited to all tea house attire.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'zen-humanoid-masculine',
    presentation: 'masculine',
    category: 'base-model',
    displayNameVi: 'Hình mẫu Nam tính (Tham chiếu giải phẫu)',
    displayNameEn: 'Masculine Reference Rig',
    descriptionVi: 'Tỷ lệ giải phẫu tự nhiên, khung vai vững chãi và tư thế điềm tĩnh.',
    descriptionEn: 'Natural human proportions with broader shoulders and calm posture.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine'],
    availability: 'procedural-rig',
  },
];

export const SKIN_TONE_OPTIONS: Array<{
  id: SkinToneId;
  hex: string;
  subsurfaceHex: string;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'porcelain', hex: '#eed7c6', subsurfaceHex: '#d7a896', labelVi: 'Ngà sáng', labelEn: 'Porcelain' },
  { id: 'warm-beige', hex: '#d7ad8d', subsurfaceHex: '#b87f64', labelVi: 'Be ấm tự nhiên', labelEn: 'Warm Beige' },
  { id: 'amber-olive', hex: '#bc8b67', subsurfaceHex: '#986446', labelVi: 'Ô-liu hổ phách', labelEn: 'Amber Olive' },
  { id: 'deep-bronze', hex: '#82543f', subsurfaceHex: '#613827', labelVi: 'Đồng trầm', labelEn: 'Deep Bronze' },
];

export const BODY_BUILD_OPTIONS: Array<{
  id: BodyBuildPreset;
  labelVi: string;
  labelEn: string;
  torsoScale: number;
  limbScale: number;
}> = [
  { id: 'slim', labelVi: 'Thanh mảnh', labelEn: 'Slim', torsoScale: 0.91, limbScale: 0.92 },
  { id: 'average', labelVi: 'Cân đối', labelEn: 'Average', torsoScale: 1.0, limbScale: 1.0 },
  { id: 'athletic', labelVi: 'Rắn rỏi', labelEn: 'Athletic', torsoScale: 1.05, limbScale: 1.04 },
  { id: 'fuller', labelVi: 'Đầy đặn', labelEn: 'Fuller', torsoScale: 1.12, limbScale: 1.09 },
];

export const FACE_SHAPE_OPTIONS: Array<{ id: FaceShapeId; labelVi: string; labelEn: string }> = [
  { id: 'oval', labelVi: 'Trái xoan', labelEn: 'Oval' },
  { id: 'soft', labelVi: 'Mềm mại', labelEn: 'Soft' },
  { id: 'defined', labelVi: 'Thanh tú sắc nét', labelEn: 'Defined' },
  { id: 'gentle-square', labelVi: 'Vuông nhẹ điềm đạm', labelEn: 'Gentle Square' },
];

export const EYE_SHAPE_OPTIONS: Array<{ id: EyeShapeId; labelVi: string; labelEn: string }> = [
  { id: 'almond', labelVi: 'Mắt hạnh nhân', labelEn: 'Almond' },
  { id: 'gentle', labelVi: 'Hiền hòa', labelEn: 'Gentle' },
  { id: 'narrow', labelVi: 'Thanh dài', labelEn: 'Narrow' },
];

export const EYEBROW_SHAPE_OPTIONS: Array<{ id: EyebrowShapeId; labelVi: string; labelEn: string }> = [
  { id: 'natural', labelVi: 'Tự nhiên', labelEn: 'Natural' },
  { id: 'arched', labelVi: 'Cong nhẹ', labelEn: 'Soft Arch' },
  { id: 'straight', labelVi: 'Thẳng điềm tĩnh', labelEn: 'Straight' },
];

export const NOSE_SHAPE_OPTIONS: Array<{ id: NoseShapeId; labelVi: string; labelEn: string }> = [
  { id: 'balanced', labelVi: 'Cân đối', labelEn: 'Balanced' },
  { id: 'refined', labelVi: 'Thanh gọn', labelEn: 'Refined' },
  { id: 'soft', labelVi: 'Mềm mại', labelEn: 'Soft' },
];

export const LIP_SHAPE_OPTIONS: Array<{ id: LipShapeId; labelVi: string; labelEn: string }> = [
  { id: 'natural', labelVi: 'Tự nhiên', labelEn: 'Natural' },
  { id: 'thin', labelVi: 'Mảnh nhẹ', labelEn: 'Fine' },
  { id: 'full', labelVi: 'Đầy đặn', labelEn: 'Full' },
];

export const EXPRESSION_OPTIONS: Array<{ id: FacialExpressionId; labelVi: string; labelEn: string }> = [
  { id: 'neutral', labelVi: 'Điềm tĩnh', labelEn: 'Neutral' },
  { id: 'gentle-smile', labelVi: 'Mỉm cười nhẹ', labelEn: 'Gentle Smile' },
  { id: 'serene', labelVi: 'An nhiên', labelEn: 'Serene' },
  { id: 'thoughtful', labelVi: 'Trầm tư', labelEn: 'Thoughtful' },
];

export const HAIRSTYLE_REGISTRY: Array<AvatarAssetMetadata<AvatarHairStyleId>> = [
  // Masculine
  {
    id: 'short-natural',
    category: 'hairstyle',
    subGroup: 'masculine',
    displayNameVi: 'Tóc ngắn tự nhiên',
    displayNameEn: 'Short Natural Hair',
    descriptionVi: 'Gọn gàng tự nhiên, đường ngôi mềm mại.',
    descriptionEn: 'Clean natural short cut.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'medium-natural',
    category: 'hairstyle',
    subGroup: 'masculine',
    displayNameVi: 'Tóc lửng tự nhiên',
    displayNameEn: 'Medium-Length Hair',
    descriptionVi: 'Độ dài chạm gáy theo phong thái thư sinh.',
    descriptionEn: 'Relaxed medium-length cut.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'long-traditional',
    category: 'hairstyle',
    subGroup: 'masculine',
    displayNameVi: 'Tóc dài cổ điển',
    displayNameEn: 'Long Traditional Hair',
    descriptionVi: 'Suôn mượt thả vai mang nét văn nhân xưa.',
    descriptionEn: 'Long classic scholar hair.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'traditional-topknot',
    category: 'hairstyle',
    subGroup: 'masculine',
    displayNameVi: 'Búi đỉnh truyền thống',
    displayNameEn: 'Traditional Topknot',
    descriptionVi: 'Chải ngược gọn và búi cao trên đỉnh đầu.',
    descriptionEn: 'Classic swept-back topknot.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'neatly-tied',
    category: 'hairstyle',
    subGroup: 'masculine',
    displayNameVi: 'Buộc gọn sau gáy',
    displayNameEn: 'Neatly Tied Hair',
    descriptionVi: 'Buộc thấp chỉnh tề phía sau gáy.',
    descriptionEn: 'Low neatly tied hair.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  // Feminine
  {
    id: 'long-straight',
    category: 'hairstyle',
    subGroup: 'feminine',
    displayNameVi: 'Tóc dài thẳng mượt',
    displayNameEn: 'Long Straight Hair',
    descriptionVi: 'Mái tóc dài buông thẳng tự nhiên sau lưng.',
    descriptionEn: 'Long straight flowing hair.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'long-tied',
    category: 'hairstyle',
    subGroup: 'feminine',
    displayNameVi: 'Tóc dài buộc thấp',
    displayNameEn: 'Long Tied Hair',
    descriptionVi: 'Buộc nhẹ sau gáy giữ nét thanh nhã.',
    descriptionEn: 'Long low-tied hair.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'traditional-bun',
    category: 'hairstyle',
    subGroup: 'feminine',
    displayNameVi: 'Búi cổ điển trang nhã',
    displayNameEn: 'Traditional Bun',
    descriptionVi: 'Búi tròn sau gáy phù hợp trà thất.',
    descriptionEn: 'Classic low chignon bun.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'half-up',
    category: 'hairstyle',
    subGroup: 'feminine',
    displayNameVi: 'Buộc nửa đầu',
    displayNameEn: 'Half-Up Hairstyle',
    descriptionVi: 'Nửa trên buộc gọn, phần dưới buông tự nhiên.',
    descriptionEn: 'Graceful half-up style.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'loose-natural',
    category: 'hairstyle',
    subGroup: 'feminine',
    displayNameVi: 'Tóc xõa ngang vai tự nhiên',
    displayNameEn: 'Loose Natural Hairstyle',
    descriptionVi: 'Buông nhẹ ngang vai với độ phồng tự nhiên.',
    descriptionEn: 'Soft shoulder-length loose hair.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
  // Neutral
  {
    id: 'minimal-short',
    category: 'hairstyle',
    subGroup: 'neutral',
    displayNameVi: 'Tóc ngắn tối giản',
    displayNameEn: 'Simple Short Hair',
    descriptionVi: 'Tối giản, thanh thoát và dễ kết hợp.',
    descriptionEn: 'Minimalist balanced short cut.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'masculine', 'feminine'],
    availability: 'procedural-rig',
  },
  {
    id: 'medium-layered',
    category: 'hairstyle',
    subGroup: 'neutral',
    displayNameVi: 'Tóc lửng tự nhiên',
    displayNameEn: 'Medium Natural Hair',
    descriptionVi: 'Tỉa nhẹ tự nhiên, ôm gương mặt dịu dàng.',
    descriptionEn: 'Soft layered medium cut.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'feminine', 'masculine'],
    availability: 'procedural-rig',
  },
  {
    id: 'minimal-tied',
    category: 'hairstyle',
    subGroup: 'neutral',
    displayNameVi: 'Tóc buộc tối giản',
    displayNameEn: 'Minimal Tied Hairstyle',
    descriptionVi: 'Gom gọn phía sau giữ sự tĩnh tại cho gương mặt.',
    descriptionEn: 'Clean minimalist low tie.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'feminine', 'masculine'],
    availability: 'procedural-rig',
  },
];

export const HAIR_COLOR_OPTIONS: Array<{
  id: AvatarHairColorId;
  hex: string;
  highlightHex: string;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'natural-black', hex: '#1e1c1a', highlightHex: '#35312d', labelVi: 'Đen tự nhiên', labelEn: 'Natural Black' },
  { id: 'dark-brown', hex: '#34261e', highlightHex: '#4f3b2f', labelVi: 'Nâu sẫm', labelEn: 'Dark Brown' },
  { id: 'chestnut', hex: '#593d2d', highlightHex: '#77543f', labelVi: 'Nâu hạt dẻ', labelEn: 'Chestnut' },
  { id: 'dark-grey', hex: '#52504d', highlightHex: '#6f6c68', labelVi: 'Xám tro đậm', labelEn: 'Dark Grey' },
  { id: 'silver-grey', hex: '#9c9890', highlightHex: '#b9b5ad', labelVi: 'Xám bạc', labelEn: 'Silver Grey' },
  { id: 'white', hex: '#dbd6cd', highlightHex: '#ebe7e0', labelVi: 'Bạc trắng', labelEn: 'White' },
];

export const CLOTHING_REGISTRY: Array<
  AvatarAssetMetadata<AvatarClothingStyleId> & {
    tradition: AvatarClothingTradition;
    supportsSash: boolean;
  }
> = [
  // Japanese-inspired
  {
    id: 'minimal-kimono',
    category: 'clothing',
    tradition: 'japanese',
    supportsSash: true,
    displayNameVi: 'Kimono tối giản',
    displayNameEn: 'Minimalist Kimono',
    descriptionVi: 'Cổ vắt chéo chữ Y và ống tay rủ truyền thống Nhật Bản.',
    descriptionEn: 'Clean overlap-collar kimono with structured obi sash.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'simple-yukata',
    category: 'clothing',
    tradition: 'japanese',
    supportsSash: true,
    displayNameVi: 'Yukata trà thất',
    displayNameEn: 'Simple Yukata',
    descriptionVi: 'Phom dáng nhẹ nhàng thoáng mát dùng trong trà thất mùa hạ.',
    descriptionEn: 'Light cotton-linen yukata for relaxed tea gatherings.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'traditional-haori',
    category: 'clothing',
    tradition: 'japanese',
    supportsSash: true,
    displayNameVi: 'Áo khoác Haori & Hakama',
    displayNameEn: 'Traditional Haori & Hakama',
    descriptionVi: 'Lớp áo khoác haori buông thẳng phối quần xếp ly trang nghiêm.',
    descriptionEn: 'Structured haori jacket layered over wide pleated hakama.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral', 'feminine'],
    availability: 'procedural-rig',
  },
  {
    id: 'linen-samue',
    category: 'clothing',
    tradition: 'japanese',
    supportsSash: true,
    displayNameVi: 'Samue vải lanh Thiền trà',
    displayNameEn: 'Linen Tea Samue',
    descriptionVi: 'Trang phục lao tác trà nhân giản dị với dây buộc hông tự nhiên.',
    descriptionEn: 'Traditional Zen tea-worker two-piece linen attire.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'masculine', 'feminine'],
    availability: 'procedural-rig',
  },
  // Chinese-inspired
  {
    id: 'traditional-hanfu',
    category: 'clothing',
    tradition: 'chinese',
    supportsSash: true,
    displayNameVi: 'Hán phục giao lĩnh',
    displayNameEn: 'Traditional Hanfu',
    descriptionVi: 'Cổ giao lĩnh hữu khâm, tay áo rộng và vạt váy rủ thanh thoát.',
    descriptionEn: 'Cross-collar Hanfu with flowing sleeves and pleated skirt.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral', 'masculine'],
    availability: 'procedural-rig',
  },
  {
    id: 'scholar-robe',
    category: 'clothing',
    tradition: 'chinese',
    supportsSash: true,
    displayNameVi: 'Trường bào văn nhân',
    displayNameEn: 'Scholar Robe',
    descriptionVi: 'Áo dài văn nhân thư phòng với dải thắt lưng và cổ viền trang nhã.',
    descriptionEn: 'Long literati robe with refined collar trim and wide cuffs.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral', 'feminine'],
    availability: 'procedural-rig',
  },
  {
    id: 'tang-shirt',
    category: 'clothing',
    tradition: 'chinese',
    supportsSash: false,
    displayNameVi: 'Áo Đường cổ đứng & quần suông',
    displayNameEn: 'Tang-Inspired Tea Suit',
    descriptionVi: 'Cổ đứng nút cài truyền thống gọn gàng cho buổi pha trà công phu.',
    descriptionEn: 'Stand-collar Tang top with straight trousers for gongfu tea.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['masculine', 'neutral', 'feminine'],
    availability: 'procedural-rig',
  },
  // Contemporary Asian
  {
    id: 'linen-shirt-trousers',
    category: 'clothing',
    tradition: 'contemporary',
    supportsSash: false,
    displayNameVi: 'Áo lanh cổ tàu & quần ống rộng',
    displayNameEn: 'Mandarin Linen Shirt & Wide Trousers',
    descriptionVi: 'Áo lanh đương đại tối giản kết hợp quần ống rộng tự nhiên.',
    descriptionEn: 'Relaxed mandarin-collar linen shirt with tailored wide trousers.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'masculine', 'feminine'],
    availability: 'procedural-rig',
  },
  {
    id: 'loose-natural-set',
    category: 'clothing',
    tradition: 'contemporary',
    supportsSash: true,
    displayNameVi: 'Bộ trà phục dệt thô buông nhẹ',
    displayNameEn: 'Loose Natural-Fabric Tea Set',
    descriptionVi: 'Phom rộng êm ái, đường may tinh giản tôn chất liệu tự nhiên.',
    descriptionEn: 'Relaxed natural-weave tunic and draped trousers.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['neutral', 'feminine', 'masculine'],
    availability: 'procedural-rig',
  },
  {
    id: 'minimal-long-skirt',
    category: 'clothing',
    tradition: 'contemporary',
    supportsSash: true,
    displayNameVi: 'Áo trà cổ chéo & chân váy dài',
    displayNameEn: 'Tea Tunic & Long Skirt',
    descriptionVi: 'Áo vạt chéo nhẹ nhàng phối chân váy dài qua mắt cá chân.',
    descriptionEn: 'Minimalist wrap top paired with ankle-length pleated skirt.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'neutral'],
    availability: 'procedural-rig',
  },
];

export const FABRIC_MATERIAL_OPTIONS: Array<{
  id: AvatarFabricMaterialId;
  labelVi: string;
  labelEn: string;
  roughness: number;
  metalness: number;
  sheen: number;
  bumpScale: number;
  weaveScale: number;
}> = [
  { id: 'linen', labelVi: 'Vải lanh (Linen)', labelEn: 'Linen', roughness: 0.88, metalness: 0.01, sheen: 0.22, bumpScale: 0.016, weaveScale: 10 },
  { id: 'cotton', labelVi: 'Bông mộc (Cotton)', labelEn: 'Cotton', roughness: 0.84, metalness: 0.01, sheen: 0.16, bumpScale: 0.01, weaveScale: 14 },
  { id: 'hemp', labelVi: 'Sợi gai thô (Hemp)', labelEn: 'Hemp', roughness: 0.94, metalness: 0.0, sheen: 0.08, bumpScale: 0.024, weaveScale: 8 },
  { id: 'silk', labelVi: 'Lụa mờ (Matte Silk)', labelEn: 'Matte Silk', roughness: 0.56, metalness: 0.04, sheen: 0.65, bumpScale: 0.005, weaveScale: 18 },
  { id: 'woven-natural', labelVi: 'Dệt mộc (Woven)', labelEn: 'Natural Woven', roughness: 0.91, metalness: 0.01, sheen: 0.18, bumpScale: 0.02, weaveScale: 9 },
];

export const CLOTHING_PALETTE_OPTIONS: Array<{
  id: AvatarPaletteColorId;
  hex: string;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'ivory', hex: '#F8F5EF', labelVi: 'Ngà ấm', labelEn: 'Ivory' },
  { id: 'natural-beige', hex: '#D9CCB9', labelVi: 'Be tự nhiên', labelEn: 'Natural Beige' },
  { id: 'sand', hex: '#C8B89F', labelVi: 'Cát mịn', labelEn: 'Sand' },
  { id: 'walnut', hex: '#72543D', labelVi: 'Nâu óc chó', labelEn: 'Walnut' },
  { id: 'moss-green', hex: '#737B62', labelVi: 'Xanh rêu', labelEn: 'Moss Green' },
  { id: 'muted-sage', hex: '#A4A68E', labelVi: 'Xanh xô thơm', labelEn: 'Muted Sage' },
  { id: 'indigo', hex: '#46566B', labelVi: 'Chàm trầm', labelEn: 'Indigo' },
  { id: 'charcoal', hex: '#302C27', labelVi: 'Than mực', labelEn: 'Charcoal' },
  { id: 'warm-grey', hex: '#7D7870', labelVi: 'Xám ấm', labelEn: 'Warm Grey' },
  { id: 'earth-brown', hex: '#5A4232', labelVi: 'Nâu đất', labelEn: 'Earth Brown' },
];

export const ACCESSORY_REGISTRY: Array<AvatarAssetMetadata<AvatarAccessoryId>> = [
  {
    id: 'wooden-hairpin',
    category: 'accessory',
    displayNameVi: 'Trâm cài gỗ đàn hương',
    displayNameEn: 'Wooden Hairpin',
    descriptionVi: 'Trâm gỗ mài nhẵn cài búi tóc phía sau.',
    descriptionEn: 'Carved sandalwood hairpin.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'bamboo-hairpin',
    category: 'accessory',
    displayNameVi: 'Trâm trúc thanh mảnh',
    displayNameEn: 'Bamboo Hairpin',
    descriptionVi: 'Trâm đốt trúc tự nhiên nhẹ nhàng.',
    descriptionEn: 'Slender bamboo hairpin.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'fabric-hair-tie',
    category: 'accessory',
    displayNameVi: 'Dây vải buộc tóc',
    displayNameEn: 'Fabric Hair Tie',
    descriptionVi: 'Dây vải lanh mềm quấn quanh nút buộc tóc.',
    descriptionEn: 'Soft woven linen hair ribbon.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'wooden-bracelet',
    category: 'accessory',
    displayNameVi: 'Chuỗi hạt gỗ trầm',
    displayNameEn: 'Wooden Bracelet',
    descriptionVi: 'Chuỗi hạt gỗ tự nhiên đeo cổ tay phải.',
    descriptionEn: 'Minimalist wooden wrist beads.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'simple-necklace',
    category: 'accessory',
    displayNameVi: 'Dây đeo mặt ngọc/gỗ',
    displayNameEn: 'Simple Pendant Necklace',
    descriptionVi: 'Dây mảnh với mặt đá tròn tối giản.',
    descriptionEn: 'Minimalist cord pendant.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'minimal-belt',
    category: 'accessory',
    displayNameVi: 'Thắt lưng vải tối giản',
    displayNameEn: 'Minimalist Belt',
    descriptionVi: 'Đai vải mảnh thắt gọn ngang eo.',
    descriptionEn: 'Slender woven waist belt.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'traditional-sash',
    category: 'accessory',
    displayNameVi: 'Đai lưng lụa truyền thống',
    displayNameEn: 'Traditional Sash',
    descriptionVi: 'Đai bản rộng thắt nếp truyền thống ở eo.',
    descriptionEn: 'Wide folded waist sash.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
  {
    id: 'tea-pouch',
    category: 'accessory',
    displayNameVi: 'Túi thơm trà nhỏ bên hông',
    displayNameEn: 'Small Textile Tea Pouch',
    descriptionVi: 'Túi vải nhỏ treo dây ở thắt lưng đựng lá trà hoặc hương.',
    descriptionEn: 'Small hanging textile pouch at the waist.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
  },
];

export const ANIMATION_REGISTRY: Array<
  AvatarAssetMetadata<AvatarAnimationId> & {
    group: 'basic' | 'tea-house';
    glbClipHints: string[];
  }
> = [
  // Basic
  {
    id: 'idle-standing',
    group: 'basic',
    category: 'animation',
    displayNameVi: 'Đứng tĩnh tại',
    displayNameEn: 'Idle Standing',
    descriptionVi: 'Tư thế đứng cân bằng tự nhiên với nhịp thở nhẹ.',
    descriptionEn: 'Balanced standing pose with subtle breathing.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['idle', 'stand'],
  },
  {
    id: 'breathing',
    group: 'basic',
    category: 'animation',
    displayNameVi: 'Hít thở chánh niệm',
    displayNameEn: 'Natural Breathing',
    descriptionVi: 'Chuyển động lồng ngực và vai khoan thai theo hơi thở.',
    descriptionEn: 'Gentle chest and shoulder breathing cycle.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['breath'],
  },
  {
    id: 'relaxed-standing',
    group: 'basic',
    category: 'animation',
    displayNameVi: 'Đứng thư thái',
    displayNameEn: 'Relaxed Standing',
    descriptionVi: 'Chuyển trọng tâm nhẹ nhàng và đặt tay tự nhiên trước thân.',
    descriptionEn: 'Soft weight shift with hands clasped comfortably.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['relax', 'calm'],
  },
  {
    id: 'walking',
    group: 'basic',
    category: 'animation',
    displayNameVi: 'Bước đi khoan thai',
    displayNameEn: 'Walking',
    descriptionVi: 'Nhịp bước chậm rãi giữ thăng bằng trong trà thất.',
    descriptionEn: 'Unhurried natural walk cycle.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['walk'],
  },
  {
    id: 'turning',
    group: 'basic',
    category: 'animation',
    displayNameVi: 'Xoay người nhẹ',
    displayNameEn: 'Turning',
    descriptionVi: 'Chuyển hướng thân trên và bước chân chậm rãi.',
    descriptionEn: 'Gentle body turn transition.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['turn'],
  },
  // Tea House
  {
    id: 'sitting-down',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Ngồi xuống chiếu',
    displayNameEn: 'Sitting Down',
    descriptionVi: 'Chuyển từ tư thế đứng sang ngồi bên bàn trà.',
    descriptionEn: 'Smooth transition from standing to seated.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['sit_down', 'sitdown'],
  },
  {
    id: 'seated-idle',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Ngồi tĩnh tại',
    displayNameEn: 'Seated Idle',
    descriptionVi: 'Ngồi ngay ngắn giữ lưng thẳng và hơi thở đều.',
    descriptionEn: 'Calm upright seated posture.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['seated', 'sit_idle'],
  },
  {
    id: 'cross-legged',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Ngồi xếp bằng thiền trà',
    displayNameEn: 'Cross-Legged Sitting',
    descriptionVi: 'Tư thế ngồi xếp bằng an tọa trên đệm bồ đoàn.',
    descriptionEn: 'Cross-legged cushion sitting.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['cross', 'meditat', 'lotus'],
  },
  {
    id: 'kneeling-seiza',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Quỳ Seiza truyền thống',
    displayNameEn: 'Kneeling (Seiza)',
    descriptionVi: 'Tư thế quỳ Nhật Bản trang nghiêm trên chiếu tatami.',
    descriptionEn: 'Traditional Japanese seiza kneeling pose.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['seiza', 'kneel'],
  },
  {
    id: 'holding-cup',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Nâng niu chén trà',
    displayNameEn: 'Holding Tea Cup',
    descriptionVi: 'Hai tay nâng chén trà ấm ngang ngực.',
    descriptionEn: 'Two-handed tea bowl hold.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['hold_cup', 'cup'],
  },
  {
    id: 'lifting-cup',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Đưa chén trà lên',
    displayNameEn: 'Lifting Tea Cup',
    descriptionVi: 'Nâng chén trà chậm rãi cảm nhận hương trà.',
    descriptionEn: 'Slowly raising tea cup toward chest/face.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['lift', 'raise'],
  },
  {
    id: 'drinking-tea',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Thưởng thức ngụm trà',
    displayNameEn: 'Drinking Tea',
    descriptionVi: 'Cúi nhẹ đầu thưởng thức ngụm trà nóng.',
    descriptionEn: 'Mindful tea sipping gesture.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['drink', 'sip'],
  },
  {
    id: 'placing-cup',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Đặt chén xuống nhẹ nhàng',
    displayNameEn: 'Placing Cup Down',
    descriptionVi: 'Hạ tay đặt chén trà xuống mặt bàn an nhiên.',
    descriptionEn: 'Gently placing cup back on tea table.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['place', 'put_down'],
  },
  {
    id: 'greeting',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Cúi chào đồng trà',
    displayNameEn: 'Tea House Greeting',
    descriptionVi: 'Cúi nhẹ thân trên bày tỏ sự tôn kính với khách trà.',
    descriptionEn: 'Respectful gentle bow greeting.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['bow', 'greet'],
  },
  {
    id: 'looking-scenery',
    group: 'tea-house',
    category: 'animation',
    displayNameVi: 'Ngắm cảnh vườn trúc',
    displayNameEn: 'Looking at Scenery',
    descriptionVi: 'Nghiêng đầu hướng tầm nhìn ra cảnh vật tĩnh lặng.',
    descriptionEn: 'Calmly turning gaze toward distant scenery.',
    modelPath: null,
    supportedSkeleton: 'zen-humanoid-v1',
    compatiblePresentations: ['feminine', 'masculine', 'neutral'],
    availability: 'procedural-rig',
    glbClipHints: ['look', 'scenery'],
  },
];

export const CAMERA_PRESETS: Array<{
  id: CameraPresetId;
  labelVi: string;
  labelEn: string;
  position: [number, number, number];
  target: [number, number, number];
}> = [
  { id: 'full-body', labelVi: 'Toàn thân', labelEn: 'Full Body', position: [0.35, 1.12, 3.65], target: [0, 0.92, 0] },
  { id: 'front', labelVi: 'Chính diện', labelEn: 'Front', position: [0, 1.08, 3.25], target: [0, 0.95, 0] },
  { id: 'side', labelVi: 'Góc nghiêng', labelEn: 'Side', position: [3.05, 1.08, 0.45], target: [0, 0.95, 0] },
  { id: 'back', labelVi: 'Phía sau', labelEn: 'Back', position: [0.25, 1.12, -3.25], target: [0, 0.95, 0] },
  { id: 'face', labelVi: 'Cận mặt', labelEn: 'Face', position: [0.12, 1.58, 1.38], target: [0, 1.54, 0] },
];

export const PREVIEW_ENVIRONMENTS: Array<{
  id: PreviewEnvironmentId;
  labelVi: string;
  labelEn: string;
  backgroundHex: string;
}> = [
  { id: 'neutral-studio', labelVi: 'Studio trung tính', labelEn: 'Neutral Studio', backgroundHex: '#e7e0d3' },
  { id: 'japanese-interior', labelVi: 'Nội thất Nhật', labelEn: 'Japanese Interior', backgroundHex: '#dcd3c2' },
  { id: 'tea-pavilion', labelVi: 'Trà Thất ZEN', labelEn: 'Tea Pavilion', backgroundHex: '#d5d2c5' },
];

export function getHairstylesForPresentation(presentation: GenderPresentation) {
  return HAIRSTYLE_REGISTRY.filter((item) => item.compatiblePresentations.includes(presentation));
}
