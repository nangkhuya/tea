import { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  AnimationAction,
  AnimationMixer,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  CylinderGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import type { AvatarConfig } from '../../types/domain';
import { AVATAR_MODEL_MANIFEST, AvatarMotion, findMotionClip, loadAvatarModel } from './avatarAssets';

interface Props {
  config: AvatarConfig;
  portrait: boolean;
  motion: AvatarMotion;
  resetViewKey: number;
  onAssetStatus: (status: 'demo' | 'loading' | 'ready' | 'error', details?: string) => void;
  onAvailableMotions: (motions: AvatarMotion[]) => void;
}

const skinColors: Record<AvatarConfig['appearance']['skinTone'], string> = {
  porcelain: '#efd9c9', 'warm-beige': '#d6ab8c', 'amber-olive': '#bd8c68', 'deep-bronze': '#80533f',
};
const clothColors: Record<AvatarConfig['colors']['primary'], string> = {
  'warm-ivory': '#ded2bb', 'moss-green': '#68715b', 'muted-indigo': '#59677a', 'walnut-earth': '#74543d',
};
const hairColors: Record<AvatarConfig['hairColor'], string> = {
  espresso: '#29221e', chestnut: '#594033', silver: '#a8a39a',
};

function material(color: string, roughness = 0.82) {
  return new MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function addEllipsoid(parent: Object3D, color: string, pos: [number, number, number], scale: [number, number, number], mat?: MeshStandardMaterial) {
  const mesh = new Mesh(new SphereGeometry(1, 32, 24), mat ?? material(color));
  mesh.position.set(...pos);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addLimb(parent: Object3D, color: string, top: [number, number, number], bottom: [number, number, number], radius: number) {
  const a = new Object3D(); a.position.set(...top);
  const b = new Object3D(); b.position.set(...bottom);
  const length = a.position.distanceTo(b.position);
  const mesh = new Mesh(new CylinderGeometry(radius * 0.78, radius, length, 20, 1, false), material(color));
  mesh.position.set((top[0] + bottom[0]) / 2, (top[1] + bottom[1]) / 2, (top[2] + bottom[2]) / 2);
  const direction = b.position.clone().sub(a.position).normalize();
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);
  mesh.castShadow = true;
  parent.add(mesh);
  addEllipsoid(parent, color, top, [radius, radius, radius]);
  addEllipsoid(parent, color, bottom, [radius * 0.86, radius * 0.86, radius * 0.86]);
}

function buildDemoFigure(config: AvatarConfig) {
  const root = new Group();
  root.name = 'ProceduralDemoFigure_NotRigged';
  const skin = skinColors[config.appearance.skinTone];
  const cloth = clothColors[config.colors.primary];
  const hair = hairColors[config.hairColor];
  const height = config.body.heightScale;
  const presentationWidth = config.appearance.presentation === 'masculine' ? 1.06 : config.appearance.presentation === 'feminine' ? 0.96 : 1;
  const robeWidth = config.clothing === 'hanfu-scholar' || config.clothing === 'tea-robe' ? 1.13 : config.clothing === 'zen-yukata' ? 1.08 : 1;
  root.scale.setScalar(height);
  // Neutral, clearly illustrative proportions. This mesh group has no skeleton or animation rig.
  addEllipsoid(root, cloth, [0, 1.03, 0], [0.38 * presentationWidth * robeWidth, 0.56, 0.24]);
  addEllipsoid(root, config.colors.accent === 'moss-green' ? '#59604d' : clothColors[config.colors.accent], [0, 1.18, 0.01], [0.405 * presentationWidth, 0.29, 0.255]);
  if (config.clothing === 'hanfu-scholar' || config.clothing === 'tea-robe' || config.clothing === 'zen-yukata') {
    const sash = new Mesh(new CylinderGeometry(0.305, 0.305, 0.095, 32), material(clothColors[config.colors.accent]));
    sash.position.set(0, 0.83, 0); sash.scale.z = 0.78; sash.castShadow = true; root.add(sash);
  }
  if (config.clothing === 'hanfu-scholar') {
    addEllipsoid(root, cloth, [-0.42, 1.25, 0], [0.15, 0.18, 0.17]);
    addEllipsoid(root, cloth, [0.42, 1.25, 0], [0.15, 0.18, 0.17]);
  }
  addEllipsoid(root, skin, [0, 1.67, 0], [0.11, 0.14, 0.11]);
  const faceScale = config.appearance.facePreset === 'defined' ? [0.205, 0.275, 0.205] : config.appearance.facePreset === 'oval' ? [0.19, 0.285, 0.19] : [0.22, 0.27, 0.215];
  addEllipsoid(root, skin, [0, 1.96, 0], faceScale as [number, number, number]);
  // Hair cap and distinct silhouettes respond to the selected modular style.
  addEllipsoid(root, hair, [0, 2.115, -0.015], [0.222, 0.15, 0.218]);
  if (config.hairstyle === 'shoulder-natural') {
    addEllipsoid(root, hair, [0, 1.91, -0.11], [0.23, 0.32, 0.14]);
    addEllipsoid(root, hair, [-0.18, 1.77, 0.015], [0.065, 0.25, 0.08]);
    addEllipsoid(root, hair, [0.18, 1.77, 0.015], [0.065, 0.25, 0.08]);
  } else if (config.hairstyle === 'short-neat') {
    addEllipsoid(root, hair, [0, 2.03, -0.08], [0.215, 0.14, 0.15]);
  } else {
    addEllipsoid(root, hair, [0, 1.98, -0.205], [0.11, 0.13, 0.09]);
    if (config.hairstyle === 'pinned-classic' || config.accessories.includes('wooden-hairpin')) {
      const pin = new Mesh(new CylinderGeometry(0.012, 0.012, 0.34, 10), material('#9d7650'));
      pin.position.set(0.06, 2.15, -0.23); pin.rotation.z = Math.PI / 3; root.add(pin);
    }
  }
  // Face details are understated to keep the preview calm at this scale.
  const dark = material('#3b302b', 0.95);
  addEllipsoid(root, '#443730', [-0.075, 1.98, 0.188], [0.018, 0.012, 0.012], dark);
  addEllipsoid(root, '#443730', [0.075, 1.98, 0.188], [0.018, 0.012, 0.012], dark);
  const teaPose = config.body.posture === 'relaxed-tea';
  const leftHand: [number, number, number] = teaPose ? [-0.22, 0.98, 0.2] : [-0.42, 0.78, 0.12];
  const rightHand: [number, number, number] = teaPose ? [0.22, 0.98, 0.2] : [0.42, 0.78, 0.12];
  addLimb(root, skin, [-0.31, 1.31, 0], leftHand, 0.075);
  addLimb(root, skin, [0.31, 1.31, 0], rightHand, 0.075);
  addEllipsoid(root, skin, leftHand, [0.075, 0.11, 0.07]);
  addEllipsoid(root, skin, rightHand, [0.075, 0.11, 0.07]);
  addLimb(root, cloth, [-0.19, 0.68, 0], [-0.19, 0.2, 0.02], 0.13);
  addLimb(root, cloth, [0.19, 0.68, 0], [0.19, 0.2, 0.02], 0.13);
  addEllipsoid(root, '#423b35', [-0.19, 0.12, 0.07], [0.14, 0.07, 0.22]);
  addEllipsoid(root, '#423b35', [0.19, 0.12, 0.07], [0.14, 0.07, 0.22]);
  if (config.accessories.includes('tea-beads')) {
    for (let i = 0; i < 5; i += 1) addEllipsoid(root, '#a98055', [0.27 + i * 0.036, 0.85, 0.14], [0.022, 0.022, 0.022]);
  }
  if (config.accessories.includes('round-glasses')) {
    const lensMaterial = new MeshStandardMaterial({ color: '#5a4938', metalness: 0.55, roughness: 0.36 });
    [-0.075, 0.075].forEach((x) => {
      const rim = new Mesh(new TorusGeometry(0.045, 0.006, 8, 28), lensMaterial);
      rim.position.set(x, 1.99, 0.2); root.add(rim);
    });
  }
  return root;
}

export function AvatarCanvas({ config, portrait, motion, resetViewKey, onAssetStatus, onAvailableMotions }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const characterRef = useRef<Group | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      setWebglError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor('#e6dfd1', 1);
    host.appendChild(renderer.domElement);
    const scene = new Scene(); scene.background = new Color('#e6dfd1');
    const camera = new PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 50);
    camera.position.set(0.35, 1.45, portrait ? 4.4 : 6.4); camera.lookAt(0, portrait ? 1.95 : 1.1, 0);
    scene.add(new HemisphereLight('#fff8e9', '#77705d', 2.05));
    scene.add(new AmbientLight('#ffffff', 0.45));
    const key = new DirectionalLight('#fff0d5', 3.1); key.position.set(-3, 5, 4); key.castShadow = true; scene.add(key);
    const rim = new DirectionalLight('#d2d8c5', 1.8); rim.position.set(3, 3, -3); scene.add(rim);
    const floor = new Mesh(new PlaneGeometry(20, 20), material('#d7cfbf'));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.02; floor.receiveShadow = true; scene.add(floor);
    sceneRef.current = scene; cameraRef.current = camera; rendererRef.current = renderer;
    let frame = 0;
    const draw = () => { frame = requestAnimationFrame(draw); if (characterRef.current) characterRef.current.rotation.y = turn; renderer.render(scene, camera); };
    draw();
    const resize = () => { if (!host.clientWidth || !host.clientHeight) return; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); };
    const observer = new ResizeObserver(resize); observer.observe(host);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); renderer.dispose(); renderer.domElement.remove(); scene.clear(); rendererRef.current = null; sceneRef.current = null; cameraRef.current = null; };
  }, []);

  useEffect(() => {
    const camera = cameraRef.current;
    if (camera) { camera.position.z = portrait ? 4.4 : 6.4; camera.lookAt(0, portrait ? 1.95 : 1.1, 0); }
  }, [portrait]);

  useEffect(() => {
    setTurn(0);
    const camera = cameraRef.current;
    if (camera) camera.position.z = portrait ? 4.4 : 6.4;
  }, [resetViewKey, portrait]);

  useEffect(() => {
    let cancelled = false;
    let mixer: AnimationMixer | null = null;
    let activeAction: AnimationAction | null = null;
    const scene = sceneRef.current;
    if (!scene) return;
    if (characterRef.current) { scene.remove(characterRef.current); characterRef.current = null; }
    const asset = AVATAR_MODEL_MANIFEST[0];
    const install = (group: Group) => {
      if (cancelled) return;
      group.scale.setScalar(config.body.heightScale);
      group.traverse((node) => {
        const mesh = node as Mesh;
        if (!mesh.isMesh || !mesh.material) return;
        const name = `${node.name} ${(mesh.material as MeshStandardMaterial).name ?? ''}`.toLowerCase();
        const mat = mesh.material as MeshStandardMaterial;
        if (/skin|body|face|head/.test(name)) mat.color?.set(skinColors[config.appearance.skinTone]);
        if (/cloth|robe|outfit|garment/.test(name)) mat.color?.set(clothColors[config.colors.primary]);
        if (/hair/.test(name)) mat.color?.set(hairColors[config.hairColor]);
      });
      characterRef.current = group; scene.add(group);
    };
    if (!asset) {
      onAssetStatus('demo'); onAvailableMotions([]); install(buildDemoFigure(config));
      return () => { cancelled = true; };
    }
    onAssetStatus('loading');
    loadAvatarModel(asset, (ratio) => onAssetStatus('loading', `${Math.round(ratio * 100)}%`)).then(({ scene: model, animations, report }) => {
      if (cancelled) return;
      install(model);
      const motions = (['idle', 'walk', 'seated-meditation', 'tea-cup'] as AvatarMotion[]).filter((item) => !!findMotionClip(animations, item));
      onAvailableMotions(motions);
      if (!report.hasRig) onAssetStatus('error', 'Model loaded without a skinned mesh and skeleton');
      else onAssetStatus('ready', `${report.meshCount} meshes · ${report.animationClips.length} clips`);
      mixer = new AnimationMixer(model);
      const clip = findMotionClip(animations, motion);
      if (clip) { activeAction = mixer.clipAction(clip); activeAction.play(); }
    }).catch((error: unknown) => {
      if (cancelled) return;
      onAssetStatus('error', error instanceof Error ? error.message : 'Unable to load configured GLB');
      onAvailableMotions([]); install(buildDemoFigure(config));
    });
    let raf = 0;
    let last = performance.now();
    const animate = (now: number) => { raf = requestAnimationFrame(animate); mixer?.update(Math.min((now - last) / 1000, 0.05)); last = now; };
    raf = requestAnimationFrame(animate);
    return () => { cancelled = true; cancelAnimationFrame(raf); activeAction?.stop(); mixer?.stopAllAction(); };
  }, [config, motion, onAssetStatus, onAvailableMotions]);

  const drag = useRef<{ x: number; base: number } | null>(null);
  return (
    <div
      ref={hostRef}
      className="relative h-full min-h-[360px] w-full touch-pan-y overflow-hidden bg-[#e6dfd1]"
      aria-label="Interactive 3D avatar preview"
      onPointerDown={(event) => { drag.current = { x: event.clientX, base: turn }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={(event) => { if (drag.current) setTurn(drag.current.base + (event.clientX - drag.current.x) * 0.008); }}
      onPointerUp={() => { drag.current = null; }}
      onWheel={(event) => { const camera = cameraRef.current; if (camera) { camera.position.z = Math.max(3, Math.min(7, camera.position.z + event.deltaY * 0.002)); } }}
      data-webgl-error={webglError ? 'true' : 'false'}
    >
      {webglError && <div className="absolute inset-0 z-10 grid place-items-center p-8 text-center text-sm text-[#5b5145]">WebGL is unavailable in this browser. The avatar configuration remains editable and can still be saved.</div>}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#d2c8b6]/55 to-transparent" />
    </div>
  );
}
