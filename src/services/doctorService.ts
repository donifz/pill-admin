import { api } from './apiConfig';
import { DoctorCategory, Doctor } from '../types/doctor';

export type { Doctor }; // Re-export the Doctor type from types/doctor.ts

class DoctorService {
  async getCategories(): Promise<DoctorCategory[]> {
    const response = await api.get<DoctorCategory[]>('/doctors/categories');
    return response.data;
  }

  async createCategory(category: Partial<DoctorCategory>, icon?: File) {
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (icon) {
      formData.append('icon', icon);
    }
    return api.post<DoctorCategory>('/doctors/categories', formData);
  }

  async updateCategory(id: string, category: Partial<DoctorCategory>, icon?: File) {
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (icon) {
      formData.append('icon', icon);
    }
    return api.patch<DoctorCategory>(`/doctors/categories/${id}`, formData);
  }

  async deleteCategory(id: string) {
    return api.delete(`/doctors/categories/${id}`);
  }

  async createDoctorFromUser(userId: string, doctorData: any) {
    return api.post(`/doctors/users/${userId}`, doctorData);
  }

  async getDoctors(): Promise<Doctor[]> {
    const response = await api.get<{ items: Doctor[], total: number }>('/doctors');
    return response.data.items;
  }

  async getDoctor(id: string) {
    return api.get(`/doctors/${id}`);
  }

  async deleteDoctor(id: string) {
    return api.delete(`/doctors/${id}`);
  }
}

export const doctorService = new DoctorService(); 