import * as THREE from 'three';
import type { AvatarAnimationId } from '../../features/avatar/types/avatarTypes';
import type { HumanoidJointName, HumanoidRig } from '../rigs/humanoidRig';
import { findGlbClipForAnimation } from '../loaders/avatarModelLoader';

type JointPoseMap = Partial<Record<HumanoidJointName, [number, number, number]>>;

interface ProceduralPoseSpec {
  hipOffsetY: number;
  hipOffsetZ?: number;
  joints: JointPoseMap;
  showTeaCup?: boolean;
}

const STATIC_POSES: Record<AvatarAnimationId, ProceduralPoseSpec> = {
  'idle-standing': {
    hipOffsetY: 0,
    joints: {
      spine: [0.02, 0, 0],
      chest: [-0.02, 0, 0],
      leftUpperArm: [0.04, 0, 0.11],
      leftForearm: [-0.14, 0, -0.05],
      rightUpperArm: [0.04, 0, -0.11],
      rightForearm: [-0.14, 0, 0.05],
    },
  },
  breathing: {
    hipOffsetY: 0,
    joints: {
      spine: [0.02, 0, 0],
      leftUpperArm: [0.05, 0, 0.12],
      leftForearm: [-0.16, 0, -0.04],
      rightUpperArm: [0.05, 0, -0.12],
      rightForearm: [-0.16, 0, 0.04],
    },
  },
  'relaxed-standing': {
    hipOffsetY: -0.01,
    joints: {
      hips: [0, 0.06, 0],
      spine: [0.03, -0.03, 0],
      head: [0.02, -0.04, 0],
      leftUpperArm: [-0.28, 0.16, 0.14],
      leftForearm: [-0.72, 0, -0.45],
      rightUpperArm: [-0.3, -0.18, -0.14],
      rightForearm: [-0.78, 0, 0.45],
      leftThigh: [-0.03, 0.06, 0.04],
      rightThigh: [0.04, -0.06, -0.03],
    },
  },
  walking: {
    hipOffsetY: 0,
    joints: {
      spine: [0.04, 0, 0],
    },
  },
  turning: {
    hipOffsetY: 0,
    joints: {
      spine: [0.02, 0, 0],
      leftUpperArm: [0.04, 0, 0.12],
      leftForearm: [-0.18, 0, -0.05],
      rightUpperArm: [0.04, 0, -0.12],
      rightForearm: [-0.18, 0, 0.05],
    },
  },
  'sitting-down': {
    hipOffsetY: -0.52,
    hipOffsetZ: -0.08,
    joints: {
      spine: [0.08, 0, 0],
      chest: [-0.04, 0, 0],
      leftThigh: [-1.32, 0.25, 0.16],
      leftShin: [1.58, 0, 0],
      rightThigh: [-1.32, -0.25, -0.16],
      rightShin: [1.58, 0, 0],
      leftUpperArm: [-0.24, 0.08, 0.12],
      leftForearm: [-0.72, 0, -0.25],
      rightUpperArm: [-0.24, -0.08, -0.12],
      rightForearm: [-0.72, 0, 0.25],
    },
  },
  'seated-idle': {
    hipOffsetY: -0.62,
    hipOffsetZ: -0.06,
    joints: {
      spine: [0.03, 0, 0],
      chest: [-0.02, 0, 0],
      leftThigh: [-1.38, 0.45, 0.24],
      leftShin: [1.85, 0, -0.35],
      rightThigh: [-1.38, -0.45, -0.24],
      rightShin: [1.85, 0, 0.35],
      leftUpperArm: [-0.18, 0.12, 0.13],
      leftForearm: [-0.85, 0, -0.32],
      rightUpperArm: [-0.18, -0.12, -0.13],
      rightForearm: [-0.85, 0, 0.32],
    },
  },
  'cross-legged': {
    hipOffsetY: -0.67,
    hipOffsetZ: -0.04,
    joints: {
      spine: [0.02, 0, 0],
      head: [0.04, 0, 0],
      leftThigh: [-1.46, 0.72, 0.35],
      leftShin: [2.05, 0, -0.55],
      rightThigh: [-1.46, -0.72, -0.35],
      rightShin: [2.05, 0, 0.55],
      leftUpperArm: [-0.14, 0.18, 0.15],
      leftForearm: [-0.96, 0, -0.42],
      rightUpperArm: [-0.14, -0.18, -0.15],
      rightForearm: [-0.96, 0, 0.42],
    },
  },
  'kneeling-seiza': {
    hipOffsetY: -0.58,
    hipOffsetZ: 0.08,
    joints: {
      spine: [0.02, 0, 0],
      leftThigh: [-1.42, 0, 0.03],
      leftShin: [2.52, 0, 0],
      leftFoot: [0.65, 0, 0],
      rightThigh: [-1.42, 0, -0.03],
      rightShin: [2.52, 0, 0],
      rightFoot: [0.65, 0, 0],
      leftUpperArm: [-0.15, 0.1, 0.1],
      leftForearm: [-0.82, 0, -0.25],
      rightUpperArm: [-0.15, -0.1, -0.1],
      rightForearm: [-0.82, 0, 0.25],
    },
  },
  'holding-cup': {
    hipOffsetY: 0,
    showTeaCup: true,
    joints: {
      spine: [0.03, 0, 0],
      head: [0.08, 0, 0],
      leftUpperArm: [-0.42, 0.24, 0.12],
      leftForearm: [-1.18, 0, -0.54],
      rightUpperArm: [-0.46, -0.22, -0.12],
      rightForearm: [-1.24, 0, 0.5],
    },
  },
  'lifting-cup': {
    hipOffsetY: 0,
    showTeaCup: true,
    joints: {
      spine: [0.02, 0, 0],
      head: [0.05, 0, 0],
      leftUpperArm: [-0.36, 0.22, 0.12],
      leftForearm: [-1.05, 0, -0.45],
      rightUpperArm: [-0.74, -0.24, -0.1],
      rightForearm: [-1.38, 0, 0.48],
    },
  },
  'drinking-tea': {
    hipOffsetY: 0,
    showTeaCup: true,
    joints: {
      spine: [0.04, 0, 0],
      neck: [0.08, 0, 0],
      head: [0.14, 0, 0],
      leftUpperArm: [-0.3, 0.18, 0.12],
      leftForearm: [-0.95, 0, -0.4],
      rightUpperArm: [-0.94, -0.26, -0.08],
      rightForearm: [-1.62, 0, 0.46],
    },
  },
  'placing-cup': {
    hipOffsetY: -0.58,
    hipOffsetZ: 0.06,
    showTeaCup: true,
    joints: {
      spine: [0.16, 0, 0],
      head: [0.12, 0, 0],
      leftThigh: [-1.4, 0, 0.04],
      leftShin: [2.45, 0, 0],
      rightThigh: [-1.4, 0, -0.04],
      rightShin: [2.45, 0, 0],
      leftUpperArm: [-0.28, 0.1, 0.12],
      leftForearm: [-0.88, 0, -0.22],
      rightUpperArm: [-0.76, -0.1, -0.08],
      rightForearm: [-0.42, 0, 0.14],
    },
  },
  greeting: {
    hipOffsetY: 0,
    joints: {
      spine: [0.22, 0, 0],
      chest: [0.14, 0, 0],
      neck: [0.08, 0, 0],
      head: [0.08, 0, 0],
      leftUpperArm: [-0.44, 0.24, 0.14],
      leftForearm: [-1.18, 0, -0.58],
      rightUpperArm: [-0.44, -0.24, -0.14],
      rightForearm: [-1.18, 0, 0.58],
    },
  },
  'looking-scenery': {
    hipOffsetY: 0,
    joints: {
      spine: [0.02, 0.08, 0],
      neck: [-0.02, 0.14, 0],
      head: [-0.06, 0.28, 0.04],
      leftUpperArm: [-0.14, 0.1, 0.12],
      leftForearm: [-0.46, 0, -0.28],
      rightUpperArm: [-0.26, -0.14, -0.12],
      rightForearm: [-0.74, 0, 0.34],
    },
  },
};

