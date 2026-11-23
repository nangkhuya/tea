import { create } from 'zustand';
import { DEMO_TEA_ROOMS } from '../data/demoData';
import { services } from '../services/serviceRegistry';
import type { CreateRoomInput, RoomFilterCriteria, TeaRoom } from '../types/domain';

interface RoomState {
  rooms: TeaRoom[];
  selectedRoomId: string | null;
  filter: RoomFilterCriteria;
  loading: boolean;
  error: string | null;
  hydrateRooms: () => Promise<void>;
  refreshRooms: (simulateError?: boolean) => Promise<void>;
  setFilter: (patch: Partial<RoomFilterCriteria>) => void;
  resetFilter: () => void;
  selectRoom: (roomId: string | null) => void;
  createDemoRoom: (input: CreateRoomInput, hostName: string) => Promise<TeaRoom | null>;
  resetDemoRooms: () => Promise<void>;
}

const DEFAULT_FILTER: RoomFilterCriteria = {
  query: '',
  visibility: 'all',
  sortBy: 'featured',
};

export const useRoomStore = create<RoomState>((set) => ({
  rooms: DEMO_TEA_ROOMS,
  selectedRoomId: null,
  filter: DEFAULT_FILTER,
  loading: false,
  error: null,
  hydrateRooms: async () => {
    set({ loading: true, error: null });
    try {
      const rooms = await services.teaRoomService.listRooms();
      set({ rooms, loading: false });
    } catch {
      set({ loading: false, error: 'Không thể tải danh sách phòng trà.' });
    }
  },
  refreshRooms: async (simulateError = false) => {
    set({ loading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 260));
    if (simulateError) {
      set({
        loading: false,
        error: 'Kết nối tạm thời bị gián đoạn khi đồng bộ danh sách phòng trà mẫu.',
      });
      return;
    }
    try {
      const rooms = await services.teaRoomService.listRooms();
      set({ rooms, loading: false });
    } catch {
      set({ loading: false, error: 'Không thể làm mới danh sách phòng trà.' });
    }
  },
  setFilter: (patch) =>
    set((state) => ({
      filter: { ...state.filter, ...patch },
    })),
  resetFilter: () => set({ filter: DEFAULT_FILTER }),
  selectRoom: (selectedRoomId) => set({ selectedRoomId }),
  createDemoRoom: async (input, hostName) => {
    set({ loading: true, error: null });
    try {
      const created = await services.teaRoomService.createRoom(input, hostName);
      const rooms = await services.teaRoomService.listRooms();
      set({ rooms, selectedRoomId: created.id, loading: false });
      return created;
    } catch {
      set({ loading: false, error: 'Không thể khởi tạo phòng trà mới.' });
      return null;
    }
  },
  resetDemoRooms: async () => {
    const rooms = await services.teaRoomService.resetDemoRooms();
    set({ rooms, selectedRoomId: null, error: null });
  },
}));
