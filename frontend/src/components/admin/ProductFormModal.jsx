import { useEffect, useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { productsApi } from '@/services/api';
import ImageUpload from './ImageUpload';

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const [variants, setVariants] = useState(() => {
    if (product?.variants?.length) return product.variants.map(v => ({ name: v.name, price: v.price, discountPrice: v.discountPrice || '' }));
    if (product?.price) return [{ name: '', price: product.price, discountPrice: product.discountPrice || '' }];
    return [{ name: '', price: 0, discountPrice: '' }];
  });

  const [initialImages] = useState(() => {
    if (!product?.images) return [];
    return product.images.map((img, i) => {
      if (typeof img === 'object' && img !== null) return img;
      const publicId = product.imagePublicIds?.[i] || null;
      return publicId ? { url: img, publicId } : img;
    });
  });

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      shortDescription: product?.shortDescription || '',
      description: product?.description || '',
      category: product?.category?._id || product?.category || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      stock: product?.stock ?? 0,
      status: product?.status || 'active',
      isFeatured: product?.isFeatured || false,
      searchKeywords: product?.searchKeywords || '',
      images: initialImages,
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

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { name: '', price: 0, discountPrice: '' }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) { toast.error('At least one price option is required'); return; }
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const validateVariants = () => {
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.name.trim()) { toast.error(`Variant ${i + 1}: Name is required`); return false; }
      if (!v.price || Number(v.price) <= 0) { toast.error(`Variant "${v.name}": Price must be greater than 0`); return false; }
      if (v.discountPrice && Number(v.discountPrice) >= Number(v.price)) { toast.error(`Variant "${v.name}": Discount price must be less than original price`); return false; }
    }
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateVariants()) return;

    const imageUrls = (data.images || []).map(item => typeof item === 'string' ? item : item.url).filter(Boolean);
    const imagePublicIds = (data.images || []).map(item => typeof item === 'object' && item !== null ? item.publicId : null).filter(Boolean);

    const payload = {
      ...data,
      images: imageUrls,
      imagePublicIds,
      variants: variants.map(v => ({
        name: v.name.trim(),
        price: Number(v.price),
        discountPrice: v.discountPrice !== '' && v.discountPrice != null ? Number(v.discountPrice) : null,
      })),
      price: Number(variants[0]?.price) || 0,
      discountPrice: variants[0]?.discountPrice !== '' && variants[0]?.discountPrice != null ? Number(variants[0].discountPrice) : null,
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
              <input {...register('name', { required: true })} placeholder="e.g. Tapal Tea" className="input" />
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
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Brand</label>
              <input {...register('brand')} placeholder="e.g. Tapal, Brooke Bond" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">SKU</label>
              <input {...register('sku')} placeholder="e.g. TPL-250G" className="input" />
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
              <input {...register('tags')} className="input" placeholder="e.g. tea, grocery, essential" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Search Keywords</label>
              <input {...register('searchKeywords')} placeholder="e.g. tea, tapal, green tea" className="input" />
            </div>
          </div>

          {/* Price Options / Variants */}
          <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-neutral-800">Price Options *</label>
              <span className="text-xs text-neutral-400">{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Header - hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider px-1">
              <div className="col-span-5">Variant / Size</div>
              <div className="col-span-3">Price (Rs.) *</div>
              <div className="col-span-3">Discount Price (Rs.)</div>
              <div className="col-span-1" />
            </div>

            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                <div className="sm:col-span-5">
                  <label className="sm:hidden text-xs font-medium text-neutral-500 mb-1 block">Variant / Size</label>
                  <input
                    type="text"
                    value={v.name}
                    onChange={e => updateVariant(i, 'name', e.target.value)}
                    placeholder="e.g. 250g, Small, 500ml"
                    className="input text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="sm:hidden text-xs font-medium text-neutral-500 mb-1 block">Price (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={v.price || ''}
                    onChange={e => updateVariant(i, 'price', e.target.value)}
                    placeholder="e.g. 50"
                    className="input text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="sm:hidden text-xs font-medium text-neutral-500 mb-1 block">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={v.discountPrice || ''}
                    onChange={e => updateVariant(i, 'discountPrice', e.target.value)}
                    placeholder="Optional"
                    className="input text-sm"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end justify-center sm:justify-start pb-0.5">
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    disabled={variants.length <= 1}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:text-neutral-400 disabled:hover:bg-transparent"
                    title="Remove variant"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-neutral-300 rounded-xl text-sm font-medium text-neutral-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <Plus size={16} /> Add Price Option
            </button>
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
