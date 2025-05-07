export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  DOCTOR = 'DOCTOR',
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