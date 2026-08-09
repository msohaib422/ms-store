import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Star, TrendingUp, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, type Product, type Category } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductFormModal from '@/components/admin/ProductFormModal';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE = 10;

  const fetchProducts = async () => {
    let q = supabase.from('products').select('*, categories(name)', { count: 'exact' });
    if (search) q = q.ilike('name', `%${search}%`);
    q = q.order('created_at', { ascending: false }).range((page - 1) * PAGE, page * PAGE - 1);
    const { data, count } = await q;
    setProducts((data as Product[]) || []);
    setTotal(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    supabase.from('categories').select('*').eq('status', 'active').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => { fetchProducts(); }, [search, page]);

  const toggleField = async (id: string, field: 'status' | 'is_featured' | 'is_trending' | 'is_offer', current: boolean | string) => {
    const newVal = field === 'status' ? (current === 'active' ? 'inactive' : 'active') : !current;
    const { error } = await supabase.from('products').update({ [field]: newVal }).eq('id', id);
    if (error) { toast.error('Update failed'); return; }
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: newVal } : p));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast.error('Delete failed'); return; }
    toast.success('Product deleted');
    fetchProducts();
  };

  return (
    <AdminLayout title="Products">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input pl-9 h-9 w-full text-sm" />
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary w-full sm:w-auto justify-center">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Flags</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? Array.from({length: 5}).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>
                )) : products.map((p) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-800 max-w-[200px] truncate">{p.name}</p>
                          <p className="text-xs text-neutral-400">{p.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{(p as any).categories?.name || '–'}</td>
                    <td className="px-4 py-3">
                      {p.variants?.length > 0 ? (
                        <div>
                          <p className="font-semibold text-primary-700">Rs. {(p.variants[0].discountPrice || p.variants[0].price).toLocaleString()}</p>
                          {p.variants[0].discountPrice && <p className="text-xs text-neutral-400 line-through">Rs. {p.variants[0].price.toLocaleString()}</p>}
                          {p.variants.length > 1 && <p className="text-xs text-neutral-400 mt-0.5">+{(p.variants.length - 1)} more</p>}
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-primary-700">Rs. {(p.discount_price || p.price).toLocaleString()}</p>
                          {p.discount_price && <p className="text-xs text-neutral-400 line-through">Rs. {p.price.toLocaleString()}</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 5 ? 'text-amber-600' : 'text-secondary-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button title="Featured" onClick={() => toggleField(p.id, 'is_featured', p.is_featured)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'bg-primary-100 text-primary-600' : 'text-neutral-300 hover:text-primary-500'}`}><Star size={14} /></button>
                        <button title="Trending" onClick={() => toggleField(p.id, 'is_trending', p.is_trending)} className={`p-1.5 rounded-lg transition-colors ${p.is_trending ? 'bg-accent-100 text-accent-600' : 'text-neutral-300 hover:text-accent-500'}`}><TrendingUp size={14} /></button>
                        <button title="Offer" onClick={() => toggleField(p.id, 'is_offer', p.is_offer)} className={`p-1.5 rounded-lg transition-colors ${p.is_offer ? 'bg-secondary-100 text-secondary-600' : 'text-neutral-300 hover:text-secondary-500'}`}><Tag size={14} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleField(p.id, 'status', p.status)} className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {p.status === 'active' ? <Eye size={11} /> : <EyeOff size={11} />} {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-neutral-100">
            {loading ? Array.from({length: 4}).map((_, i) => (
              <div key={i} className="p-4"><div className="skeleton h-20 rounded-lg" /></div>
            )) : products.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-800 truncate">{p.name}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{p.sku || 'No SKU'}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{(p as any).categories?.name || '–'}</p>
                  </div>
                  <button onClick={() => toggleField(p.id, 'status', p.status)} className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {p.status === 'active' ? <Eye size={11} /> : <EyeOff size={11} />} {p.status}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {p.variants?.length > 0 ? (
                      <>
                        <p className="font-semibold text-primary-700">Rs. {(p.variants[0].discountPrice || p.variants[0].price).toLocaleString()}</p>
                        {p.variants[0].discountPrice && <p className="text-xs text-neutral-400 line-through">Rs. {p.variants[0].price.toLocaleString()}</p>}
                        {p.variants.length > 1 && <p className="text-xs text-neutral-400 mt-0.5">+{(p.variants.length - 1)} more variant{p.variants.length > 2 ? 's' : ''}</p>}
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-primary-700">Rs. {(p.discount_price || p.price).toLocaleString()}</p>
                        {p.discount_price && <p className="text-xs text-neutral-400 line-through">Rs. {p.price.toLocaleString()}</p>}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 5 ? 'text-amber-600' : 'text-secondary-600'}`}>
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button title="Featured" onClick={() => toggleField(p.id, 'is_featured', p.is_featured)} className={`p-1.5 rounded-lg transition-colors ${p.is_featured ? 'bg-primary-100 text-primary-600' : 'text-neutral-300 hover:text-primary-500'}`}><Star size={14} /></button>
                    <button title="Trending" onClick={() => toggleField(p.id, 'is_trending', p.is_trending)} className={`p-1.5 rounded-lg transition-colors ${p.is_trending ? 'bg-accent-100 text-accent-600' : 'text-neutral-300 hover:text-accent-500'}`}><TrendingUp size={14} /></button>
                    <button title="Offer" onClick={() => toggleField(p.id, 'is_offer', p.is_offer)} className={`p-1.5 rounded-lg transition-colors ${p.is_offer ? 'bg-secondary-100 text-secondary-600' : 'text-neutral-300 hover:text-secondary-500'}`}><Tag size={14} /></button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {total > PAGE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">{total} products total</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Prev</button>
                <span className="px-3 py-1.5 text-sm text-neutral-600">Page {page} of {Math.ceil(total / PAGE)}</span>
                <button disabled={page >= Math.ceil(total / PAGE)} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchProducts(); }}
        />
      )}
    </AdminLayout>
  );
}
