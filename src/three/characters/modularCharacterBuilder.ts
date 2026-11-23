import * as THREE from 'three';
import {
  ANIMATION_REGISTRY,
  BODY_BUILD_OPTIONS,
} from '../../features/avatar/assets/avatarRegistry';
import type {
  AvatarAccessoryId,
  AvatarClothingStyleId,
  AvatarConfigV3,
  AvatarHairStyleId,
  AvatarModelCapabilities,
} from '../../features/avatar/types/avatarTypes';
import {
  createCharacterMaterials,
  disposeCharacterMaterials,
  updateCharacterMaterials,
  type CharacterMaterialSet,
} from '../materials/fabricTextures';
import {
  createHumanoidRig,
  disposeObjectSubtree,
  type HumanoidRig,
} from '../rigs/humanoidRig';

function makeLatheLimb(
  topR: number,
  midR: number,
  botR: number,
  length: number,
  radialSegments = 18,
  yTop = 0,
) {
  const pts = [
    new THREE.Vector2(0.001, yTop),
    new THREE.Vector2(topR * 0.96, yTop - length * 0.04),
    new THREE.Vector2(topR, yTop - length * 0.18),
    new THREE.Vector2(midR, yTop - length * 0.52),
    new THREE.Vector2(botR, yTop - length * 0.88),
    new THREE.Vector2(botR * 0.9, yTop - length),
    new THREE.Vector2(0.001, yTop - length),
  ];
  const geo = new THREE.LatheGeometry(pts, radialSegments);
  geo.computeVertexNormals();
  return geo;
}

function addCastShadowMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  pos: [number, number, number] = [0, 0, 0],
  rot: [number, number, number] = [0, 0, 0],
  scale: [number, number, number] = [1, 1, 1],
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export class ModularCharacterInstance {
  readonly rig: HumanoidRig;
  readonly materials: CharacterMaterialSet;
  private currentConfig: AvatarConfigV3;
  private anisotropy: number;

  constructor(initialConfig: AvatarConfigV3, anisotropy = 4) {
    this.anisotropy = anisotropy;
    this.materials = createCharacterMaterials(anisotropy);
    const shoulderHalf = this.computeShoulderHalfSpan(initialConfig);
    this.rig = createHumanoidRig(shoulderHalf);
    this.currentConfig = initialConfig;

    this.buildBodyAndHead(initialConfig);
    this.buildHair(initialConfig.hairstyle);
    this.buildClothing(initialConfig);
    this.buildAccessories(initialConfig);
    this.buildTeaCupProp();
    this.applyColorsAndScale(initialConfig);
  }

  get capabilities(): AvatarModelCapabilities {
    return {
      sourceMode: 'procedural-reference-rig',
      hasSkeletonRig: true,
      supportsBodyScaling: true,
      supportsShoulderWidth: true,
      supportsFacialMorphs: true,
      availableMorphTargets: [
        'faceShape',
        'jawline',
        'eyeShape',
        'eyebrowShape',
        'noseShape',
        'lipShape',
        'expression',
      ],
      supportsMaterialTinting: true,
      availableAnimations: ANIMATION_REGISTRY.map((a) => a.id),
      unavailableAnimations: [],
      meshCount: this.countMeshes(),
      skinnedMeshCount: 0,
      skeletonBoneCount: Object.keys(this.rig.joints).length,
      statusDetails: 'Zen Humanoid Reference Rig · 20 articulated joints',
    };
  }

  private countMeshes(): number {
    let count = 0;
    this.rig.root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) count += 1;
    });
    return count;
  }

  private computeShoulderHalfSpan(config: AvatarConfigV3): number {
    const base =
      config.genderPresentation === 'masculine'
        ? 0.19
        : config.genderPresentation === 'feminine'
          ? 0.162
          : 0.175;
    return base * config.body.shoulderWidth;
  }

  private getBodyRatios(config: AvatarConfigV3) {
    const buildSpec =
      BODY_BUILD_OPTIONS.find((b) => b.id === config.body.buildPreset) ?? BODY_BUILD_OPTIONS[1];
    const presWidth =
      config.genderPresentation === 'masculine'
        ? 1.05
        : config.genderPresentation === 'feminine'
          ? 0.94
          : 0.99;
    const hipRatio =
      config.genderPresentation === 'feminine'
        ? 1.05
        : config.genderPresentation === 'masculine'
          ? 0.95
          : 1.0;

    return {
      torsoScale: buildSpec.torsoScale * presWidth,
      limbScale: buildSpec.limbScale,
      hipRatio: hipRatio * buildSpec.torsoScale * (1 + config.body.silhouetteBalance * 0.14),
      shoulderHalf: this.computeShoulderHalfSpan(config),
    };
  }

  updateConfig(nextConfig: AvatarConfigV3) {
    const prev = this.currentConfig;

    const bodyChanged =
      prev.genderPresentation !== nextConfig.genderPresentation ||
      prev.body.buildPreset !== nextConfig.body.buildPreset ||
      prev.body.shoulderWidth !== nextConfig.body.shoulderWidth ||
      prev.body.silhouetteBalance !== nextConfig.body.silhouetteBalance;

    const faceChanged =
      prev.face.faceShape !== nextConfig.face.faceShape ||
      prev.face.jawline !== nextConfig.face.jawline ||
      prev.face.eyeShape !== nextConfig.face.eyeShape ||
      prev.face.eyebrowShape !== nextConfig.face.eyebrowShape ||
      prev.face.noseShape !== nextConfig.face.noseShape ||
      prev.face.lipShape !== nextConfig.face.lipShape ||
      prev.face.expression !== nextConfig.face.expression;

    const hairChanged = prev.hairstyle !== nextConfig.hairstyle;
    const clothingChanged = prev.clothing.style !== nextConfig.clothing.style || bodyChanged;
    const accessoriesChanged =
      JSON.stringify(prev.accessories) !== JSON.stringify(nextConfig.accessories) ||
      clothingChanged ||
      hairChanged;

    if (bodyChanged) {
      const shoulderHalf = this.computeShoulderHalfSpan(nextConfig);
      this.rig.joints.leftUpperArm.position.x = -(shoulderHalf - 0.06);
      this.rig.joints.rightUpperArm.position.x = shoulderHalf - 0.06;
      this.buildBodyAndHead(nextConfig);
    } else if (faceChanged) {
      this.buildHeadFeatures(nextConfig);
    }

    if (hairChanged) {
      this.buildHair(nextConfig.hairstyle);
    }

    if (clothingChanged) {
      this.buildClothing(nextConfig);
    }

    if (accessoriesChanged) {
      this.buildAccessories(nextConfig);
    }

    this.applyColorsAndScale(nextConfig);
    this.currentConfig = nextConfig;
  }

  private applyColorsAndScale(config: AvatarConfigV3) {
    this.rig.root.scale.setScalar(config.body.heightScale);
    updateCharacterMaterials(this.materials, {
      skinTone: config.skin.tone,
      hairColor: config.hairColor,
      fabric: config.clothing.material,
      primary: config.clothingColors.primary,
      secondary: config.clothingColors.secondary,
      sash: config.clothingColors.sash,
      anisotropy: this.anisotropy,
    });
  }

  private buildBodyAndHead(config: AvatarConfigV3) {
    const { torsoScale, limbScale, hipRatio } = this.getBodyRatios(config);

    disposeObjectSubtree(this.rig.slots.bodyRoot);
    disposeObjectSubtree(this.rig.slots.leftUpperSleeve);
    disposeObjectSubtree(this.rig.slots.leftForeSleeve);
    disposeObjectSubtree(this.rig.slots.rightUpperSleeve);
    disposeObjectSubtree(this.rig.slots.rightForeSleeve);

    // Pelvis / Hips core
    const pelvisGeo = new THREE.SphereGeometry(0.145, 22, 18);
    addCastShadowMesh(
      this.rig.slots.bodyRoot,
      pelvisGeo,
      this.materials.skin,
      [0, 0.02, 0],
      [0, 0, 0],
      [1.02 * hipRatio, 0.72, 0.72 * hipRatio],
    );

    // Waist & Torso attached to chest/spine via bodyRoot offsets
    const torsoPts = [
      new THREE.Vector2(0.001, -0.02),
      new THREE.Vector2(0.135 * hipRatio, 0.02),
      new THREE.Vector2(0.118 * torsoScale, 0.14),
      new THREE.Vector2(0.142 * torsoScale, 0.34),
      new THREE.Vector2(0.155 * torsoScale, 0.45),
      new THREE.Vector2(0.08 * torsoScale, 0.51),
      new THREE.Vector2(0.001, 0.52),
    ];
    const torsoGeo = new THREE.LatheGeometry(torsoPts, 24);
    torsoGeo.computeVertexNormals();
    addCastShadowMesh(
      this.rig.slots.bodyRoot,
      torsoGeo,
      this.materials.skin,
      [0, 0.02, 0],
      [0, 0, 0],
      [1, 1, 0.68],
    );

    // Neck cylinder
    const neckGeo = makeLatheLimb(0.044, 0.046, 0.052, 0.125, 16, 0.125);
    addCastShadowMesh(this.rig.joints.neck, neckGeo, this.materials.skin, [0, -0.01, 0]);

    // Base limbs (arms, hands, thighs, shins) directly under joint nodes
    // Note: Clothing sleeves/trousers overlay cleanly without z-fighting
    const upperArmGeo = makeLatheLimb(0.046 * limbScale, 0.041 * limbScale, 0.036 * limbScale, 0.27, 16, 0);
    const foreArmGeo = makeLatheLimb(0.037 * limbScale, 0.031 * limbScale, 0.025 * limbScale, 0.24, 16, 0);
    const handGeo = new THREE.SphereGeometry(0.032, 14, 12);

    addCastShadowMesh(this.rig.joints.leftUpperArm, upperArmGeo, this.materials.skin);
    addCastShadowMesh(this.rig.joints.leftForearm, foreArmGeo, this.materials.skin);
    addCastShadowMesh(this.rig.joints.leftHand, handGeo, this.materials.skin, [0, -0.04, 0.008], [0, 0, 0], [0.78, 1.45, 0.48]);

    addCastShadowMesh(this.rig.joints.rightUpperArm, upperArmGeo.clone(), this.materials.skin);
    addCastShadowMesh(this.rig.joints.rightForearm, foreArmGeo.clone(), this.materials.skin);
    addCastShadowMesh(this.rig.joints.rightHand, handGeo.clone(), this.materials.skin, [0, -0.04, 0.008], [0, 0, 0], [0.78, 1.45, 0.48]);

    const thighGeo = makeLatheLimb(0.072 * limbScale, 0.062 * limbScale, 0.048 * limbScale, 0.43, 18, 0);
    const shinGeo = makeLatheLimb(0.049 * limbScale, 0.043 * limbScale, 0.032 * limbScale, 0.4, 18, 0);
    addCastShadowMesh(this.rig.joints.leftThigh, thighGeo, this.materials.skin);
    addCastShadowMesh(this.rig.joints.leftShin, shinGeo, this.materials.skin);
    addCastShadowMesh(this.rig.joints.rightThigh, thighGeo.clone(), this.materials.skin);
    addCastShadowMesh(this.rig.joints.rightShin, shinGeo.clone(), this.materials.skin);

    // Footwear (Tabi / minimal cloth tea-house shoes)
    disposeObjectSubtree(this.rig.slots.leftFoot);
    disposeObjectSubtree(this.rig.slots.rightFoot);
    const footGeo = new THREE.SphereGeometry(0.045, 16, 12);
    addCastShadowMesh(this.rig.slots.leftFoot, footGeo, this.materials.footwear, [0, -0.035, 0.042], [0, 0, 0], [0.95, 0.55, 1.95]);
    addCastShadowMesh(this.rig.slots.rightFoot, footGeo.clone(), this.materials.footwear, [0, -0.035, 0.042], [0, 0, 0], [0.95, 0.55, 1.95]);

    this.buildHeadFeatures(config);
  }

  private buildHeadFeatures(config: AvatarConfigV3) {
    disposeObjectSubtree(this.rig.slots.headFeature);
    const headSlot = this.rig.slots.headFeature;
    const { faceShape, jawline, eyeShape, eyebrowShape, noseShape, lipShape, expression } = config.face;

    // Cranium & face proportions
    const widthScale =
      faceShape === 'defined' ? 0.94 : faceShape === 'gentle-square' ? 1.03 : faceShape === 'soft' ? 1.02 : 0.98;
    const heightScale = faceShape === 'oval' ? 1.04 : faceShape === 'defined' ? 1.03 : 0.99;

    const skullGeo = new THREE.SphereGeometry(0.095, 28, 22);
    addCastShadowMesh(headSlot, skullGeo, this.materials.skin, [0, 0.015, -0.005], [0, 0, 0], [widthScale, 1.15 * heightScale, 1.04]);

    // Jaw / Chin sculpted taper
    const jawScaleX = (0.72 + jawline * 0.09) * widthScale;
    const jawGeo = new THREE.SphereGeometry(0.068, 20, 16);
    addCastShadowMesh(headSlot, jawGeo, this.materials.skin, [0, -0.048, 0.014], [0.16, 0, 0], [jawScaleX, 0.92, 0.88]);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.018, 12, 10);
    addCastShadowMesh(headSlot, earGeo, this.materials.skin, [-0.094 * widthScale, 0.004, -0.012], [0, -0.2, 0], [0.45, 1.3, 0.72]);
    addCastShadowMesh(headSlot, earGeo.clone(), this.materials.skin, [0.094 * widthScale, 0.004, -0.012], [0, 0.2, 0], [0.45, 1.3, 0.72]);

    // Nose bridge & tip
    const noseWidth = noseShape === 'refined' ? 0.82 : noseShape === 'soft' ? 1.12 : 0.96;
    const noseBridge = new THREE.CylinderGeometry(0.0065 * noseWidth, 0.01 * noseWidth, 0.042, 10);
    addCastShadowMesh(headSlot, noseBridge, this.materials.skin, [0, 0.006, 0.092], [-0.25, 0, 0]);
    const noseTip = new THREE.SphereGeometry(0.011 * noseWidth, 12, 10);
    addCastShadowMesh(headSlot, noseTip, this.materials.skin, [0, -0.012, 0.099], [0, 0, 0], [1.05, 0.85, 0.95]);

    // Eyes (sclera + iris + upper eyelid line)
    const eyeScaleY = eyeShape === 'narrow' ? 0.65 : eyeShape === 'gentle' ? 1.05 : 0.85;
    const eyeTilt = eyeShape === 'almond' ? 0.12 : eyeShape === 'narrow' ? 0.16 : 0.03;

    [-1, 1].forEach((side) => {
      const ex = side * 0.034;
      const ey = 0.022;
      const ez = 0.083;

      const sclera = new THREE.SphereGeometry(0.013, 14, 12);
      addCastShadowMesh(headSlot, sclera, this.materials.eyeSclera, [ex, ey, ez], [0, side * 0.18, side * eyeTilt], [1.18, 0.72 * eyeScaleY, 0.55]);

      const iris = new THREE.SphereGeometry(0.007, 12, 10);
      addCastShadowMesh(headSlot, iris, this.materials.eyeIris, [ex, ey, ez + 0.005], [0, 0, 0], [1, 1, 0.65]);

      // Eyebrow
      const browArch = eyebrowShape === 'arched' ? 0.16 : eyebrowShape === 'straight' ? 0.02 : 0.08;
      const browGeo = new THREE.CapsuleGeometry(0.0026, 0.024, 4, 8);
      addCastShadowMesh(
        headSlot,
        browGeo,
        this.materials.hair,
        [ex, ey + 0.019, ez + 0.005],
        [0, side * 0.14, Math.PI / 2 - side * browArch],
      );
    });

    // Lips & Expression
    const lipWidth = lipShape === 'thin' ? 0.86 : lipShape === 'full' ? 1.08 : 0.96;
    const lipThick = lipShape === 'thin' ? 0.75 : lipShape === 'full' ? 1.25 : 1.0;
    const smileCurve =
      expression === 'gentle-smile'
        ? 0.004
        : expression === 'serene'
          ? 0.002
          : expression === 'thoughtful'
            ? -0.001
            : 0;

    const upperLip = new THREE.CapsuleGeometry(0.0032 * lipThick, 0.022 * lipWidth, 4, 10);
    addCastShadowMesh(
      headSlot,
      upperLip,
      this.materials.skinLip,
      [0, -0.038 + smileCurve * 0.3, 0.089],
      [0, 0, Math.PI / 2],
    );
    const lowerLip = new THREE.CapsuleGeometry(0.0036 * lipThick, 0.018 * lipWidth, 4, 10);
    addCastShadowMesh(
      headSlot,
      lowerLip,
      this.materials.skinLip,
      [0, -0.044 + smileCurve * 0.5, 0.087],
      [0, 0, Math.PI / 2],
    );
  }

  private buildHair(hairstyle: AvatarHairStyleId) {
    disposeObjectSubtree(this.rig.slots.hair);
    const slot = this.rig.slots.hair;

    // Base fitted hair cap
    const capGeo = new THREE.SphereGeometry(0.102, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62);
    addCastShadowMesh(slot, capGeo, this.materials.hair, [0, 0.02, -0.008], [-0.22, 0, 0], [1.0, 1.12, 1.05]);

    const addBun = (pos: [number, number, number], r: number, scale: [number, number, number] = [1, 1, 1]) => {
      const bunGeo = new THREE.SphereGeometry(r, 18, 14);
      addCastShadowMesh(slot, bunGeo, this.materials.hair, pos, [0, 0, 0], scale);
    };

    const addBackCurtain = (length: number, width: number, yStart = 0.03, zOffset = -0.062) => {
      const pts = [
        new THREE.Vector2(0.055 * width, yStart),
        new THREE.Vector2(0.095 * width, yStart - length * 0.2),
        new THREE.Vector2(0.102 * width, yStart - length * 0.65),
        new THREE.Vector2(0.088 * width, yStart - length),
        new THREE.Vector2(0.001, yStart - length - 0.02),
      ];
      const geo = new THREE.LatheGeometry(pts, 18, Math.PI * 0.45, Math.PI * 1.1);
      geo.computeVertexNormals();
      addCastShadowMesh(slot, geo, this.materials.hair, [0, 0, zOffset], [0.06, 0, 0], [1.1, 1, 0.72]);
    };

    const addSideLocks = (length: number) => {
      [-1, 1].forEach((side) => {
        const lockGeo = makeLatheLimb(0.022, 0.02, 0.012, length, 10, 0);
        addCastShadowMesh(
          slot,
          lockGeo,
          this.materials.hair,
          [side * 0.088, 0.03, 0.022],
          [0.05, 0, side * 0.08],
        );
      });
    };

    switch (hairstyle) {
      case 'short-natural':
      case 'minimal-short': {
        addBun([0, 0.03, -0.04], 0.088, [1.06, 0.9, 0.92]);
        const fringeGeo = new THREE.SphereGeometry(0.086, 16, 12, 0, Math.PI, 0, Math.PI * 0.4);
        addCastShadowMesh(slot, fringeGeo, this.materials.hair, [0, 0.058, 0.022], [0.32, 0, 0], [1.05, 0.75, 0.9]);
        break;
      }
      case 'medium-natural':
      case 'medium-layered': {
        addBackCurtain(0.22, 0.95, 0.03, -0.032);
        addSideLocks(0.17);
        break;
      }
      case 'long-traditional':
      case 'long-straight': {
        addBackCurtain(0.44, 1.05, 0.04, -0.036);
        addSideLocks(0.26);
        break;
      }
      case 'loose-natural': {
        addBackCurtain(0.28, 1.02, 0.04, -0.034);
        addSideLocks(0.22);
        break;
      }
      case 'traditional-topknot': {
        addBun([0, 0.145, -0.025], 0.045, [0.95, 1.15, 0.95]);
        const baseRing = new THREE.TorusGeometry(0.036, 0.012, 10, 20);
        addCastShadowMesh(slot, baseRing, this.materials.hair, [0, 0.118, -0.025], [Math.PI / 2, 0, 0]);
        break;
      }
      case 'traditional-bun': {
        addBun([0, -0.015, -0.105], 0.054, [1.05, 0.95, 0.9]);
        break;
      }
      case 'neatly-tied':
      case 'minimal-tied':
      case 'long-tied': {
        addBun([0, -0.01, -0.095], 0.038, [0.9, 0.95, 0.9]);
        const tailLen = hairstyle === 'long-tied' ? 0.34 : 0.19;
        const tailGeo = makeLatheLimb(0.028, 0.034, 0.018, tailLen, 14, 0);
        addCastShadowMesh(slot, tailGeo, this.materials.hair, [0, -0.02, -0.11], [0.14, 0, 0]);
        break;
      }
      case 'half-up': {
        addBun([0, 0.04, -0.095], 0.038, [1.0, 0.9, 0.9]);
        addBackCurtain(0.36, 1.0, 0.02, -0.038);
        addSideLocks(0.2);
        break;
      }
    }
  }

  private buildClothing(config: AvatarConfigV3) {
    const {
      torsoGarment,
      hipsGarment,
      leftUpperSleeve,
      leftForeSleeve,
      rightUpperSleeve,
      rightForeSleeve,
      leftThighGarment,
      leftShinGarment,
      rightThighGarment,
      rightShinGarment,
    } = this.rig.slots;

    [
      torsoGarment,
      hipsGarment,
      leftUpperSleeve,
      leftForeSleeve,
      rightUpperSleeve,
      rightForeSleeve,
      leftThighGarment,
      leftShinGarment,
      rightThighGarment,
      rightShinGarment,
    ].forEach(disposeObjectSubtree);

    const { torsoScale, limbScale, hipRatio } = this.getBodyRatios(config);
    const style = config.clothing.style;

    const isWideSleeve =
      style === 'minimal-kimono' ||
      style === 'simple-yukata' ||
      style === 'traditional-hanfu' ||
      style === 'scholar-robe';

    const isLongSkirtOrRobe =
      style === 'minimal-kimono' ||
      style === 'simple-yukata' ||
      style === 'traditional-hanfu' ||
      style === 'scholar-robe' ||
      style === 'minimal-long-skirt';

    const isWideHakama = style === 'traditional-haori';

    // Upper torso garment shell attached to chest joint
    // Chest joint is at +0.36 above hips; garment extends from +0.16 down to -0.36
    const chestTopR = 0.158 * torsoScale;
    const chestMidR = 0.15 * torsoScale;
    const waistR = (isWideSleeve ? 0.148 : 0.138) * torsoScale;
    const torsoPts = [
      new THREE.Vector2(0.068 * torsoScale, 0.165),
      new THREE.Vector2(chestTopR, 0.125),
      new THREE.Vector2(chestMidR, 0.0),
      new THREE.Vector2(waistR, -0.22),
      new THREE.Vector2(waistR * 1.08, -0.34),
    ];
    const upperGeo = new THREE.LatheGeometry(torsoPts, 24);
    upperGeo.computeVertexNormals();
    addCastShadowMesh(torsoGarment, upperGeo, this.materials.clothPrimary, [0, 0, 0], [0, 0, 0], [1, 1, 0.72]);

    // Collar / Lapel details
    if (
      style === 'minimal-kimono' ||
      style === 'simple-yukata' ||
      style === 'traditional-hanfu' ||
      style === 'scholar-robe' ||
      style === 'linen-samue' ||
      style === 'minimal-long-skirt'
    ) {
      // Y-shape cross-collar trim (Right-over-left / Y-collar)
      const lapelGeo = new THREE.BoxGeometry(0.028, 0.24, 0.016);
      addCastShadowMesh(torsoGarment, lapelGeo, this.materials.clothSecondary, [-0.025, 0.055, 0.104], [0.08, 0, -0.34]);
      addCastShadowMesh(torsoGarment, lapelGeo.clone(), this.materials.clothSecondary, [0.025, 0.055, 0.101], [0.08, 0, 0.34]);
    } else if (style === 'traditional-haori') {
      // Open haori coat outer layer in secondary or primary contrast
      const haoriGeo = new THREE.CylinderGeometry(0.168 * torsoScale, 0.185 * torsoScale, 0.56, 22, 1, true, Math.PI * 0.16, Math.PI * 1.68);
      addCastShadowMesh(torsoGarment, haoriGeo, this.materials.clothSecondary, [0, -0.1, -0.005], [0, 0, 0], [1, 1, 0.75]);
    } else if (style === 'tang-shirt' || style === 'linen-shirt-trousers') {
      // Mandarin stand collar + subtle front buttons
      const collarGeo = new THREE.CylinderGeometry(0.065, 0.068, 0.042, 20, 1, true);
      addCastShadowMesh(torsoGarment, collarGeo, this.materials.clothSecondary, [0, 0.17, 0.008]);
      for (let i = 0; i < 4; i += 1) {
        const btn = new THREE.SphereGeometry(0.006, 8, 8);
        addCastShadowMesh(torsoGarment, btn, this.materials.wood, [0, 0.11 - i * 0.065, 0.115]);
      }
    }

    // Sleeves on upper arm & forearm joints
    const upperSleeveR = (isWideSleeve ? 0.072 : 0.056) * limbScale;
    const foreSleeveTopR = (isWideSleeve ? 0.068 : 0.048) * limbScale;
    const foreSleeveBotR = (isWideSleeve ? 0.095 : 0.042) * limbScale;

    const uSleeveGeo = makeLatheLimb(upperSleeveR * 0.95, upperSleeveR, foreSleeveTopR, 0.26, 16, 0.02);
    const fSleeveGeo = makeLatheLimb(foreSleeveTopR, (foreSleeveTopR + foreSleeveBotR) * 0.5, foreSleeveBotR, isWideSleeve ? 0.22 : 0.21, 16, 0.01);

    const sleeveMat = style === 'traditional-haori' ? this.materials.clothSecondary : this.materials.clothPrimary;
    addCastShadowMesh(leftUpperSleeve, uSleeveGeo, sleeveMat);
    addCastShadowMesh(rightUpperSleeve, uSleeveGeo.clone(), sleeveMat);
    addCastShadowMesh(leftForeSleeve, fSleeveGeo, sleeveMat);
    addCastShadowMesh(rightForeSleeve, fSleeveGeo.clone(), sleeveMat);

    // Traditional hanging sleeve drape panels for Kimono / Hanfu
    if (style === 'minimal-kimono' || style === 'simple-yukata' || style === 'traditional-hanfu') {
      const drapeGeo = new THREE.BoxGeometry(0.032, 0.26, 0.16);
      addCastShadowMesh(leftForeSleeve, drapeGeo, this.materials.clothPrimary, [-0.015, -0.14, -0.02]);
      addCastShadowMesh(rightForeSleeve, drapeGeo.clone(), this.materials.clothPrimary, [0.015, -0.14, -0.02]);
    }

    // Waist Sash / Obi
    if (style === 'minimal-kimono' || style === 'simple-yukata' || style === 'traditional-hanfu' || style === 'scholar-robe' || style === 'linen-samue' || style === 'minimal-long-skirt') {
      const sashH = style === 'minimal-kimono' ? 0.13 : 0.075;
      const sashGeo = new THREE.CylinderGeometry(0.145 * torsoScale, 0.152 * torsoScale, sashH, 24);
      addCastShadowMesh(hipsGarment, sashGeo, this.materials.clothSash, [0, 0.08, 0], [0, 0, 0], [1, 1, 0.74]);
    }

    // Lower body: Skirt / Robe / Hakama / Trousers
    if (isLongSkirtOrRobe) {
      const skirtMat =
        style === 'minimal-long-skirt'
          ? this.materials.clothSecondary
          : this.materials.clothPrimary;
      const skirtPts = [
        new THREE.Vector2(0.148 * hipRatio, 0.05),
        new THREE.Vector2(0.185 * hipRatio, -0.25),
        new THREE.Vector2(0.22 * hipRatio, -0.58),
        new THREE.Vector2(0.245 * hipRatio, -0.82),
      ];
      const skirtGeo = new THREE.LatheGeometry(skirtPts, 26);
      skirtGeo.computeVertexNormals();
      addCastShadowMesh(hipsGarment, skirtGeo, skirtMat, [0, 0, 0], [0, 0, 0], [1, 1, 0.8]);
    } else if (isWideHakama) {
      // Wide pleated hakama trousers on thighs + shins
      const hakamaThighGeo = makeLatheLimb(0.115 * limbScale, 0.125 * limbScale, 0.13 * limbScale, 0.42, 16, 0.03);
      const hakamaShinGeo = makeLatheLimb(0.125 * limbScale, 0.13 * limbScale, 0.135 * limbScale, 0.38, 16, 0.02);
      addCastShadowMesh(leftThighGarment, hakamaThighGeo, this.materials.clothPrimary);
      addCastShadowMesh(rightThighGarment, hakamaThighGeo.clone(), this.materials.clothPrimary);
      addCastShadowMesh(leftShinGarment, hakamaShinGeo, this.materials.clothPrimary);
      addCastShadowMesh(rightShinGarment, hakamaShinGeo.clone(), this.materials.clothPrimary);
    } else {
      // Tailored / wide natural trousers
      const wide = style === 'linen-shirt-trousers' || style === 'loose-natural-set' ? 1.22 : 1.05;
      const legMat = style === 'linen-shirt-trousers' ? this.materials.clothSecondary : this.materials.clothPrimary;
      const thighTrouser = makeLatheLimb(0.088 * limbScale * wide, 0.078 * limbScale * wide, 0.068 * limbScale * wide, 0.42, 16, 0.02);
      const shinTrouser = makeLatheLimb(0.067 * limbScale * wide, 0.062 * limbScale * wide, 0.056 * limbScale * wide, 0.38, 16, 0.02);
      addCastShadowMesh(leftThighGarment, thighTrouser, legMat);
      addCastShadowMesh(rightThighGarment, thighTrouser.clone(), legMat);
      addCastShadowMesh(leftShinGarment, shinTrouser, legMat);
      addCastShadowMesh(rightShinGarment, shinTrouser.clone(), legMat);
    }
  }

  private buildAccessories(config: AvatarConfigV3) {
    const { headAccessory, rightWristAccessory, waistAccessory, torsoGarment } = this.rig.slots;
    disposeObjectSubtree(headAccessory);
    disposeObjectSubtree(rightWristAccessory);
    disposeObjectSubtree(waistAccessory);

    // Remove previously attached necklace from torsoGarment by name
    const oldNecklace = torsoGarment.getObjectByName('accessory_simple_necklace');
    if (oldNecklace) {
      disposeObjectSubtree(oldNecklace);
      torsoGarment.remove(oldNecklace);
    }

    const accSet = new Set<AvatarAccessoryId>(config.accessories);

    if (accSet.has('wooden-hairpin') || accSet.has('bamboo-hairpin')) {
      const mat = accSet.has('bamboo-hairpin') ? this.materials.bamboo : this.materials.wood;
      const pinGeo = new THREE.CylinderGeometry(0.0038, 0.0022, 0.18, 10);
      const pinY = config.hairstyle === 'traditional-topknot' ? 0.145 : 0.0;
      const pinZ = config.hairstyle === 'traditional-topknot' ? -0.025 : -0.105;
      addCastShadowMesh(headAccessory, pinGeo, mat, [0.01, pinY, pinZ], [0.15, 0, Math.PI / 2.7]);
      const finial = new THREE.SphereGeometry(0.007, 10, 8);
      addCastShadowMesh(headAccessory, finial, mat, [0.088, pinY + 0.036, pinZ]);
    }

    if (accSet.has('fabric-hair-tie')) {
      const tieGeo = new THREE.TorusGeometry(0.032, 0.007, 10, 18);
      addCastShadowMesh(headAccessory, tieGeo, this.materials.clothSash, [0, -0.01, -0.092], [0.2, 0, 0]);
    }

    if (accSet.has('wooden-bracelet')) {
      for (let i = 0; i < 10; i += 1) {
        const angle = (i / 10) * Math.PI * 2;
        const bead = new THREE.SphereGeometry(0.0062, 8, 8);
        addCastShadowMesh(
          rightWristAccessory,
          bead,
          this.materials.wood,
          [Math.cos(angle) * 0.029, -0.215, Math.sin(angle) * 0.029],
        );
      }
    }

    if (accSet.has('simple-necklace')) {
      const necklaceGroup = new THREE.Group();
      necklaceGroup.name = 'accessory_simple_necklace';
      const cord = new THREE.TorusGeometry(0.068, 0.0025, 8, 24);
      addCastShadowMesh(necklaceGroup, cord, this.materials.wood, [0, 0.145, 0.02], [Math.PI / 2.3, 0, 0]);
      const pendant = new THREE.CylinderGeometry(0.012, 0.012, 0.005, 16);
      addCastShadowMesh(necklaceGroup, pendant, this.materials.bamboo, [0, 0.095, 0.096], [Math.PI / 2, 0, 0]);
      torsoGarment.add(necklaceGroup);
    }

    if (accSet.has('minimal-belt')) {
      const beltGeo = new THREE.CylinderGeometry(0.146, 0.148, 0.034, 24);
      addCastShadowMesh(waistAccessory, beltGeo, this.materials.wood, [0, 0.085, 0], [0, 0, 0], [1, 1, 0.74]);
    }

    if (accSet.has('traditional-sash')) {
      const obiGeo = new THREE.CylinderGeometry(0.15, 0.154, 0.095, 24);
      addCastShadowMesh(waistAccessory, obiGeo, this.materials.clothSash, [0, 0.085, 0], [0, 0, 0], [1, 1, 0.75]);
      const knotGeo = new THREE.BoxGeometry(0.09, 0.075, 0.036);
      addCastShadowMesh(waistAccessory, knotGeo, this.materials.clothSash, [0, 0.085, -0.118]);
    }

    if (accSet.has('tea-pouch')) {
      const pouchGeo = new THREE.SphereGeometry(0.036, 14, 12);
      addCastShadowMesh(waistAccessory, pouchGeo, this.materials.clothSecondary, [0.148, -0.02, 0.04], [0, 0, 0], [0.75, 1.25, 0.88]);
      const cordGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.08, 8);
      addCastShadowMesh(waistAccessory, cordGeo, this.materials.wood, [0.145, 0.045, 0.035]);
    }
  }

  private buildTeaCupProp() {
    disposeObjectSubtree(this.rig.slots.rightHandProp);
    const prop = this.rig.slots.rightHandProp;
    const cupPts = [
      new THREE.Vector2(0.001, 0),
      new THREE.Vector2(0.018, 0),
      new THREE.Vector2(0.028, 0.014),
      new THREE.Vector2(0.032, 0.038),
      new THREE.Vector2(0.029, 0.038),
      new THREE.Vector2(0.024, 0.012),
      new THREE.Vector2(0.001, 0.006),
    ];
    const cupGeo = new THREE.LatheGeometry(cupPts, 18);
    cupGeo.computeVertexNormals();
    addCastShadowMesh(prop, cupGeo, this.materials.ceramic, [0, -0.045, 0.035], [0.25, 0, 0]);
    prop.visible = false;
  }

  dispose() {
    disposeObjectSubtree(this.rig.root);
    disposeCharacterMaterials(this.materials);
  }
}

export function buildCharacterPlaceholder(config: AvatarConfigV3, anisotropy = 4) {
  return new ModularCharacterInstance(config, anisotropy);
}
