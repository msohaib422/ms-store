import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewsApi } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetch = () => {
    const params = filter === 'pending' ? { approved: 'false' } : filter === 'approved' ? { approved: 'true' } : {};
    reviewsApi.getAll(params).then(res => { setReviews(res.data.data.reviews); setLoading(false); }).catch(err => { console.error('Failed to load reviews:', err.message); setLoading(false); });
  };

  useEffect(() => { fetch(); }, [filter]);

  const approve = async (id) => {
    try { await reviewsApi.approve(id); toast.success('Review approved'); fetch(); }
    catch (err) { toast.error(err.message); }
  };

  const del = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await reviewsApi.delete(id); toast.success('Deleted'); fetch(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-4">
        <div className="flex gap-2">
          {['all', 'pending', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>{f}</button>
          ))}
        </div>
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
            : reviews.map(r => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 shrink-0">
                  {r.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-neutral-800">{r.customerName}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200 fill-neutral-200'} />)}</div>
                    <span className={`badge text-xs ${r.isApproved ? 'bg-secondary-100 text-secondary-700' : 'bg-amber-100 text-amber-700'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span>
                  </div>
                  {r.product?.name && <p className="text-xs text-primary-600 mt-0.5">Product: {r.product.name}</p>}
                  <p className="text-sm text-neutral-600 mt-1">{r.review}</p>
                  <p className="text-xs text-neutral-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!r.isApproved && <button onClick={() => approve(r._id)} className="p-2 rounded-lg bg-secondary-50 hover:bg-secondary-100 text-secondary-600"><Check size={16} /></button>}
                  <button onClick={() => del(r._id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
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
