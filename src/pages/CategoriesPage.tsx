import React from 'react';
import { doctorService, DoctorCategory } from '../services/doctorService';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = React.useState<DoctorCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState<DoctorCategory | null>(null);
  const [form, setForm] = React.useState({ name: '', description: '', icon: null as File | null, parentId: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await doctorService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'icon' && files) {
      setForm((prev) => ({ ...prev, icon: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddModal = () => {
    setEditCategory(null);
    setForm({ name: '', description: '', icon: null, parentId: '' });
    setShowModal(true);
  };

  const openEditModal = (category: DoctorCategory) => {
    setEditCategory(category);
    setForm({ name: category.name, description: category.description || '', icon: null, parentId: category.parentId || '' });
    setShowModal(true);
  };

  const handleAddOrEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.description) formData.append('description', form.description);
      if (form.icon) formData.append('icon', form.icon);
      if (form.parentId) formData.append('parentId', form.parentId);
      if (editCategory) {
        setError('Edit category is not implemented');
      } else {
        await doctorService.createCategory({ name: form.name, description: form.description, parentId: form.parentId }, form.icon!);
        const data = await doctorService.getCategories();
        setCategories(data);
        setShowModal(false);
        setEditCategory(null);
        setForm({ name: '', description: '', icon: null, parentId: '' });
      }
    } catch (err) {
      setError('Failed to save category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    setSubmitting(true);
    try {
      setError('Delete category is not implemented');
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={openAddModal}
        >
          Add Category
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{categories.find(c => c.id === category.parentId)?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.iconUrl ? (
                      <img src={category.iconUrl} alt={category.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-gray-400">No icon</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-600 hover:underline mr-2" onClick={() => openEditModal(category)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => { setDeleteCategoryId(category.id); setShowDeleteConfirm(true); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleAddOrEditCategory} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent Category</label>
                <select
                  name="parentId"
                  value={form.parentId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">None</option>
                  {categories.filter(c => !editCategory || c.id !== editCategory.id).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <input
                  type="file"
                  name="icon"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => { setShowModal(false); setEditCategory(null); }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (editCategory ? 'Saving...' : 'Adding...') : (editCategory ? 'Save Changes' : 'Add Category')}
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
            <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => { setShowDeleteConfirm(false); setDeleteCategoryId(null); }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteCategory}
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

export default CategoriesPage; 