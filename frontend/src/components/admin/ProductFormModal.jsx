import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { productsApi } from '@/services/api';
import ImageUpload from './ImageUpload';

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      shortDescription: product?.shortDescription || '',
      description: product?.description || '',
      price: product?.price || 0,
      discountPrice: product?.discountPrice || '',
      category: product?.category?._id || product?.category || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      stock: product?.stock ?? 0,
      status: product?.status || 'active',
      isFeatured: product?.isFeatured || false,
      searchKeywords: product?.searchKeywords || '',
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

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      discountPrice: data.discountPrice !== '' ? Number(data.discountPrice) : null,
      stock: Number(data.stock),
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    try {
      if (product) await productsApi.update(product._id, payload);
      else await productsApi.create(payload);
      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      onSaved();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4 sm:my-8">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
          <h2 className="font-heading font-bold text-lg sm:text-xl text-neutral-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name *</label>
              <input {...register('name', { required: true })} placeholder="e.g. Wireless Bluetooth Headphones" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
              <input {...register('slug', { required: true })} placeholder="auto-generated-from-name" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
              <select {...register('category')} className="input">
                <option value="">Select a category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" step="0.01" {...register('price', { required: true })} placeholder="e.g. 1500" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Discount Price (Rs.)</label>
              <input type="number" step="0.01" {...register('discountPrice')} className="input" placeholder="Leave empty for no discount" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Brand</label>
              <input {...register('brand')} placeholder="e.g. Samsung, Sony" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">SKU</label>
              <input {...register('sku')} placeholder="e.g. WBH-2024-BLK" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock</label>
              <input type="number" {...register('stock')} placeholder="e.g. 50" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Status</label>
              <select {...register('status')} className="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Short Description</label>
              <textarea {...register('shortDescription')} rows={2} placeholder="Brief summary shown in product listings" className="input resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Description</label>
              <textarea {...register('description')} rows={4} placeholder="Detailed product description with features and specifications" className="input resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tags (comma separated)</label>
              <input {...register('tags')} className="input" placeholder="e.g. sale, new, electronics" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Search Keywords</label>
              <input {...register('searchKeywords')} placeholder="e.g. headphones, wireless, bluetooth" className="input" />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="rounded" />
              <span className="text-sm font-medium text-neutral-700">Featured</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Product Images</label>
            <ImageUpload value={images} onChange={urls => setValue('images', urls)} maxFiles={8} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-neutral-100">
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto justify-center">
              <Save size={16} /> {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary w-full sm:w-auto justify-center">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
