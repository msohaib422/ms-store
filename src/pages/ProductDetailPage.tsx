import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageCircle, Tag, Package, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase, type Product, type Review } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductCard from '@/components/common/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [reviewForm, setReviewForm] = useState({ customer_name: '', rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      supabase.from('products').select('*, categories(name, slug)').eq('slug', slug).maybeSingle(),
    ]).then(([{ data }]) => {
      setProduct(data as Product | null);
      setLoading(false);
      setSelectedVariantIdx(0);
      if (data) {
        supabase.from('reviews').select('*').eq('product_id', data.id).eq('is_approved', true).then(({ data: r }) => setReviews(r || []));
        if (data.category_id) {
          supabase.from('products').select('*, categories(name, slug)').eq('category_id', data.category_id).neq('id', data.id).eq('status', 'active').limit(4).then(({ data: rel }) => setRelated((rel as Product[]) || []));
        }
      }
    });
  }, [slug]);

  if (loading) return <MainLayout><LoadingSpinner size="lg" /></MainLayout>;
  if (!product) return <MainLayout><div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-neutral-500">Product not found.</p><Link to="/products" className="btn-primary mt-4">Back to Products</Link></div></MainLayout>;

  const images = product.images?.length ? product.images : ['https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600'];
  const hasVariants = product.variants?.length > 0;
  const selectedVariant = hasVariants ? product.variants[selectedVariantIdx] : null;
  const finalPrice = hasVariants ? (selectedVariant!.discountPrice || selectedVariant!.price) : (product.discount_price || product.price);
  const originalPrice = hasVariants ? selectedVariant!.price : product.price;
  const discount = hasVariants
    ? (selectedVariant!.discountPrice ? Math.round((1 - selectedVariant!.discountPrice / selectedVariant!.price) * 100) : null)
    : (product.discount_price ? Math.round((1 - product.discount_price / product.price) * 100) : null);
  const variantLabel = hasVariants ? selectedVariant!.name : '';
  const waMsg = `Hello,\n\nI want to order this product.\n\nProduct Name: ${product.name}${variantLabel ? `\nVariant: ${variantLabel}` : ''}\nPrice: Rs. ${finalPrice}\n\nPlease let me know its availability.`;
  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(waMsg)}`;

  const submitReview = async () => {
    if (!reviewForm.customer_name.trim() || !reviewForm.review.trim()) { toast.error('Please fill all fields'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({ ...reviewForm, product_id: product.id });
    if (error) { toast.error('Failed to submit review'); }
    else { toast.success('Review submitted! It will appear after approval.'); setReviewForm({ customer_name: '', rating: 5, review: '' }); }
    setSubmitting(false);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          {product.categories?.name && <><span>/</span><Link to={`/products?category=${product.categories.slug}`} className="hover:text-primary-600">{product.categories.name}</Link></>}
          <span>/</span>
          <span className="text-neutral-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-neutral-50 aspect-square mb-3">
              <motion.img key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"><ChevronLeft size={18} /></button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"><ChevronRight size={18} /></button>
                </>
              )}
              {discount && <span className="absolute top-3 left-3 badge bg-red-100 text-red-600 font-bold">-{discount}%</span>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${i === imgIdx ? 'border-primary-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories?.name && (
              <Link to={`/products?category=${product.categories.slug}`} className="text-sm text-primary-600 font-medium hover:underline">{product.categories.name}</Link>
            )}
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mt-2 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 fill-neutral-300'} />)}
              </div>
              <span className="text-sm text-neutral-500">({product.reviews_count} reviews)</span>
            </div>

            {/* Variant Selector */}
            {hasVariants && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select Size / Option:</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        i === selectedVariantIdx
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {v.name}
                      <span className="block text-xs mt-0.5 opacity-70">Rs. {(v.discountPrice || v.price).toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-extrabold text-primary-700">Rs. {finalPrice.toLocaleString()}</span>
              {discount !== null && <span className="text-lg text-neutral-400 line-through">Rs. {originalPrice.toLocaleString()}</span>}
            </div>
            {hasVariants && selectedVariant!.discountPrice && (
              <p className="text-sm text-secondary-600 font-medium mb-2">
                You save Rs. {(selectedVariant!.price - selectedVariant!.discountPrice).toLocaleString()} on {selectedVariant!.name}
              </p>
            )}

            {product.short_description && <p className="text-neutral-600 mb-5">{product.short_description}</p>}

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              {product.brand && <div className="flex items-center gap-2 text-neutral-600"><Tag size={14} className="text-primary-500" /> Brand: <span className="font-medium">{product.brand}</span></div>}
              {product.sku && <div className="flex items-center gap-2 text-neutral-600"><Package size={14} className="text-primary-500" /> SKU: <span className="font-medium">{product.sku}</span></div>}
              <div className={`flex items-center gap-2 font-medium ${product.stock > 0 ? 'text-secondary-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors">
                <MessageCircle size={20} /> Order on WhatsApp
              </a>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="btn-secondary justify-center">
                <Share2 size={16} /> Share Product
              </button>
            </div>

            {product.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map(tag => <span key={tag} className="badge bg-neutral-100 text-neutral-600">#{tag}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="card p-8 mb-10">
            <h2 className="font-heading font-bold text-xl mb-4">Product Description</h2>
            <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
          </div>
        )}

        {/* Reviews */}
        <div className="mb-10">
          <h2 className="font-heading font-bold text-xl mb-6">Customer Reviews ({reviews.length})</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {reviews.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-neutral-800">{r.customer_name}</p>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200 fill-neutral-200'} />)}</div>
                </div>
                <p className="text-sm text-neutral-600">{r.review}</p>
                <p className="text-xs text-neutral-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          {/* Review form */}
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Write a Review</h3>
            <div className="space-y-3">
              <input value={reviewForm.customer_name} onChange={e => setReviewForm(f => ({...f, customer_name: e.target.value}))} className="input" placeholder="Your name" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">Rating:</span>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewForm(f => ({...f, rating: s}))}>
                    <Star size={20} className={s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 fill-neutral-300'} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.review} onChange={e => setReviewForm(f => ({...f, review: e.target.value}))} className="input resize-none" rows={3} placeholder="Share your experience..." />
              <button onClick={submitReview} disabled={submitting} className="btn-primary">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-xl mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
