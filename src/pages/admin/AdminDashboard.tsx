import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, FolderOpen, Tag, Star, MessageSquare, AlertTriangle, TrendingUp, Eye, ArrowUpRight } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

interface Stats {
  products: number;
  categories: number;
  offers: number;
  reviews: number;
  messages: number;
  unreadMessages: number;
  pendingReviews: number;
  lowStock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, offers: 0, reviews: 0, messages: 0, unreadMessages: 0, pendingReviews: 0, lowStock: 0 });
  const [recent, setRecent] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('offers').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 5),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('products').select('*, categories(name)').lt('stock', 5).order('stock').limit(5),
    ]).then(([p, c, o, r, m, um, pr, ls, recent, lsData]) => {
      setStats({
        products: p.count || 0,
        categories: c.count || 0,
        offers: o.count || 0,
        reviews: r.count || 0,
        messages: m.count || 0,
        unreadMessages: um.count || 0,
        pendingReviews: pr.count || 0,
        lowStock: ls.count || 0,
      });
      setRecent((recent.data as Product[]) || []);
      setLowStock((lsData.data as Product[]) || []);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-primary-50 text-primary-600', to: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: FolderOpen, color: 'bg-accent-50 text-accent-600', to: '/admin/categories' },
    { label: 'Active Offers', value: stats.offers, icon: Tag, color: 'bg-secondary-50 text-secondary-600', to: '/admin/offers' },
    { label: 'Total Reviews', value: stats.reviews, icon: Star, color: 'bg-yellow-50 text-yellow-600', to: '/admin/reviews' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-purple-50 text-purple-600', badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined, to: '/admin/messages' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Eye, color: 'bg-orange-50 text-orange-600', to: '/admin/reviews' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: AlertTriangle, color: 'bg-red-50 text-red-600', to: '/admin/products' },
    { label: 'Trending', value: '-', icon: TrendingUp, color: 'bg-teal-50 text-teal-600', to: '/admin/products' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color, badge, to }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={to} className="card p-5 flex items-center justify-between group hover:border-primary-200 transition-colors">
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{label}</p>
                  <p className="font-heading font-bold text-2xl text-neutral-900 mt-1">{loading ? '–' : value}</p>
                  {badge !== undefined && <span className="badge bg-red-100 text-red-600 mt-1">{badge} new</span>}
                </div>
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-neutral-800">Recent Products</h2>
              <Link to="/admin/products" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">View all <ArrowUpRight size={12} /></Link>
            </div>
            <div className="space-y-3">
              {loading ? Array.from({length: 5}).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />) :
                recent.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl">
                    <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-400">Rs. {(p.discount_price || p.price).toLocaleString()}</p>
                    </div>
                    <span className={`badge ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>{p.status}</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Low stock */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-neutral-800">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">Manage <ArrowUpRight size={12} /></Link>
            </div>
            {loading ? Array.from({length: 5}).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl mb-2" />) :
              lowStock.length === 0 ? <p className="text-sm text-neutral-400">All products are well stocked!</p> :
              <div className="space-y-3">
                {lowStock.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl">
                    <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500 w-0' : 'bg-amber-500'}`} style={{ width: `${Math.min((p.stock / 10) * 100, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>{p.stock} left</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
