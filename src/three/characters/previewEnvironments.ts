import * as THREE from 'three';
import type { PreviewEnvironmentId } from '../../features/avatar/types/avatarTypes';
import {
  getContactShadowTexture,
  getTatamiWeaveTexture,
  getWoodGrainTexture,
} from '../materials/fabricTextures';

export interface PreviewEnvironmentHandle {
  group: THREE.Group;
  setEnvironment: (envId: PreviewEnvironmentId) => void;
  dispose: () => void;
}

export function createPreviewEnvironments(anisotropy = 4): PreviewEnvironmentHandle {
  const root = new THREE.Group();
  root.name = 'PreviewEnvironments';

  const woodTex = getWoodGrainTexture(anisotropy);
  const tatamiTex = getTatamiWeaveTexture(anisotropy);
  const contactTex = getContactShadowTexture();

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackMat = <T extends THREE.Material>(m: T) => {
    materialsToDispose.push(m);
    return m;
  };
  const trackGeo = <T extends THREE.BufferGeometry>(g: T) => {
    geometriesToDispose.push(g);
    return g;
  };

  // Shared soft contact shadow disc grounded at y = 0.006
  const shadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  const shadowDisc = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(0.68, 32)), shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.006;
  root.add(shadowDisc);

  // 1. Neutral Studio
  const studioGroup = new THREE.Group();
  const studioFloorMat = trackMat(
    new THREE.MeshStandardMaterial({ color: '#ddd5c6', roughness: 0.92, metalness: 0.0 }),
  );
  const studioFloor = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(6, 48)), studioFloorMat);
  studioFloor.rotation.x = -Math.PI / 2;
  studioFloor.position.y = -0.02;
  studioFloor.receiveShadow = true;
  studioGroup.add(studioFloor);

  const plinthMat = trackMat(
    new THREE.MeshStandardMaterial({ color: '#cfc5b2', roughness: 0.86, metalness: 0.02 }),
  );
  const plinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.95, 1.0, 0.02, 48)), plinthMat);
  plinth.position.y = -0.01;
  plinth.receiveShadow = true;
  studioGroup.add(plinth);
  root.add(studioGroup);

  // 2. Japanese Interior (Tatami + Cedar + Shoji Lattice)
  const jpGroup = new THREE.Group();
  const jpFloorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: woodTex,
      roughness: 0.82,
      metalness: 0.02,
    }),
  );
  const jpFloor = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(10, 10)), jpFloorMat);
  jpFloor.rotation.x = -Math.PI / 2;
  jpFloor.position.y = -0.025;
  jpFloor.receiveShadow = true;
  jpGroup.add(jpFloor);

  const tatamiMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map: tatamiTex,
      roughness: 0.9,
      metalness: 0.0,
    }),
  );
  const tatami = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.4, 0.025, 2.4)), tatamiMat);
  tatami.position.y = -0.0125;
  tatami.receiveShadow = true;
  jpGroup.add(tatami);

  const tatamiBorderMat = trackMat(
    new THREE.MeshStandardMaterial({ color: '#465042', roughness: 0.88 }),
  );
  const tatamiTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.44, 0.022, 2.44)), tatamiBorderMat);
  tatamiTrim.position.y = -0.014;
  jpGroup.add(tatamiTrim);

  // Shoji screen backdrop
  const shojiPaperMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: '#f2eadc',
      emissive: '#f5ebd8',
      emissiveIntensity: 0.16,
      roughness: 0.95,
    }),
  );
  const shojiScreen = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(4.4, 2.7)), shojiPaperMat);
  shojiScreen.position.set(0, 1.33, -1.85);
  jpGroup.add(shojiScreen);

  const cedarMat = trackMat(new THREE.MeshStandardMaterial({ color: '#6b4d37', roughness: 0.78 }));
  for (let x = -2.2; x <= 2.21; x += 0.55) {
    const bar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.032, 2.72, 0.03)), cedarMat);
    bar.position.set(x, 1.33, -1.83);
    jpGroup.add(bar);
  }
  for (let y = 0.25; y <= 2.55; y += 0.55) {
    const bar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.44, 0.026, 0.03)), cedarMat);
    bar.position.set(0, y, -1.83);
    jpGroup.add(bar);
  }
  root.add(jpGroup);

  // 3. ZEN TEA HOUSE Pavilion Preview
  const teaGroup = new THREE.Group();
  const deck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.6, 0.04, 5.6)), jpFloorMat);
  deck.position.y = -0.02;
  deck.receiveShadow = true;
  teaGroup.add(deck);

  // Low tea table (Chabudai) beside character
  const tableMat = trackMat(new THREE.MeshStandardMaterial({ color: '#583f2c', roughness: 0.62 }));
  const tableTop = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.032, 28)), tableMat);
  tableTop.position.set(-0.92, 0.28, 0.18);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  teaGroup.add(tableTop);

  for (let i = 0; i < 4; i += 1) {
    const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const leg = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.02, 0.016, 0.27, 10)), tableMat);
    leg.position.set(-0.92 + Math.cos(ang) * 0.28, 0.135, 0.18 + Math.sin(ang) * 0.28);
    leg.castShadow = true;
    teaGroup.add(leg);
  }

  // Ceramic teapot & cup on table
  const clayMat = trackMat(new THREE.MeshStandardMaterial({ color: '#7a4d3b', roughness: 0.48 }));
  const teapot = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.068, 16, 14)), clayMat);
  teapot.position.set(-0.92, 0.34, 0.18);
  teapot.scale.set(1.1, 0.85, 1.1);
  teapot.castShadow = true;
  teaGroup.add(teapot);

  const cupMat = trackMat(new THREE.MeshStandardMaterial({ color: '#e9e2d3', roughness: 0.35 }));
  const tableCup = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.028, 0.02, 0.042, 16)), cupMat);
  tableCup.position.set(-0.76, 0.317, 0.27);
  teaGroup.add(tableCup);

  // Bamboo stems behind veranda
  const bambooMat = trackMat(new THREE.MeshStandardMaterial({ color: '#6b7556', roughness: 0.62 }));
  const bambooPositions = [-1.6, -1.25, -0.8, 0.95, 1.35, 1.75];
  bambooPositions.forEach((bx, idx) => {
    const stalk = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.026, 0.032, 3.0, 12)),
      bambooMat,
    );
    stalk.position.set(bx, 1.48, -1.75 - (idx % 2) * 0.25);
    stalk.rotation.z = ((idx % 3) - 1) * 0.03;
    teaGroup.add(stalk);
  });

  root.add(teaGroup);

  const setEnvironment = (envId: PreviewEnvironmentId) => {
    studioGroup.visible = envId === 'neutral-studio';
    jpGroup.visible = envId === 'japanese-interior';
    teaGroup.visible = envId === 'tea-pavilion';
  };

  setEnvironment('neutral-studio');

  return {
    group: root,
    setEnvironment,
    dispose: () => {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
    },
  };
}
