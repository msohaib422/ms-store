import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { supabase, type Product, type Category } from '@/lib/supabase';
import ImageUpload from './ImageUpload';

interface FormData {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  discount_price: number | '';
  category_id: string;
  brand: string;
  sku: string;
  stock: number;
  status: 'active' | 'inactive';
  is_featured: boolean;
  is_trending: boolean;
  is_offer: boolean;
  search_keywords: string;
  images: string[];
  tags: string;
}

interface Props {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductFormModal({ product, categories, onClose, onSaved }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      short_description: product?.short_description || '',
      description: product?.description || '',
      price: product?.price || 0,
      discount_price: product?.discount_price || '',
      category_id: product?.category_id || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      stock: product?.stock ?? 0,
      status: product?.status || 'active',
      is_featured: product?.is_featured || false,
      is_trending: product?.is_trending || false,
      is_offer: product?.is_offer || false,
      search_keywords: product?.search_keywords || '',
      images: product?.images || [],
      tags: product?.tags?.join(', ') || '',
    },
  });

  const images = watch('images');
  const nameVal = watch('name');

  useEffect(() => {
    if (!product) {
      setValue('slug', nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  }, [nameVal, product, setValue]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      price: Number(data.price),
      discount_price: data.discount_price !== '' ? Number(data.discount_price) : null,
      stock: Number(data.stock),
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    };

    let error;
    if (product) {
      ({ error } = await supabase.from('products').update(payload).eq('id', product.id));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    if (error) { toast.error(error.message); return; }
    toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-heading font-bold text-xl text-neutral-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name *</label>
              <input {...register('name', { required: true })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
              <input {...register('slug', { required: true })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
              <select {...register('category_id')} className="input">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" step="0.01" {...register('price', { required: true })} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Discount Price (Rs.)</label>
              <input type="number" step="0.01" {...register('discount_price')} className="input" placeholder="Leave empty if no discount" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Brand</label>
              <input {...register('brand')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">SKU</label>
              <input {...register('sku')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock</label>
              <input type="number" {...register('stock')} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
              <select {...register('status')} className="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Short Description</label>
              <textarea {...register('short_description')} rows={2} className="input resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Description</label>
              <textarea {...register('description')} rows={4} className="input resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tags (comma separated)</label>
              <input {...register('tags')} className="input" placeholder="e.g. sale, new, electronics" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Search Keywords</label>
              <input {...register('search_keywords')} className="input" />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            {[['is_featured', 'Featured'], ['is_trending', 'Trending'], ['is_offer', 'On Offer']].map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(field as keyof FormData)} className="rounded" />
                <span className="text-sm font-medium text-neutral-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Product Images</label>
            <ImageUpload value={images} onChange={urls => setValue('images', urls)} maxFiles={8} />
          </div>

          <div className="flex gap-3 pt-2 border-t border-neutral-100">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Save size={16} /> {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
