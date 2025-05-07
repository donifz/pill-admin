export interface DoctorCategory {
  id: string;
  name: string;
  iconUrl?: string;
  description?: string;
  parentId?: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  yearsExperience: number;
  photoUrl: string;
  bio: string;
  languages: string[];
  consultationFee: number;
  contactEmail: string;
  contactPhone: string;
  clinicAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  availableSlots: Date[];
  category: DoctorCategory;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDoctorDto {
  firstName: string;
  lastName: string;
  specialization: string;
  yearsExperience: number;
  photoUrl: string;
  bio: string;
  languages: string[];
  consultationFee: number;
  contactEmail: string;
  contactPhone: string;
  clinicAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  availableSlots?: Date[];
  categoryId: string;
} 