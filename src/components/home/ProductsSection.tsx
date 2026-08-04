import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import SectionHeader from '@/components/common/SectionHeader';
import EmptyState from '@/components/common/EmptyState';

interface Props {
  title: string;
  subtitle?: string;
  filter: { column: string; value: boolean | string };
  limit?: number;
  viewAllLink?: string;
}

export default function ProductsSection({ title, subtitle, filter, limit = 8, viewAllLink }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('status', 'active')
      .eq(filter.column, filter.value)
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data }) => { setProducts((data as Product[]) || []); setLoading(false); });
  }, [filter.column, filter.value, limit]);

  return (
    <section className="py-14 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-2">
        <SectionHeader title={title} subtitle={subtitle} />
        {viewAllLink && products.length >= limit && (
          <Link to={viewAllLink} className="hidden md:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm mb-8">
            View All <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({length: limit}).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Check back soon!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}
