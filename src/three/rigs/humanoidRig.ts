import * as THREE from 'three';

export type HumanoidJointName =
  | 'root'
  | 'hips'
  | 'spine'
  | 'chest'
  | 'neck'
  | 'head'
  | 'leftShoulder'
  | 'leftUpperArm'
  | 'leftForearm'
  | 'leftHand'
  | 'rightShoulder'
  | 'rightUpperArm'
  | 'rightForearm'
  | 'rightHand'
  | 'leftThigh'
  | 'leftShin'
  | 'leftFoot'
  | 'rightThigh'
  | 'rightShin'
  | 'rightFoot';

export interface HumanoidRig {
  root: THREE.Group;
  joints: Record<HumanoidJointName, THREE.Group>;
  restPositions: Record<HumanoidJointName, THREE.Vector3>;
  slots: {
    bodyRoot: THREE.Group;
    headFeature: THREE.Group;
    hair: THREE.Group;
    headAccessory: THREE.Group;
    torsoGarment: THREE.Group;
    hipsGarment: THREE.Group;
    leftUpperSleeve: THREE.Group;
    leftForeSleeve: THREE.Group;
    rightUpperSleeve: THREE.Group;
    rightForeSleeve: THREE.Group;
    leftThighGarment: THREE.Group;
    leftShinGarment: THREE.Group;
    rightThighGarment: THREE.Group;
    rightShinGarment: THREE.Group;
    leftFoot: THREE.Group;
    rightFoot: THREE.Group;
    rightWristAccessory: THREE.Group;
    rightHandProp: THREE.Group;
    waistAccessory: THREE.Group;
  };
}

export function createHumanoidRig(shoulderHalfSpan = 0.175): HumanoidRig {
  const root = new THREE.Group();
  root.name = 'ZenHumanoidRig';

  const makeJoint = (name: HumanoidJointName, x: number, y: number, z: number) => {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(x, y, z);
    return g;
  };

  const hips = makeJoint('hips', 0, 0.92, 0);
  const spine = makeJoint('spine', 0, 0.12, 0);
  const chest = makeJoint('chest', 0, 0.24, 0);
  const neck = makeJoint('neck', 0, 0.17, 0);
  const head = makeJoint('head', 0, 0.11, 0.01);

  const leftShoulder = makeJoint('leftShoulder', -0.06, 0.13, 0);
  const leftUpperArm = makeJoint('leftUpperArm', -(shoulderHalfSpan - 0.06), -0.01, 0);
  const leftForearm = makeJoint('leftForearm', 0, -0.27, 0);
  const leftHand = makeJoint('leftHand', 0, -0.24, 0);

  const rightShoulder = makeJoint('rightShoulder', 0.06, 0.13, 0);
  const rightUpperArm = makeJoint('rightUpperArm', shoulderHalfSpan - 0.06, -0.01, 0);
  const rightForearm = makeJoint('rightForearm', 0, -0.27, 0);
  const rightHand = makeJoint('rightHand', 0, -0.24, 0);

  const leftThigh = makeJoint('leftThigh', -0.095, -0.03, 0);
  const leftShin = makeJoint('leftShin', 0, -0.43, 0);
  const leftFoot = makeJoint('leftFoot', 0, -0.4, 0);

  const rightThigh = makeJoint('rightThigh', 0.095, -0.03, 0);
  const rightShin = makeJoint('rightShin', 0, -0.43, 0);
  const rightFoot = makeJoint('rightFoot', 0, -0.4, 0);

  root.add(hips);
  hips.add(spine);
  spine.add(chest);
  chest.add(neck);
  neck.add(head);

  chest.add(leftShoulder);
  leftShoulder.add(leftUpperArm);
  leftUpperArm.add(leftForearm);
  leftForearm.add(leftHand);

  chest.add(rightShoulder);
  rightShoulder.add(rightUpperArm);
  rightUpperArm.add(rightForearm);
  rightForearm.add(rightHand);

  hips.add(leftThigh);
  leftThigh.add(leftShin);
  leftShin.add(leftFoot);

  hips.add(rightThigh);
  rightThigh.add(rightShin);
  rightShin.add(rightFoot);

  const makeSlot = (name: string, parent: THREE.Group) => {
    const g = new THREE.Group();
    g.name = `slot_${name}`;
    parent.add(g);
    return g;
  };

  const joints: Record<HumanoidJointName, THREE.Group> = {
    root,
    hips,
    spine,
    chest,
    neck,
    head,
    leftShoulder,
    leftUpperArm,
    leftForearm,
    leftHand,
    rightShoulder,
    rightUpperArm,
    rightForearm,
    rightHand,
    leftThigh,
    leftShin,
    leftFoot,
    rightThigh,
    rightShin,
    rightFoot,
  };

  const restPositions = {} as Record<HumanoidJointName, THREE.Vector3>;
  (Object.keys(joints) as HumanoidJointName[]).forEach((key) => {
    restPositions[key] = joints[key].position.clone();
  });

  return {
    root,
    joints,
    restPositions,
    slots: {
      bodyRoot: makeSlot('bodyRoot', hips),
      headFeature: makeSlot('headFeature', head),
      hair: makeSlot('hair', head),
      headAccessory: makeSlot('headAccessory', head),
      torsoGarment: makeSlot('torsoGarment', chest),
      hipsGarment: makeSlot('hipsGarment', hips),
      leftUpperSleeve: makeSlot('leftUpperSleeve', leftUpperArm),
      leftForeSleeve: makeSlot('leftForeSleeve', leftForearm),
      rightUpperSleeve: makeSlot('rightUpperSleeve', rightUpperArm),
      rightForeSleeve: makeSlot('rightForeSleeve', rightForearm),
      leftThighGarment: makeSlot('leftThighGarment', leftThigh),
      leftShinGarment: makeSlot('leftShinGarment', leftShin),
      rightThighGarment: makeSlot('rightThighGarment', rightThigh),
      rightShinGarment: makeSlot('rightShinGarment', rightShin),
      leftFoot: makeSlot('leftFoot', leftFoot),
      rightFoot: makeSlot('rightFoot', rightFoot),
      rightWristAccessory: makeSlot('rightWristAccessory', rightForearm),
      rightHandProp: makeSlot('rightHandProp', rightHand),
      waistAccessory: makeSlot('waistAccessory', hips),
    },
  };
}

export function disposeObjectSubtree(group: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) {
      geometries.add(mesh.geometry);
    }
  });
  geometries.forEach((g) => g.dispose());
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}
