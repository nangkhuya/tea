import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AVATAR_MODEL_MANIFEST,
  CAMERA_PRESETS,
  PREVIEW_ENVIRONMENTS,
} from '../features/avatar/assets/avatarRegistry';
import type {
  AvatarAnimationId,
  AvatarConfigV3,
  AvatarModelCapabilities,
  CameraPresetId,
  PreviewEnvironmentId,
} from '../features/avatar/types/avatarTypes';
import type { GraphicsPreset } from '../types/domain';
import { AvatarAnimationController } from './animation/avatarAnimationController';
import { ModularCharacterInstance } from './characters/modularCharacterBuilder';
import {
  createPreviewEnvironments,
  type PreviewEnvironmentHandle,
} from './characters/previewEnvironments';
import {
  applyConfigToLoadedGlb,
  loadGlbAvatarAsset,
} from './loaders/avatarModelLoader';

export type ViewportAssetState = 'procedural' | 'loading' | 'glb-ready' | 'error';

export interface AvatarViewportCallbacks {
  onStatusChange?: (state: ViewportAssetState, details?: string) => void;
  onCapabilitiesChange?: (capabilities: AvatarModelCapabilities) => void;
  onWebGLError?: () => void;
}

const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export class AvatarViewportEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private keyLight: THREE.DirectionalLight;
  private envHandle: PreviewEnvironmentHandle;
  private envPmremTexture: THREE.Texture;
  private animController: AvatarAnimationController;
  private proceduralCharacter: ModularCharacterInstance | null = null;
  private glbCharacterRoot: THREE.Group | null = null;

  private isSoftwareGl: boolean;
  private quality: GraphicsPreset = 'medium';
  private reducedMotion = false;
  private disposed = false;
  private frameId = 0;
  private lastTime = performance.now();
  private cameraTransitionActive = false;
  private desiredCamPos = new THREE.Vector3(0.35, 1.12, 3.65);
  private desiredCamLook = new THREE.Vector3(0, 0.92, 0);

  private callbacks: AvatarViewportCallbacks;
  private resizeObserver: ResizeObserver;
  private currentConfig: AvatarConfigV3;

  constructor(
    container: HTMLElement,
    initialConfig: AvatarConfigV3,
    options: {
      quality: GraphicsPreset;
      reducedMotion: boolean;
      environment: PreviewEnvironmentId;
      cameraPreset: CameraPresetId;
      interactive: boolean;
    },
    callbacks: AvatarViewportCallbacks = {},
  ) {
    this.container = container;
    this.currentConfig = initialConfig;
    this.quality = options.quality;
    this.reducedMotion = options.reducedMotion;
    this.callbacks = callbacks;
    this.isSoftwareGl = detectSoftwareWebGL();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl && options.quality !== 'low',
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.applyQualitySettings(options.quality);

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // WebGL context loss safety
    this.renderer.domElement.addEventListener('webglcontextlost', this.handleContextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.handleContextRestored);

    this.scene = new THREE.Scene();
    const bgHex =
      PREVIEW_ENVIRONMENTS.find((e) => e.id === options.environment)?.backgroundHex ?? '#e7e0d3';
    this.scene.background = new THREE.Color(bgHex);
    this.scene.fog = new THREE.Fog(bgHex, 6.5, 16);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envPmremTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envPmremTexture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 30);
    const preset = CAMERA_PRESETS.find((c) => c.id === options.cameraPreset) ?? CAMERA_PRESETS[0];
    this.camera.position.set(...preset.position);
    this.desiredCamPos.set(...preset.position);
    this.desiredCamLook.set(...preset.target);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = options.interactive;
    this.controls.target.set(...preset.target);
    this.controls.enablePan = false;
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.15;
    this.controls.maxDistance = 5.4;
    this.controls.minPolarAngle = 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.51;
    this.controls.addEventListener('start', () => {
      this.cameraTransitionActive = false;
    });
    this.controls.update();

    // 3-Point Studio Lighting Rig
    const hemi = new THREE.HemisphereLight('#fff8eb', '#756f5f', 1.45);
    this.scene.add(hemi);

    this.keyLight = new THREE.DirectionalLight('#fff2dc', 2.45);
    this.keyLight.position.set(-2.4, 4.2, 3.4);
    this.keyLight.castShadow = !this.isSoftwareGl && options.quality !== 'low';
    this.keyLight.shadow.mapSize.setScalar(options.quality === 'high' ? 1024 : 512);
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 12;
    this.keyLight.shadow.camera.left = -2.2;
    this.keyLight.shadow.camera.right = 2.2;
    this.keyLight.shadow.camera.top = 2.6;
    this.keyLight.shadow.camera.bottom = -0.5;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    const fillLight = new THREE.DirectionalLight('#dfe6ee', 0.85);
    fillLight.position.set(2.8, 2.0, 2.2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#d7dec9', 1.15);
    rimLight.position.set(2.2, 2.8, -3.2);
    this.scene.add(rimLight);

    const anisotropy = this.getMaxAnisotropy();
    this.envHandle = createPreviewEnvironments(anisotropy);
    this.envHandle.setEnvironment(options.environment);
    this.scene.add(this.envHandle.group);

    this.animController = new AvatarAnimationController();
    this.animController.setIdleBreathing(initialConfig.animationPreferences.idleBreathing);
    this.animController.playAnimation(initialConfig.animationPreferences.defaultPose);

    this.mountInitialCharacter(initialConfig);

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    this.lastTime = performance.now();
    this.startLoop();
  }

  private getMaxAnisotropy(): number {
    if (this.quality === 'low' || this.isSoftwareGl) return 1;
    if (this.quality === 'medium') return Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    return this.renderer.capabilities.getMaxAnisotropy();
  }

  private applyQualitySettings(preset: GraphicsPreset) {
    this.quality = preset;
    const pixelRatioCap = preset === 'low' ? 1 : preset === 'medium' ? 1.5 : 2;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, pixelRatioCap),
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl && preset !== 'low';
    if (this.keyLight) {
      this.keyLight.castShadow = !this.isSoftwareGl && preset !== 'low';
    }
  }

  private mountInitialCharacter(config: AvatarConfigV3) {
    const configuredGlb = AVATAR_MODEL_MANIFEST[0];
    if (!configuredGlb) {
      this.mountProceduralCharacter(config);
      return;
    }

    this.callbacks.onStatusChange?.('loading', '0%');
    loadGlbAvatarAsset(configuredGlb, (ratio) => {
      if (!this.disposed) {
        this.callbacks.onStatusChange?.('loading', `${Math.round(ratio * 100)}%`);
      }
    })
      .then((entry) => {
        if (this.disposed) return;
        this.glbCharacterRoot = entry.scene;
        applyConfigToLoadedGlb(entry.scene, this.currentConfig);
        this.scene.add(entry.scene);
        this.animController.attachGlbModel(entry.scene, entry.animations);
        this.callbacks.onCapabilitiesChange?.(entry.capabilities);
        this.callbacks.onStatusChange?.(
          entry.capabilities.hasSkeletonRig ? 'glb-ready' : 'error',
          entry.capabilities.statusDetails,
        );
      })
      .catch((error: unknown) => {
        if (this.disposed) return;
        const msg = error instanceof Error ? error.message : 'Unable to load configured GLB';
        this.callbacks.onStatusChange?.('error', msg);
        this.mountProceduralCharacter(this.currentConfig);
      });
  }

  private mountProceduralCharacter(config: AvatarConfigV3) {
    if (this.proceduralCharacter) {
      this.scene.remove(this.proceduralCharacter.rig.root);
      this.proceduralCharacter.dispose();
    }
    this.proceduralCharacter = new ModularCharacterInstance(config, this.getMaxAnisotropy());
    this.scene.add(this.proceduralCharacter.rig.root);
    this.animController.attachProceduralRig(this.proceduralCharacter.rig);
    this.callbacks.onCapabilitiesChange?.(this.proceduralCharacter.capabilities);
    this.callbacks.onStatusChange?.('procedural', this.proceduralCharacter.capabilities.statusDetails);
  }

  updateConfig(nextConfig: AvatarConfigV3) {
    this.currentConfig = nextConfig;
    this.animController.setIdleBreathing(nextConfig.animationPreferences.idleBreathing);
    if (this.glbCharacterRoot) {
      applyConfigToLoadedGlb(this.glbCharacterRoot, nextConfig);
    } else if (this.proceduralCharacter) {
      this.proceduralCharacter.updateConfig(nextConfig);
      this.callbacks.onCapabilitiesChange?.(this.proceduralCharacter.capabilities);
    }
  }

  setAnimation(animationId: AvatarAnimationId) {
    this.animController.playAnimation(animationId);
  }

  setEnvironment(envId: PreviewEnvironmentId) {
    this.envHandle.setEnvironment(envId);
    const bgHex = PREVIEW_ENVIRONMENTS.find((e) => e.id === envId)?.backgroundHex ?? '#e7e0d3';
    this.scene.background = new THREE.Color(bgHex);
    this.scene.fog = new THREE.Fog(bgHex, 6.5, 16);
  }

  setCameraPreset(presetId: CameraPresetId) {
    const preset = CAMERA_PRESETS.find((c) => c.id === presetId) ?? CAMERA_PRESETS[0];
    this.desiredCamPos.set(...preset.position);
    this.desiredCamLook.set(...preset.target);
    this.cameraTransitionActive = true;
  }

  setQuality(quality: GraphicsPreset) {
    this.applyQualitySettings(quality);
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  setCallbacks(callbacks: AvatarViewportCallbacks) {
    this.callbacks = callbacks;
  }

  private handleResize() {
    if (this.disposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.stopLoop();
    this.callbacks.onWebGLError?.();
  };

  private handleContextRestored = () => {
    if (!this.disposed) {
      this.startLoop();
    }
  };

  private startLoop() {
    this.stopLoop();
    const tick = () => {
      if (this.disposed) return;
      const now = performance.now();
      const delta = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      if (this.cameraTransitionActive) {
        const lambda = this.reducedMotion ? 30 : 8.5;
        _camTargetPos.set(
          THREE.MathUtils.damp(this.camera.position.x, this.desiredCamPos.x, lambda, delta || 0.016),
          THREE.MathUtils.damp(this.camera.position.y, this.desiredCamPos.y, lambda, delta || 0.016),
          THREE.MathUtils.damp(this.camera.position.z, this.desiredCamPos.z, lambda, delta || 0.016),
        );
        _camTargetLook.set(
          THREE.MathUtils.damp(this.controls.target.x, this.desiredCamLook.x, lambda, delta || 0.016),
          THREE.MathUtils.damp(this.controls.target.y, this.desiredCamLook.y, lambda, delta || 0.016),
          THREE.MathUtils.damp(this.controls.target.z, this.desiredCamLook.z, lambda, delta || 0.016),
        );
        this.camera.position.copy(_camTargetPos);
        this.controls.target.copy(_camTargetLook);
        if (
          this.camera.position.distanceTo(this.desiredCamPos) < 0.01 &&
          this.controls.target.distanceTo(this.desiredCamLook) < 0.01
        ) {
          this.camera.position.copy(this.desiredCamPos);
          this.controls.target.copy(this.desiredCamLook);
          this.cameraTransitionActive = false;
        }
      }

      this.controls.update();
      this.animController.update(delta, this.reducedMotion);
      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        this.scheduleAfterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      this.frameId = requestAnimationFrame(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private scheduleAfterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    if (typeof gl.fenceSync !== 'function') {
      this.frameId = window.setTimeout(cb, 80);
      return;
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private stopLoop() {
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
  }

  dispose() {
    this.disposed = true;
    this.stopLoop();
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.animController.disposeMixer();
    this.proceduralCharacter?.dispose();
    this.envHandle.dispose();
    this.envPmremTexture.dispose();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.handleContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.handleContextRestored);
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
