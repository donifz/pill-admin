import { api } from './apiConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'doctor';
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export const userService = new UserService(); 