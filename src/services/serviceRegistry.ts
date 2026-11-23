import {
  DemoAuthService,
  LocalAvatarService,
  DemoTeaRoomService,
  DemoUserProfileService,
  LocalSettingsService,
} from './demoAdapters';
import type {
  IAuthService,
  IAvatarService,
  ISettingsService,
  ITeaRoomService,
  IUserProfileService,
} from './interfaces';

/**
 * Service Registry (Phase 01: Isolated Guest Demo Layer)
 *
 * In Phase 04 (Authentication & Persistence) and Phase 05 (Multiplayer),
 * Firebase adapters implementing these exact interfaces will be bound here
 * without altering UI components or Zustand store contracts.
 */
export interface ServiceContainer {
  authService: IAuthService;
  userProfileService: IUserProfileService;
  teaRoomService: ITeaRoomService;
  avatarService: IAvatarService;
  settingsService: ISettingsService;
}

export const services: ServiceContainer = {
  authService: new DemoAuthService(),
  userProfileService: new DemoUserProfileService(),
  teaRoomService: new DemoTeaRoomService(),
  avatarService: new LocalAvatarService(),
  settingsService: new LocalSettingsService(),
};
