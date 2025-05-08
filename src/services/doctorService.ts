import { api } from './apiConfig';
import { DoctorCategory, Doctor } from '../types/doctor';

export type { Doctor, DoctorCategory }; // Re-export both types

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

  async getDoctor(id: string): Promise<Doctor> {
    try {
      console.log('Fetching doctor with ID:', id);
      const response = await api.get<Doctor>(`/doctors/${id}`);
      console.log('Doctor API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getDoctor:', error);
      throw error;
    }
  }

  async createDoctor(doctorData: any) {
    return api.post<Doctor>('/doctors', doctorData);
  }

  async updateDoctor(id: string, doctorData: any) {
    return api.patch<Doctor>(`/doctors/${id}`, doctorData);
  }

  async deleteDoctor(id: string) {
    return api.delete(`/doctors/${id}`);
  }
}

export const doctorService = new DoctorService(); 