import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react';

const AdminCategoriesPage = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name || '', description: cat.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        addToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(formData);
        addToast('Category created successfully', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      addToast('Failed to save category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await categoryService.deleteCategory(id);
      addToast('Category deleted', 'info');
      fetchCategories();
    } catch (err) {
      addToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Category Management</h1>
            <p className="text-sm text-slate-400">Organize items into store categories</p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">{cat.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg glass-card text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg glass-card text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400">{cat.description || 'No description provided.'}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-semibold text-xs shadow-lg mt-2">
                  Save Category
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategoriesPage;
