import React from 'react';
import { doctorService, Doctor, DoctorCategory } from '../services/doctorService';
import { useNavigate } from 'react-router-dom';

interface DoctorForm {
  firstName: string;
  lastName: string;
  categoryId: string;
  photo: File | null;
  specialization: string;
  yearsExperience: number | '';
  rating?: number | '';
  reviewsCount?: number | '';
  bio: string;
  languages: string[];
  consultationFee: number | '';
  contactEmail: string;
  contactPhone: string;
  clinicAddress: string;
  latitude: number | '';
  longitude: number | '';
  availableSlots: string[];
}

const initialForm: DoctorForm = {
  firstName: '',
  lastName: '',
  categoryId: '',
  photo: null,
  specialization: '',
  yearsExperience: '',
  rating: '',
  reviewsCount: '',
  bio: '',
  languages: [],
  consultationFee: '',
  contactEmail: '',
  contactPhone: '',
  clinicAddress: '',
  latitude: '',
  longitude: '',
  availableSlots: [],
};

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [categories, setCategories] = React.useState<DoctorCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editDoctor, setEditDoctor] = React.useState<Doctor | null>(null);
  const [form, setForm] = React.useState<DoctorForm>(initialForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteDoctorId, setDeleteDoctorId] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [languageInput, setLanguageInput] = React.useState('');
  const [slotInput, setSlotInput] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsData, categoriesData] = await Promise.all([
          doctorService.getDoctors(),
          doctorService.getCategories(),
        ]);
        setDoctors(doctorsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch doctors or categories');
        setDoctors([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'photo' && (e.target as HTMLInputElement).files) {
      setForm((prev) => ({ ...prev, photo: (e.target as HTMLInputElement).files![0] }));
    } else if (type === 'number') {
      const numValue = value === '' ? '' : Number(value);
      if (name === 'rating' && numValue !== '' && (numValue < 0 || numValue > 5)) {
        return; // Don't update if rating is out of bounds
      }
      if (name === 'yearsExperience' && numValue !== '' && numValue < 0) {
        return; // Don't update if yearsExperience is negative
      }
      if (name === 'reviewsCount' && numValue !== '' && numValue < 0) {
        return; // Don't update if reviewsCount is negative
      }
      if (name === 'consultationFee' && numValue !== '' && numValue < 0) {
        return; // Don't update if consultationFee is negative
      }
      setForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLanguage = () => {
    if (languageInput.trim()) {
      setForm((prev) => ({ ...prev, languages: [...prev.languages, languageInput.trim()] }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setForm((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  };

  const handleAddSlot = () => {
    if (slotInput.trim()) {
      setForm((prev) => ({ ...prev, availableSlots: [...prev.availableSlots, slotInput.trim()] }));
      setSlotInput('');
    }
  };

  const handleRemoveSlot = (slot: string) => {
    setForm((prev) => ({ ...prev, availableSlots: prev.availableSlots.filter((s) => s !== slot) }));
  };

  const openAddModal = () => {
    setEditDoctor(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setForm({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      categoryId: doctor.category?.id || '',
      photo: null,
      specialization: doctor.specialization || '',
      yearsExperience: doctor.yearsExperience || '',
      rating: doctor.rating || '',
      reviewsCount: doctor.reviewsCount || '',
      bio: doctor.bio || '',
      languages: doctor.languages || [],
      consultationFee: doctor.consultationFee || '',
      contactEmail: doctor.contactEmail || '',
      contactPhone: doctor.contactPhone || '',
      clinicAddress: doctor.clinicAddress || '',
      latitude: doctor.location?.latitude || '',
      longitude: doctor.location?.longitude || '',
      availableSlots: (doctor.availableSlots || []).map((d: string | Date) => d.toString()),
    });
    setShowModal(true);
  };

  const handleAddOrEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (editDoctor) {
        await doctorService.updateDoctor(editDoctor.id, formData);
      } else {
        await doctorService.createDoctor(formData);
      }

      const [doctorsData, categoriesData] = await Promise.all([
        doctorService.getDoctors(),
        doctorService.getCategories(),
      ]);
      setDoctors(doctorsData);
      setCategories(categoriesData);
      setShowModal(false);
      setEditDoctor(null);
      setForm(initialForm);
    } catch (error) {
      setError('Failed to save doctor');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!deleteDoctorId) return;
    setSubmitting(true);
    try {
      await doctorService.deleteDoctor(deleteDoctorId);
      setDoctors(doctors.filter((doc) => doc.id !== deleteDoctorId));
      setShowDeleteConfirm(false);
      setDeleteDoctorId(null);
    } catch (err) {
      setError('Failed to delete doctor');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Doctors</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={openAddModal}
        >
          Add Doctor
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(doctors) && doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.firstName} {doctor.lastName}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.category?.name || '-'}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.specialization}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.yearsExperience} yrs</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.rating} ({doctor.reviewsCount})</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.languages?.join(', ')}</td>
                  <td className="px-2 py-4 whitespace-nowrap">${doctor.consultationFee}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.contactEmail}<br />{doctor.contactPhone}</td>
                  <td className="px-2 py-4 whitespace-nowrap">{doctor.clinicAddress}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => navigate(`/admin/doctors/${doctor.id}`)}>View Details</button>
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => openEditModal(doctor)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => { setDeleteDoctorId(doctor.id); setShowDeleteConfirm(true); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</h3>
            <form onSubmit={handleAddOrEditDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <input type="file" name="photo" accept="image/*" onChange={handleInputChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input type="text" name="specialization" value={form.specialization} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years Experience</label>
                <input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" min={0} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input type="number" name="rating" value={form.rating} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" min={0} max={5} step={0.1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reviews Count</label>
                <input type="number" name="reviewsCount" value={form.reviewsCount} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" min={0} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Languages</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={languageInput} onChange={e => setLanguageInput(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2" placeholder="Add language" />
                  <button type="button" className="px-3 py-2 bg-blue-500 text-white rounded" onClick={handleAddLanguage}>Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.languages.map((lang) => (
                    <span key={lang} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center">
                      {lang}
                      <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveLanguage(lang)}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                <input type="number" name="consultationFee" value={form.consultationFee} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" min={0} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Clinic Address</label>
                <input type="text" name="clinicAddress" value={form.clinicAddress} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input type="number" name="latitude" value={form.latitude} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input type="number" name="longitude" value={form.longitude} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Available Slots</label>
                <div className="flex gap-2 mb-2">
                  <input type="datetime-local" value={slotInput} onChange={e => setSlotInput(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2" />
                  <button type="button" className="px-3 py-2 bg-blue-500 text-white rounded" onClick={handleAddSlot}>Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.availableSlots.map((slot) => (
                    <span key={slot} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center">
                      {slot}
                      <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveSlot(slot)}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowModal(false); setEditDoctor(null); }} disabled={submitting}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={submitting}>{submitting ? (editDoctor ? 'Saving...' : 'Adding...') : (editDoctor ? 'Save Changes' : 'Add Doctor')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Doctor</h3>
            <p>Are you sure you want to delete this doctor?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowDeleteConfirm(false); setDeleteDoctorId(null); }} disabled={submitting}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteDoctor} disabled={submitting}>{submitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage; 