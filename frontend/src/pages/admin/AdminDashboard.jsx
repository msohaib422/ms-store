import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Star, MessageSquare, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { productsApi } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getDashboardStats()
      .then(res => { setStats(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-primary-50 text-primary-600', to: '/admin/products' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'bg-accent-50 text-accent-600', to: '/admin/categories' },
    { label: 'Reviews', value: stats.totalReviews, icon: Star, color: 'bg-yellow-50 text-yellow-600', to: '/admin/reviews' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'bg-purple-50 text-purple-600', badge: stats.unreadMessages > 0 ? stats.unreadMessages : null, to: '/admin/messages' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Eye, color: 'bg-orange-50 text-orange-600', to: '/admin/reviews' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: AlertTriangle, color: 'bg-red-50 text-red-600', to: '/admin/products' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
            : cards.map(({ label, value, icon: Icon, color, badge, to }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={to} className="card p-5 flex items-center justify-between group hover:border-primary-200 transition-colors">
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">{label}</p>
                    <p className="font-heading font-bold text-2xl text-neutral-900 mt-1">{value}</p>
                    {badge && <span className="badge bg-red-100 text-red-600 mt-1">{badge} new</span>}
                  </div>
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} />
                  </div>
                </Link>
              </motion.div>
            ))
          }
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-neutral-800">Recent Products</h2>
              <Link to="/admin/products" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">View all <ArrowUpRight size={12} /></Link>
            </div>
            <div className="space-y-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)
                : stats?.recentProducts.map(p => (
                  <div key={p._id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl">
                    <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-400">Rs. {(p.discountPrice || p.price).toLocaleString()}</p>
                    </div>
                    <span className={`badge ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{p.status}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-neutral-800">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">Manage <ArrowUpRight size={12} /></Link>
            </div>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl mb-2" />)
              : !stats?.lowStockList?.length
              ? <p className="text-sm text-neutral-400">All products are well stocked!</p>
              : stats.lowStockList.map(p => (
                <div key={p._id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl mb-2">
                  <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((p.stock / 10) * 100, 100)}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{p.stock} left</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
