import { api } from './apiConfig';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city?: string;
  contactPhone: string;
  contactEmail: string;
  openingHours: string;
  is24h: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface PharmacyMedicine {
  id: string;
  pharmacyId: string;
  medicineId: string;
  price: number;
  stock: number;
}

export const pharmacyService = {
  // Pharmacies
  async createPharmacy(pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await api.post('/pharmacies', {
      name: pharmacy.name,
      address: pharmacy.address,
      city: pharmacy.city,
      contactPhone: pharmacy.contactPhone,
      contactEmail: pharmacy.contactEmail,
      openingHours: pharmacy.openingHours || '9:00-18:00',
      is24h: pharmacy.is24h || false,
      latitude: pharmacy.location?.latitude || 0,
      longitude: pharmacy.location?.longitude || 0,
    });
    return response.data;
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    const response = await api.get('/pharmacies');
    // Handle the response format where data is wrapped in a 'pharmacies' property
    return response.data.pharmacies || response.data || [];
  },

  async getPharmacyById(id: string): Promise<Pharmacy> {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
  },

  async updatePharmacy(id: string, pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await api.patch(`/pharmacies/${id}`, {
      name: pharmacy.name,
      address: pharmacy.address,
      city: pharmacy.city,
      contactPhone: pharmacy.contactPhone,
      contactEmail: pharmacy.contactEmail,
      openingHours: pharmacy.openingHours,
      is24h: pharmacy.is24h,
      latitude: pharmacy.location?.latitude,
      longitude: pharmacy.location?.longitude,
    });
    return response.data;
  },

  async deletePharmacy(id: string): Promise<void> {
    await api.delete(`/pharmacies/${id}`);
  },

  // Pharmacy Medicines
  async createPharmacyMedicine(medicine: Partial<PharmacyMedicine>): Promise<PharmacyMedicine> {
    const response = await api.post('/pharmacy-medicines', medicine);
    return response.data;
  },

  async getPharmacyMedicines(): Promise<PharmacyMedicine[]> {
    const response = await api.get('/pharmacy-medicines');
    return response.data;
  },

  async getPharmacyMedicineById(id: string): Promise<PharmacyMedicine> {
    const response = await api.get(`/pharmacy-medicines/${id}`);
    return response.data;
  },

  async updatePharmacyMedicine(id: string, medicine: Partial<PharmacyMedicine>): Promise<PharmacyMedicine> {
    const response = await api.patch(`/pharmacy-medicines/${id}`, medicine);
    return response.data;
  },

  async deletePharmacyMedicine(id: string): Promise<void> {
    await api.delete(`/pharmacy-medicines/${id}`);
  },
}; 