export class AvatarAnimationController {
  private rig: HumanoidRig | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private activeAction: THREE.AnimationAction | null = null;
  private glbClips: THREE.AnimationClip[] = [];
  private activeAnimation: AvatarAnimationId = 'idle-standing';
  private breathingEnabled = true;
  private elapsed = 0;

  attachProceduralRig(rig: HumanoidRig) {
    this.disposeMixer();
    this.rig = rig;
  }

  attachGlbModel(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.rig = null;
    this.disposeMixer();
    this.glbClips = clips;
    this.mixer = new THREE.AnimationMixer(root);
    this.playAnimation(this.activeAnimation);
  }

  setIdleBreathing(enabled: boolean) {
    this.breathingEnabled = enabled;
  }

  playAnimation(animationId: AvatarAnimationId) {
    this.activeAnimation = animationId;

    if (this.mixer && this.glbClips.length > 0) {
      const clip = findGlbClipForAnimation(this.glbClips, animationId);
      if (!clip) return;
      const next = this.mixer.clipAction(clip);
      next.reset();
      next.play();
      if (this.activeAction && this.activeAction !== next) {
        this.activeAction.crossFadeTo(next, 0.35, true);
      }
      this.activeAction = next;
    }
  }

  update(delta: number, isReducedMotion = false) {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    this.elapsed += isReducedMotion ? 0 : dt;

    if (this.mixer) {
      this.mixer.update(dt);
      return;
    }

    if (!this.rig) return;

    const spec = STATIC_POSES[this.activeAnimation] ?? STATIC_POSES['idle-standing'];
    const dampLambda = isReducedMotion ? 24 : 7.5;
    const t = this.elapsed;

    // Tea cup visibility
    this.rig.slots.rightHandProp.visible = Boolean(spec.showTeaCup);

    // Smooth hip vertical grounding
    const hipBase = this.rig.restPositions.hips;
    let targetHipY = hipBase.y + spec.hipOffsetY;
    const targetHipZ = hipBase.z + (spec.hipOffsetZ ?? 0);

    if (this.activeAnimation === 'walking' && !isReducedMotion) {
      targetHipY += Math.abs(Math.sin(t * 2.6)) * 0.025;
    }

    this.rig.joints.hips.position.y = THREE.MathUtils.damp(
      this.rig.joints.hips.position.y,
      targetHipY,
      dampLambda,
      dt || 0.016,
    );
    this.rig.joints.hips.position.z = THREE.MathUtils.damp(
      this.rig.joints.hips.position.z,
      targetHipZ,
      dampLambda,
      dt || 0.016,
    );

    const jointNames = Object.keys(this.rig.joints) as HumanoidJointName[];
    for (const jointName of jointNames) {
      if (jointName === 'root') continue;
      const joint = this.rig.joints[jointName];
      const baseEuler = spec.joints[jointName] ?? [0, 0, 0];
      let tx = baseEuler[0];
      let ty = baseEuler[1];
      let tz = baseEuler[2];

      // Subtle breathing & organic living motion
      if (this.breathingEnabled && !isReducedMotion) {
        const breathWave = Math.sin(t * 1.45);
        const slowSway = Math.sin(t * 0.7);
        if (jointName === 'chest') {
          tx += breathWave * 0.018;
        } else if (jointName === 'head' && this.activeAnimation !== 'drinking-tea') {
          ty += slowSway * 0.035;
          tx += breathWave * 0.012;
        } else if (jointName === 'leftShoulder' || jointName === 'rightShoulder') {
          tz += breathWave * (jointName === 'leftShoulder' ? -0.012 : 0.012);
        }
      }

      // Dynamic cycles for specific animation states
      if (!isReducedMotion) {
        if (this.activeAnimation === 'walking') {
          const phase = t * 2.6;
          const swing = Math.sin(phase);
          if (jointName === 'leftThigh') tx = swing * 0.42;
          if (jointName === 'rightThigh') tx = -swing * 0.42;
          if (jointName === 'leftShin') tx = Math.max(0, -swing) * 0.55 + 0.08;
          if (jointName === 'rightShin') tx = Math.max(0, swing) * 0.55 + 0.08;
          if (jointName === 'leftUpperArm') {
            tx = -swing * 0.28;
            tz = 0.1;
          }
          if (jointName === 'rightUpperArm') {
            tx = swing * 0.28;
            tz = -0.1;
          }
          if (jointName === 'leftForearm') tx = -0.25;
          if (jointName === 'rightForearm') tx = -0.25;
        } else if (this.activeAnimation === 'turning') {
          const turnWave = Math.sin(t * 0.9);
          if (jointName === 'hips') ty = turnWave * 0.65;
          if (jointName === 'spine') ty = turnWave * 0.2;
          if (jointName === 'head') ty = turnWave * 0.22;
        } else if (this.activeAnimation === 'sitting-down') {
          const sitCycle = (Math.sin(t * 1.1) + 1) * 0.5;
          if (jointName === 'hips') {
            this.rig.joints.hips.position.y = THREE.MathUtils.damp(
              this.rig.joints.hips.position.y,
              hipBase.y - 0.58 * sitCycle,
              dampLambda,
              dt || 0.016,
            );
          }
        } else if (this.activeAnimation === 'lifting-cup') {
          const liftWave = (Math.sin(t * 1.2) + 1) * 0.5;
          if (jointName === 'rightUpperArm') tx = THREE.MathUtils.lerp(-0.46, -0.82, liftWave);
          if (jointName === 'rightForearm') tx = THREE.MathUtils.lerp(-1.2, -1.48, liftWave);
        } else if (this.activeAnimation === 'greeting') {
          const bowWave = (Math.sin(t * 1.15) + 1) * 0.5;
          if (jointName === 'spine') tx = bowWave * 0.24;
          if (jointName === 'chest') tx = bowWave * 0.14;
          if (jointName === 'head') tx = bowWave * 0.1;
        }
      }

      joint.rotation.x = THREE.MathUtils.damp(joint.rotation.x, tx, dampLambda, dt || 0.016);
      joint.rotation.y = THREE.MathUtils.damp(joint.rotation.y, ty, dampLambda, dt || 0.016);
      joint.rotation.z = THREE.MathUtils.damp(joint.rotation.z, tz, dampLambda, dt || 0.016);
    }
  }

  disposeMixer() {
    if (this.activeAction) {
      this.activeAction.stop();
      this.activeAction = null;
    }
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer = null;
    }
    this.glbClips = [];
  }
}
