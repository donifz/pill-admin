import { api } from './apiConfig';

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  // Add other pharmacy properties as needed
}

export interface PharmacyMedicine {
  id: string;
  pharmacyId: string;
  medicineId: string;
  price: number;
  stock: number;
  // Add other pharmacy medicine properties as needed
}

export const pharmacyService = {
  // Pharmacies
  async createPharmacy(pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await api.post('/pharmacies', pharmacy);
    return response.data;
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    const response = await api.get('/pharmacies');
    return response.data;
  },

  async getPharmacyById(id: string): Promise<Pharmacy> {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
  },

  async updatePharmacy(id: string, pharmacy: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await api.patch(`/pharmacies/${id}`, pharmacy);
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