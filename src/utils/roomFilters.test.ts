import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_TEA_ROOMS } from '../data/demoData';
import { clampRoomCapacity, evaluateRouteAccess, filterAndSortRooms, isRoomFull } from './roomFilters';

test('clampRoomCapacity enforces 2..12 room limits', () => {
  assert.equal(clampRoomCapacity(1), 2);
  assert.equal(clampRoomCapacity(12), 12);
  assert.equal(clampRoomCapacity(24), 12);
  assert.equal(clampRoomCapacity(Number.NaN), 8);
});

test('isRoomFull detects full rooms accurately', () => {
  assert.equal(isRoomFull({ occupancy: 8, capacity: 8, status: 'open' }), true);
  assert.equal(isRoomFull({ occupancy: 4, capacity: 10, status: 'full' }), true);
  assert.equal(isRoomFull({ occupancy: 4, capacity: 10, status: 'open' }), false);
});

test('filterAndSortRooms filters by visibility and Vietnamese query', () => {
  const privateRooms = filterAndSortRooms(DEMO_TEA_ROOMS, {
    query: '',
    visibility: 'private',
    sortBy: 'featured',
  });
  assert.equal(privateRooms.length, 1);
  assert.equal(privateRooms[0].id, 'demo-room-sanctuary');

  const oolongRooms = filterAndSortRooms(DEMO_TEA_ROOMS, {
    query: 'ô long',
    visibility: 'all',
    sortBy: 'featured',
  });
  assert.equal(oolongRooms.length, 1);
  assert.equal(oolongRooms[0].id, 'demo-room-literati');
});

test('filterAndSortRooms sorts by most open seats and alphabetical name', () => {
  const byOpenSeats = filterAndSortRooms(DEMO_TEA_ROOMS, {
    query: '',
    visibility: 'all',
    sortBy: 'occupancy-asc',
  });
  // demo-room-sanctuary has 12 - 2 = 10 open seats; demo-room-twilight has 0 open seats
  assert.equal(byOpenSeats[0].id, 'demo-room-sanctuary');
  assert.equal(byOpenSeats[byOpenSeats.length - 1].id, 'demo-room-twilight');

  const byName = filterAndSortRooms(DEMO_TEA_ROOMS, {
    query: '',
    visibility: 'all',
    sortBy: 'name-asc',
  });
  assert.equal(byName.length, DEMO_TEA_ROOMS.length);
});

test('evaluateRouteAccess keeps guest demo separate from real auth requirement', () => {
  const guestSession = {
    mode: 'guest-demo' as const,
    isAuthenticated: false,
    uid: 'demo-guest-001',
    provider: 'guest-demo' as const,
    hasEnteredSanctuary: true,
  };

  assert.equal(evaluateRouteAccess('/lobby', guestSession, false).allowed, true);
  assert.equal(evaluateRouteAccess('/tea-space/demo-room-bamboo', guestSession, false).allowed, true);
  assert.equal(evaluateRouteAccess('/profile', guestSession, true).allowed, false);
});
