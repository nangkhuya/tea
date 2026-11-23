import { MAX_ROOM_CAPACITY } from '../config/constants';
import type { CreateRoomInput } from '../types/domain';

export interface ValidationResult<T extends string = string> {
  valid: boolean;
  errors: Partial<Record<T, string>>;
}

export function validateCreateRoomInput(
  input: CreateRoomInput,
  language: 'vi' | 'en' = 'vi',
): ValidationResult<'name' | 'description' | 'capacity' | 'teaTradition'> {
  const errors: Partial<Record<'name' | 'description' | 'capacity' | 'teaTradition', string>> = {};
  const trimmedName = input.name.trim();
  const trimmedDescription = input.description.trim();
  const trimmedTea = input.teaTradition.trim();

  if (trimmedName.length < 3 || trimmedName.length > 60) {
    errors.name =
      language === 'vi'
        ? 'Tên phòng trà cần từ 3 đến 60 ký tự.'
        : 'Room name must be between 3 and 60 characters.';
  }

  if (trimmedDescription.length < 10 || trimmedDescription.length > 240) {
    errors.description =
      language === 'vi'
        ? 'Mô tả không gian cần từ 10 đến 240 ký tự.'
        : 'Description must be between 10 and 240 characters.';
  }

  if (!Number.isInteger(input.capacity) || input.capacity < 2 || input.capacity > MAX_ROOM_CAPACITY) {
    errors.capacity =
      language === 'vi'
        ? `Sức chứa phải từ 2 đến tối đa ${MAX_ROOM_CAPACITY} người.`
        : `Capacity must be between 2 and ${MAX_ROOM_CAPACITY} guests.`;
  }

  if (trimmedTea.length < 2 || trimmedTea.length > 60) {
    errors.teaTradition =
      language === 'vi'
        ? 'Vui lòng nhập dòng trà chủ đạo (2–60 ký tự).'
        : 'Please specify a tea tradition (2–60 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileEditInput(
  input: { displayName: string; bio: string; favoriteTea: string },
  language: 'vi' | 'en' = 'vi',
): ValidationResult<'displayName' | 'bio' | 'favoriteTea'> {
  const errors: Partial<Record<'displayName' | 'bio' | 'favoriteTea', string>> = {};
  const name = input.displayName.trim();
  const bio = input.bio.trim();
  const tea = input.favoriteTea.trim();

  if (name.length < 2 || name.length > 40) {
    errors.displayName =
      language === 'vi'
        ? 'Tên hiển thị cần từ 2 đến 40 ký tự.'
        : 'Display name must be between 2 and 40 characters.';
  }

  if (bio.length > 200) {
    errors.bio =
      language === 'vi'
        ? 'Giới thiệu không vượt quá 200 ký tự.'
        : 'Bio must not exceed 200 characters.';
  }

  if (tea.length > 50) {
    errors.favoriteTea =
      language === 'vi'
        ? 'Tên dòng trà không vượt quá 50 ký tự.'
        : 'Favorite tea must not exceed 50 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
