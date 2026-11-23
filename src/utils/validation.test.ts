import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCreateRoomInput, validateProfileEditInput } from './validation';

test('validateCreateRoomInput rejects invalid room fields and accepts valid room', () => {
  const invalid = validateCreateRoomInput(
    {
      name: 'Ab',
      description: 'Quá ngắn',
      capacity: 20,
      visibility: 'public',
      environmentId: 'bamboo-courtyard',
      teaTradition: '',
    },
    'vi',
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.description);
  assert.ok(invalid.errors.capacity);
  assert.ok(invalid.errors.teaTradition);

  const valid = validateCreateRoomInput(
    {
      name: 'Hiên Trà Mai Vàng',
      description: 'Không gian tĩnh lặng nhìn ra sườn núi phủ sương buổi sáng.',
      capacity: 10,
      visibility: 'public',
      environmentId: 'bamboo-courtyard',
      teaTradition: 'Trà Shan Tuyết',
    },
    'vi',
  );
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('validateProfileEditInput enforces display name and bio bounds', () => {
  const invalid = validateProfileEditInput(
    {
      displayName: 'A',
      bio: 'x'.repeat(210),
      favoriteTea: 'Sencha',
    },
    'vi',
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.displayName);
  assert.ok(invalid.errors.bio);

  const valid = validateProfileEditInput(
    {
      displayName: 'Tĩnh Tâm',
      bio: 'Yêu thích trà đạo và sự yên tĩnh.',
      favoriteTea: 'Long Tỉnh',
    },
    'vi',
  );
  assert.equal(valid.valid, true);
});
