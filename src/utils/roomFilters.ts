import { MAX_ROOM_CAPACITY } from '../config/constants';
import type { RoomFilterCriteria, RouteAccessDecision, TeaRoom, UserSession } from '../types/domain';

export function clampRoomCapacity(rawCapacity: number): number {
  if (!Number.isFinite(rawCapacity)) {
    return 8;
  }
  const rounded = Math.round(rawCapacity);
  return Math.max(2, Math.min(MAX_ROOM_CAPACITY, rounded));
}

export function isRoomFull(room: Pick<TeaRoom, 'occupancy' | 'capacity' | 'status'>): boolean {
  return room.status === 'full' || room.occupancy >= room.capacity;
}

export function filterAndSortRooms(rooms: TeaRoom[], criteria: RoomFilterCriteria): TeaRoom[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  const filtered = rooms.filter((room) => {
    if (criteria.visibility !== 'all' && room.visibility !== criteria.visibility) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return (
      room.name.toLowerCase().includes(normalizedQuery) ||
      room.description.toLowerCase().includes(normalizedQuery) ||
      room.teaTradition.toLowerCase().includes(normalizedQuery) ||
      room.environmentLabel.toLowerCase().includes(normalizedQuery)
    );
  });

  const sorted = [...filtered];
  if (criteria.sortBy === 'occupancy-asc') {
    sorted.sort((a, b) => {
      const openA = Math.max(0, a.capacity - a.occupancy);
      const openB = Math.max(0, b.capacity - b.occupancy);
      return openB - openA;
    });
  } else if (criteria.sortBy === 'name-asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }

  return sorted;
}

/**
 * Extensible route guard contract prepared for Phase 04 Authentication.
 * In Phase 01, Guest Demo sessions are permitted across exploration routes
 * without falsely claiming real authentication.
 */
export function evaluateRouteAccess(
  path: string,
  session: UserSession,
  requireRealAuth = false,
): RouteAccessDecision {
  if (requireRealAuth && !session.isAuthenticated) {
    return {
      allowed: false,
      reason: 'future-auth-placeholder',
      redirectTo: '/profile',
    };
  }
  if (path.startsWith('/tea-space') && !session.uid) {
    return {
      allowed: false,
      reason: 'requires-session',
      redirectTo: '/lobby',
    };
  }
  return { allowed: true };
}
