export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateRoleDto {
  role: Role;
} 