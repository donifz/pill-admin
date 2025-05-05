import { api } from './apiConfig';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  categoryId: string;
  category?: DoctorCategory;
  photoUrl?: string;
  specialization: string;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  languages: string[];
  consultationFee: number;
  contactEmail: string;
  contactPhone: string;
  clinicAddress: string;
  location: { latitude: number; longitude: number };
  availableSlots?: string[];
  // Add other doctor properties as needed
}

export interface DoctorCategory {
  id: string;
  name: string;
  iconUrl?: string;
  description?: string;
  parentId?: string;
}

export const doctorService = {
  // Doctor Categories
  async createCategory(category: Partial<DoctorCategory>, icon?: File): Promise<DoctorCategory> {
    const formData = new FormData();
    if (category.name) {
      formData.append('name', category.name);
    }
    if (icon) {
      formData.append('icon', icon);
    }
    
    const response = await api.post('/doctors/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getCategories(): Promise<DoctorCategory[]> {
    const response = await api.get('/doctors/categories');
    return response.data;
  },

  async getCategoryById(id: string): Promise<DoctorCategory> {
    const response = await api.get(`/doctors/categories/${id}`);
    return response.data;
  },

  // Doctors
  async createDoctor(doctor: Partial<Doctor>): Promise<Doctor> {
    const response = await api.post('/doctors', doctor);
    return response.data;
  },

  async getDoctors(): Promise<Doctor[]> {
    const response = await api.get('/doctors');
    return response.data.items;
  },

  async getDoctorsByCategory(categoryId: string): Promise<Doctor[]> {
    const response = await api.get(`/doctors/category/${categoryId}`);
    return response.data;
  },

  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
    const response = await api.patch(`/doctors/${id}`, doctor);
    return response.data;
  },

  async deleteDoctor(id: string): Promise<void> {
    await api.delete(`/doctors/${id}`);
  },
}; 