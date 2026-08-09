import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi, categoriesApi } from '@/services/api';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductFormModal from '@/components/admin/ProductFormModal';

const PAGE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    categoriesApi.getAll().then(res => setCategories(res.data.data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE };
      if (search) params.search = search;
      const res = await productsApi.getAll(params);
      setProducts(res.data.data.products);
      setTotal(res.data.data.total);
    } catch { setProducts([]); }
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleField = async (id, field) => {
    try {
      await productsApi.toggle(id, field);
      fetchProducts();
    } catch (err) { toast.error(err.message); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsApi.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error(err.message); }
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Featured</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>)
                  : products.map(p => (
                    <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-800 max-w-[180px] truncate">{p.name}</p>
                            <p className="text-xs text-neutral-400">{p.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{p.category?.name || '–'}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary-700">Rs. {(p.discountPrice || p.price).toLocaleString()}</p>
                        {p.discountPrice && <p className="text-xs text-neutral-400 line-through">Rs. {p.price.toLocaleString()}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 5 ? 'text-amber-600' : 'text-secondary-600'}`}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button title="Featured" onClick={() => toggleField(p._id, 'isFeatured')} className={`p-1.5 rounded-lg transition-colors ${p.isFeatured ? 'bg-primary-100 text-primary-600' : 'text-neutral-300 hover:text-primary-500'}`}><Star size={14} /></button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleField(p._id, 'status')} className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {p.status === 'active' ? <Eye size={11} /> : <EyeOff size={11} />} {p.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => deleteProduct(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4"><div className="skeleton h-20 rounded-lg" /></div>
              ))
              : products.map(p => (
                <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=40'} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-800 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{p.sku || 'No SKU'}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{p.category?.name || '–'}</p>
                    </div>
                    <button onClick={() => toggleField(p._id, 'status')} className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${p.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {p.status === 'active' ? <Eye size={11} /> : <EyeOff size={11} />} {p.status}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary-700">Rs. {(p.discountPrice || p.price).toLocaleString()}</p>
                      {p.discountPrice && <p className="text-xs text-neutral-400 line-through">Rs. {p.price.toLocaleString()}</p>}
                    </div>
                    <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-600' : p.stock < 5 ? 'text-amber-600' : 'text-secondary-600'}`}>
                      Stock: {p.stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button title="Featured" onClick={() => toggleField(p._id, 'isFeatured')} className={`p-1.5 rounded-lg transition-colors ${p.isFeatured ? 'bg-primary-100 text-primary-600' : 'text-neutral-300 hover:text-primary-500'}`}><Star size={14} /></button>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(p); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => deleteProduct(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            }
          </div>

          {total > PAGE && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">{total} total</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50">Prev</button>
                <span className="px-3 py-1.5 text-sm text-neutral-600">{page} / {Math.ceil(total / PAGE)}</span>
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
