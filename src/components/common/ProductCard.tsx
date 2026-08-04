import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Tag } from 'lucide-react';
import type { Product } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { settings } = useSettings();
  const thumb = product.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=400';
  const discount = product.discount_price && product.price
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : null;

  const waMsg = `Hello,\n\nI want to order this product.\n\nProduct Name: ${product.name}\nPrice: Rs. ${product.discount_price || product.price}\n\nPlease let me know its availability.`;
  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(waMsg)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="card group"
    >
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <img
          src={thumb}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && <span className="badge bg-red-100 text-red-600 font-semibold">-{discount}%</span>}
          {product.is_featured && <span className="badge bg-primary-100 text-primary-700">Featured</span>}
          {product.is_trending && <span className="badge bg-accent-100 text-accent-700">Trending</span>}
          {product.is_offer && <span className="badge bg-secondary-100 text-secondary-700">Offer</span>}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-neutral-800 font-medium px-3 py-1 rounded-full text-sm">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        {product.categories?.name && (
          <span className="text-xs text-primary-600 font-medium">{product.categories.name}</span>
        )}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-heading font-semibold text-neutral-800 mt-1 mb-2 line-clamp-2 hover:text-primary-600 transition-colors leading-snug">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={12} className={s <= Math.round(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300 fill-neutral-300'} />
          ))}
          {product.reviews_count > 0 && <span className="text-xs text-neutral-400 ml-1">({product.reviews_count})</span>}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-primary-700">
              Rs. {(product.discount_price || product.price).toLocaleString()}
            </span>
            {product.discount_price && (
              <span className="text-sm text-neutral-400 line-through">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>
          {product.brand && <span className="text-xs text-neutral-400 flex items-center gap-1"><Tag size={10} />{product.brand}</span>}
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-95"
        >
          <MessageCircle size={16} /> Order on WhatsApp
        </a>
      </div>
    </motion.div>
  );
}
