import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsApi, categoriesApi } from '@/services/api';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import EmptyState from '@/components/common/EmptyState';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';
  const featured = searchParams.get('featured') === 'true';

  useEffect(() => {
    categoriesApi.getAll('active').then(res => setCategories(res.data.data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE, sort: sortBy };
      if (search) params.search = search;
      if (categorySlug) params.category = categorySlug;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (featured) params.featured = 'true';

      const res = await productsApi.getAll(params);
      setProducts(res.data.data.products);
      setTotal(res.data.data.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, categorySlug, sortBy, minPrice, maxPrice, featured, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setPage(1);
    setSearchParams(p);
  };

  const clearAll = () => { setSearchParams({}); setPage(1); };
  const hasFilters = search || categorySlug || featured || minPrice || maxPrice;

  return (
    <MainLayout>
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="font-heading font-bold text-2xl text-neutral-900">All Products</h1>
          <p className="text-neutral-500 text-sm mt-1">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => setParam('search', e.target.value)} placeholder="Search products..." className="input pl-9 h-10 text-sm" />
          </div>
          <select value={sortBy} onChange={e => setParam('sort', e.target.value)} className="input h-10 text-sm w-auto">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name A-Z</option>
          </select>
          <button onClick={() => setFilterOpen(v => !v)} className="flex items-center gap-2 h-10 px-4 rounded-xl border border-neutral-200 bg-white text-sm font-medium hover:bg-neutral-50 transition-colors">
            <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
          </button>
          {hasFilters && <button onClick={clearAll} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"><X size={14} /> Clear</button>}
        </div>

        {filterOpen && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Category</label>
              <select value={categorySlug} onChange={e => setParam('category', e.target.value)} className="input text-sm h-9">
                <option value="">All</option>
                {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Min Price</label>
              <input type="number" value={minPrice} onChange={e => setParam('min', e.target.value)} placeholder="Rs. 0" className="input text-sm h-9" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2 block">Max Price</label>
              <input type="number" value={maxPrice} onChange={e => setParam('max', e.target.value)} placeholder="No limit" className="input text-sm h-9" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block">Type</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={featured} onChange={e => setParam('featured', e.target.checked ? 'true' : '')} className="rounded" /> Featured
              </label>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No products found" description="Try adjusting your filters or search term." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            {total > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-medium disabled:opacity-40 hover:bg-neutral-50">Previous</button>
                <span className="text-sm text-neutral-600">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
                <button disabled={page >= Math.ceil(total / PAGE_SIZE)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border border-neutral-200 text-sm font-medium disabled:opacity-40 hover:bg-neutral-50">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
