import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, type Category } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';

interface FormData {
  name: string; slug: string; description: string;
  image_url: string; banner_url: string;
  display_order: number; status: 'active' | 'inactive';
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormData>();
  const imgUrl = watch('image_url');
  const bannerUrl = watch('banner_url');
  const nameVal = watch('name');

  useEffect(() => {
    if (!editing) setValue('slug', nameVal?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '');
  }, [nameVal, editing, setValue]);

  const openModal = (cat?: Category) => {
    setEditing(cat || null);
    if (cat) reset({ name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '', banner_url: cat.banner_url || '', display_order: cat.display_order, status: cat.status });
    else reset({ name: '', slug: '', description: '', image_url: '', banner_url: '', display_order: 0, status: 'active' });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    let error;
    if (editing) ({ error } = await supabase.from('categories').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editing.id));
    else ({ error } = await supabase.from('categories').insert(data));
    if (error) { toast.error(error.message); return; }
    toast.success(`Category ${editing ? 'updated' : 'created'}`);
    setModalOpen(false);
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error('Delete failed'); return; }
    toast.success('Deleted');
    fetch();
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => openModal()} className="btn-primary"><Plus size={16} /> Add Category</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? Array.from({length: 3}).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>) :
                categories.map(cat => (
                  <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold">{cat.name[0]}</div>}
                        <p className="font-medium text-neutral-800">{cat.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-neutral-500">{cat.display_order}</td>
                    <td className="px-4 py-3"><span className={`badge ${cat.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{cat.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openModal(cat)} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600"><Pencil size={15} /></button>
                        <button onClick={() => del(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="font-heading font-bold text-xl">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name *</label>
                  <input {...register('name', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
                  <input {...register('slug', { required: true })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Display Order</label>
                  <input type="number" {...register('display_order')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                  <select {...register('status')} className="input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                  <textarea {...register('description')} rows={3} className="input resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category Image</label>
                  <ImageUpload value={imgUrl ? [imgUrl] : []} onChange={urls => setValue('image_url', urls[0] || '')} single />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Banner Image</label>
                  <ImageUpload value={bannerUrl ? [bannerUrl] : []} onChange={urls => setValue('banner_url', urls[0] || '')} single />
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-neutral-100">
                <button type="submit" disabled={isSubmitting} className="btn-primary"><Save size={16} /> {isSubmitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
