import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, type Review } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetch = async () => {
    let q = supabase.from('reviews').select('*, products(name)').order('created_at', { ascending: false });
    if (filter === 'pending') q = q.eq('is_approved', false);
    if (filter === 'approved') q = q.eq('is_approved', true);
    const { data } = await q;
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [filter]);

  const approve = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    toast.success('Review approved');
    fetch();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    toast.success('Deleted');
    fetch();
  };

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>{f}</button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? Array.from({length: 4}).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />) :
            reviews.map(r => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 shrink-0">
                  {r.customer_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-neutral-800">{r.customer_name}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200 fill-neutral-200'} />)}</div>
                    <span className={`badge text-xs ${r.is_approved ? 'bg-secondary-100 text-secondary-700' : 'bg-amber-100 text-amber-700'}`}>{r.is_approved ? 'Approved' : 'Pending'}</span>
                  </div>
                  {(r as any).products?.name && <p className="text-xs text-primary-600 mt-0.5">Product: {(r as any).products.name}</p>}
                  <p className="text-sm text-neutral-600 mt-1">{r.review}</p>
                  <p className="text-xs text-neutral-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!r.is_approved && <button onClick={() => approve(r.id)} className="p-2 rounded-lg bg-secondary-50 hover:bg-secondary-100 text-secondary-600 transition-colors"><Check size={16} /></button>}
                  <button onClick={() => del(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))
          }
          {!loading && reviews.length === 0 && <p className="text-center text-neutral-400 py-10">No reviews found.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
