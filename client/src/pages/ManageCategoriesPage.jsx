import React, { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';
import { SkeletonTable } from '../components/common/Skeleton';
import { FolderKanban, Plus, Trash2, Edit } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ManageCategoriesPage = () => {
  const { addToast } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data.data);
    } catch (err) {
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setCatName('');
    setCatDesc('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setShowModal(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await categoryApi.updateCategory(editingCat.id, { name: catName, description: catDesc });
        addToast('Category updated successfully.', 'success');
      } else {
        await categoryApi.createCategory({ name: catName, description: catDesc });
        addToast('Category created successfully.', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryApi.deleteCategory(id);
      addToast('Category deleted.', 'success');
      fetchCategories();
    } catch (err) {
      addToast('Failed to delete category.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-400" /> Ticket Category Management
          </h2>
          <p className="text-xs text-slate-400">Configure ticket classification types and taxonomy</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
        {loading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Total Tickets</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">{c.description || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                        {c.ticket_count || 0} tickets
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCat ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSubmitCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Billing & Refunds"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Description of queries falling under this category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
