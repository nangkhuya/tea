import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_AVATAR_CONFIG } from '../../../config/constants';
import { LocalAvatarService } from '../../../services/demoAdapters';
import {
  migrateAvatarConfig,
  randomizeAvatarConfig,
  validateAvatarConfig,
} from './avatarValidation';

test('validateAvatarConfig accepts default v3 config and rejects unknown asset paths or out-of-range dimensions', () => {
  const ok = validateAvatarConfig(DEFAULT_AVATAR_CONFIG);
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, []);

  const invalid = validateAvatarConfig({
    ...DEFAULT_AVATAR_CONFIG,
    characterId: '../../malicious.glb',
    hairstyle: 'non-existent-hair',
    body: { ...DEFAULT_AVATAR_CONFIG.body, heightScale: 2.5, shoulderWidth: 0.4 },
    accessories: ['unknown-item'],
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 4);
  assert.equal(invalid.sanitized.body.heightScale, 1.1);
  assert.equal(invalid.sanitized.body.shoulderWidth, 0.92);
  assert.deepEqual(invalid.sanitized.accessories, []);
});

test('migrateAvatarConfig upgrades legacy Phase 01/02 v2 avatar configurations cleanly', () => {
  const legacyV2 = {
    schemaVersion: 2,
    characterId: 'demo-avatar-001',
    appearance: {
      presentation: 'feminine',
      skinTone: 'porcelain',
      facePreset: 'defined',
    },
    body: {
      heightScale: 0.97,
      posture: 'relaxed-tea',
    },
    hairstyle: 'pinned-classic',
    hairColor: 'espresso',
    clothing: 'hanfu-scholar',
    accessories: ['wooden-hairpin', 'tea-beads'],
    colors: {
      primary: 'muted-indigo',
      accent: 'warm-ivory',
    },
    updatedAt: '2026-11-22T01:00:00.000Z',
  };

  const migrated = migrateAvatarConfig(legacyV2);
  assert.equal(migrated.schemaVersion, 3);
  assert.equal(migrated.genderPresentation, 'feminine');
  assert.equal(migrated.skin.tone, 'porcelain');
  assert.equal(migrated.face.faceShape, 'defined');
  assert.equal(migrated.hairstyle, 'traditional-bun');
  assert.equal(migrated.hairColor, 'dark-brown');
  assert.equal(migrated.clothing.style, 'scholar-robe');
  assert.equal(migrated.clothingColors.primary, 'indigo');
  assert.equal(migrated.clothingColors.secondary, 'ivory');
  assert.deepEqual(migrated.accessories, ['wooden-hairpin', 'wooden-bracelet']);
});

test('randomizeAvatarConfig generates deterministic valid coherent configurations', () => {
  let seed = 0.25;
  const pseudoRng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 12; i += 1) {
    const generated = randomizeAvatarConfig(pseudoRng);
    const check = validateAvatarConfig(generated);
    assert.equal(check.valid, true, check.errors.join('; '));
  }
});

test('LocalAvatarService saves, reloads, resets, and enforces ownership verification', async () => {
  const service = new LocalAvatarService();
  const custom = {
    ...DEFAULT_AVATAR_CONFIG,
    genderPresentation: 'masculine' as const,
    characterId: 'zen-humanoid-masculine',
    hairstyle: 'traditional-topknot' as const,
  };

  const saved = await service.saveAvatar('user-tea-1', custom, 'user-tea-1');
  assert.equal(saved.hairstyle, 'traditional-topknot');

  const reloaded = await service.getAvatar('user-tea-1');
  assert.equal(reloaded.hairstyle, 'traditional-topknot');
  assert.equal(reloaded.genderPresentation, 'masculine');

  await assert.rejects(
    () => service.saveAvatar('user-tea-1', custom, 'other-user-2'),
    /Ownership verification failed/,
  );

  const reset = await service.resetAvatar('user-tea-1', 'user-tea-1');
  assert.equal(reset.hairstyle, DEFAULT_AVATAR_CONFIG.hairstyle);
});
