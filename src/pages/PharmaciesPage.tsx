import React from 'react';
import { pharmacyService, Pharmacy } from '../services/pharmacyService';

const PharmaciesPage: React.FC = () => {
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editPharmacy, setEditPharmacy] = React.useState<Pharmacy | null>(null);
  const [form, setForm] = React.useState({ name: '', address: '', phone: '', email: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [deletePharmacyId, setDeletePharmacyId] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const data = await pharmacyService.getPharmacies();
        setPharmacies(data);
      } catch (err) {
        setError('Failed to fetch pharmacies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditPharmacy(null);
    setForm({ name: '', address: '', phone: '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (pharmacy: Pharmacy) => {
    setEditPharmacy(pharmacy);
    setForm({ name: pharmacy.name, address: pharmacy.address, phone: pharmacy.phone, email: pharmacy.email });
    setShowModal(true);
  };

  const handleAddOrEditPharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editPharmacy) {
        await pharmacyService.updatePharmacy(editPharmacy.id, form);
      } else {
        await pharmacyService.createPharmacy(form);
      }
      const data = await pharmacyService.getPharmacies();
      setPharmacies(data);
      setShowModal(false);
      setEditPharmacy(null);
      setForm({ name: '', address: '', phone: '', email: '' });
    } catch (err) {
      setError('Failed to save pharmacy');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePharmacy = async () => {
    if (!deletePharmacyId) return;
    setSubmitting(true);
    try {
      await pharmacyService.deletePharmacy(deletePharmacyId);
      setPharmacies(pharmacies.filter((p) => p.id !== deletePharmacyId));
      setShowDeleteConfirm(false);
      setDeletePharmacyId(null);
    } catch (err) {
      setError('Failed to delete pharmacy');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pharmacies</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={openAddModal}
        >
          Add Pharmacy
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pharmacies.map((pharmacy) => (
                <tr key={pharmacy.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{pharmacy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pharmacy.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pharmacy.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pharmacy.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => openEditModal(pharmacy)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => { setDeletePharmacyId(pharmacy.id); setShowDeleteConfirm(true); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Pharmacy Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editPharmacy ? 'Edit Pharmacy' : 'Add Pharmacy'}</h3>
            <form onSubmit={handleAddOrEditPharmacy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => { setShowModal(false); setEditPharmacy(null); }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (editPharmacy ? 'Saving...' : 'Adding...') : (editPharmacy ? 'Save Changes' : 'Add Pharmacy')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Pharmacy</h3>
            <p>Are you sure you want to delete this pharmacy?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => { setShowDeleteConfirm(false); setDeletePharmacyId(null); }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeletePharmacy}
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmaciesPage; 