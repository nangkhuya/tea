import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCESSORY_REGISTRY,
  ANIMATION_REGISTRY,
  BASE_CHARACTER_MODELS,
  CLOTHING_REGISTRY,
  HAIRSTYLE_REGISTRY,
  getHairstylesForPresentation,
} from './avatarRegistry';
import { AVATAR_PRESETS } from '../presets/avatarPresets';
import { validateAvatarConfig } from '../services/avatarValidation';

test('all 8 avatar presets use valid, available assets from the registry', () => {
  assert.equal(AVATAR_PRESETS.length, 8);
  for (const preset of AVATAR_PRESETS) {
    const result = validateAvatarConfig({
      schemaVersion: 3,
      updatedAt: '2026-11-22T00:00:00.000Z',
      ...preset.config,
    });
    assert.equal(result.valid, true, `Preset "${preset.id}" failed validation: ${result.errors.join(', ')}`);
  }
});

test('hairstyle compatibility filtering returns valid choices for every presentation', () => {
  for (const presentation of ['masculine', 'feminine', 'neutral'] as const) {
    const styles = getHairstylesForPresentation(presentation);
    assert.ok(styles.length >= 3, `Expected at least 3 hairstyles for ${presentation}`);
    assert.ok(styles.every((item) => item.compatiblePresentations.includes(presentation)));
  }
});

test('asset registries contain unique IDs and explicit availability metadata', () => {
  const groups = [BASE_CHARACTER_MODELS, HAIRSTYLE_REGISTRY, CLOTHING_REGISTRY, ACCESSORY_REGISTRY, ANIMATION_REGISTRY];
  for (const group of groups) {
    const ids = group.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const item of group) {
      assert.ok(item.displayNameVi.length > 0);
      assert.ok(item.displayNameEn.length > 0);
      assert.ok(item.availability === 'procedural-rig' || item.availability === 'glb-configured' || item.availability === 'requires-external-glb');
    }
  }
});
