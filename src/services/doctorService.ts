import { api } from './apiConfig';
import { DoctorCategory, Doctor, CreateDoctorDto } from '../types/doctor';

export type { Doctor, DoctorCategory }; // Re-export both types

interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

class DoctorService {
  async getCategories(): Promise<DoctorCategory[]> {
    const response = await api.get('/doctors/categories');
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
    return api.post('/doctors/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateCategory(id: string, category: Partial<DoctorCategory>, icon?: File) {
    const formData = new FormData();
    Object.entries(category).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (icon) {
      formData.append('icon', icon);
    }
    return api.patch(`/doctors/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteCategory(id: string) {
    return api.delete(`/doctors/categories/${id}`);
  }

  async createDoctorFromUser(userId: string, doctorData: any) {
    return api.post(`/doctors/users/${userId}`, doctorData);
  }

  async getDoctors(): Promise<Doctor[]> {
    const response = await api.get<PaginatedResponse<Doctor>>('/doctors');
    return response.data.items;
  }

  async getDoctor(id: string): Promise<Doctor> {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  }

  async createDoctor(formData: FormData): Promise<Doctor> {
    const response = await api.post('/doctors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateDoctor(id: string, formData: FormData): Promise<Doctor> {
    const response = await api.patch(`/doctors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteDoctor(id: string): Promise<void> {
    await api.delete(`/doctors/${id}`);
  }
}

export const doctorService = new DoctorService(); 