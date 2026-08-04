import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase, type Offer } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';

interface FormData {
  title: string; description: string; banner_url: string;
  discount_percentage: number; badge_text: string;
  expiry_date: string; status: 'active' | 'inactive';
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormData>();
  const bannerUrl = watch('banner_url');

  const openModal = (o?: Offer) => {
    setEditing(o || null);
    if (o) reset({ title: o.title, description: o.description || '', banner_url: o.banner_url || '', discount_percentage: o.discount_percentage, badge_text: o.badge_text || '', expiry_date: o.expiry_date ? o.expiry_date.split('T')[0] : '', status: o.status });
    else reset({ title: '', description: '', banner_url: '', discount_percentage: 0, badge_text: '', expiry_date: '', status: 'active' });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const payload = { ...data, discount_percentage: Number(data.discount_percentage), expiry_date: data.expiry_date || null };
    let error;
    if (editing) ({ error } = await supabase.from('offers').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id));
    else ({ error } = await supabase.from('offers').insert(payload));
    if (error) { toast.error(error.message); return; }
    toast.success(`Offer ${editing ? 'updated' : 'created'}`);
    setModalOpen(false);
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    await supabase.from('offers').delete().eq('id', id);
    toast.success('Deleted');
    fetch();
  };

  return (
    <AdminLayout title="Offers">
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => openModal()} className="btn-primary"><Plus size={16} /> Add Offer</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? Array.from({length: 3}).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />) :
            offers.map(o => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
                {o.banner_url ? <img src={o.banner_url} alt={o.title} className="w-full h-36 object-cover" /> : <div className="h-36 bg-gradient-to-br from-primary-700 to-accent-600 flex items-center justify-center"><span className="text-white text-5xl font-extrabold opacity-20">{o.discount_percentage}%</span></div>}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      {o.badge_text && <span className="badge bg-accent-100 text-accent-700 text-xs mb-1">{o.badge_text}</span>}
                      <h3 className="font-heading font-semibold text-neutral-800">{o.title}</h3>
                      <p className="text-2xl font-extrabold text-primary-600 mt-1">{o.discount_percentage}% OFF</p>
                    </div>
                    <span className={`badge ${o.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{o.status}</span>
                  </div>
                  {o.expiry_date && <p className="text-xs text-neutral-400 mt-2">Expires: {new Date(o.expiry_date).toLocaleDateString()}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openModal(o)} className="btn-secondary text-xs py-1.5 px-3"><Pencil size={12} /> Edit</button>
                    <button onClick={() => del(o.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={12} /> Delete</button>
                  </div>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 sticky top-0 bg-white z-10">
              <h2 className="font-heading font-bold text-xl">{editing ? 'Edit Offer' : 'New Offer'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Title *</label>
                <input {...register('title', { required: true })} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Discount %</label>
                  <input type="number" step="0.1" max="100" {...register('discount_percentage')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Badge Text</label>
                  <input {...register('badge_text')} className="input" placeholder="e.g. Hot Deal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Expiry Date</label>
                  <input type="date" {...register('expiry_date')} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
                  <select {...register('status')} className="input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                <textarea {...register('description')} rows={3} className="input resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Banner Image</label>
                <ImageUpload value={bannerUrl ? [bannerUrl] : []} onChange={urls => setValue('banner_url', urls[0] || '')} single />
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
