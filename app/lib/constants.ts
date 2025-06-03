export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const USER_ROLES = {
  USER: 'user',
  WRITER: 'writer',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]; 