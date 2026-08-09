import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { categoriesApi } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = () => {
    categoriesApi.getAll().then(res => { setCategories(res.data.data.categories); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm();
  const imageUrl = watch('imageUrl');
  const bannerUrl = watch('bannerUrl');
  const nameVal = watch('name');

  useEffect(() => {
    if (!editing) setValue('slug', nameVal?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '');
  }, [nameVal, editing, setValue]);

  const openModal = (cat) => {
    setEditing(cat || null);
    if (cat) reset({ name: cat.name, slug: cat.slug, description: cat.description || '', imageUrl: cat.imageUrl || '', bannerUrl: cat.bannerUrl || '', displayOrder: cat.displayOrder, status: cat.status });
    else reset({ name: '', slug: '', description: '', imageUrl: '', bannerUrl: '', displayOrder: 0, status: 'active' });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) await categoriesApi.update(editing._id, data);
      else await categoriesApi.create(data);
      toast.success(`Category ${editing ? 'updated' : 'created'}`);
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  const del = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await categoriesApi.delete(id); toast.success('Deleted'); fetch(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => openModal()} className="btn-primary w-full sm:w-auto justify-center"><Plus size={16} /> Add Category</button>
        </div>
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Slug</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>)
                  : categories.map(cat => (
                    <motion.tr key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold flex-shrink-0">{cat.name[0]}</div>}
                          <p className="font-medium text-neutral-800">{cat.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-neutral-500">{cat.displayOrder}</td>
                      <td className="px-4 py-3"><span className={`badge ${cat.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{cat.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openModal(cat)} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => del(cat._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-neutral-100">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4"><div className="skeleton h-16 rounded-lg" /></div>
              ))
              : categories.map(cat => (
                <motion.div key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" /> : <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold flex-shrink-0 text-lg">{cat.name[0]}</div>}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-800 truncate">{cat.name}</p>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">{cat.slug}</p>
                    </div>
                    <span className={`badge flex-shrink-0 ${cat.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{cat.status}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Order: {cat.displayOrder}</span>
                    <div className="flex gap-1">
                      <button onClick={() => openModal(cat)} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => del(cat._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 sticky top-0 bg-white z-10">
              <h2 className="font-heading font-bold text-xl">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name *</label>
                  <input {...register('name', { required: true })} placeholder="e.g. Electronics, Clothing" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
                  <input {...register('slug', { required: true })} placeholder="auto-generated-slug" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Display Order</label>
                  <input type="number" {...register('displayOrder')} placeholder="e.g. 1" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                  <select {...register('status')} className="input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                  <textarea {...register('description')} rows={3} placeholder="Brief description of this category" className="input resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category Image</label>
                  <ImageUpload value={imageUrl ? [imageUrl] : []} onChange={urls => { const item = urls[0]; setValue('imageUrl', typeof item === 'string' ? item : item?.url || ''); }} single />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Banner Image</label>
                  <ImageUpload value={bannerUrl ? [bannerUrl] : []} onChange={urls => { const item = urls[0]; setValue('bannerUrl', typeof item === 'string' ? item : item?.url || ''); }} single />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-neutral-100">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto justify-center"><Save size={16} /> {isSubmitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary w-full sm:w-auto justify-center">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
