import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, deleteImage } from '@/services/api';

function getImageUrl(item) {
  return typeof item === 'string' ? item : item?.url || '';
}

function getImagePublicId(item) {
  return typeof item === 'object' && item !== null ? item.publicId || null : null;
}

export default function ImageUpload({ value = [], onChange, maxFiles = 5, single = false }) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const remaining = single ? 1 : maxFiles - value.length;
    if (remaining <= 0) { toast.error(`Maximum ${maxFiles} images allowed`); return; }

    setUploading(true);
    const toUpload = Array.from(files).slice(0, remaining);
    const results = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} is too large (max 5MB)`); continue; }
      try {
        const { url, publicId } = await uploadFile(file);
        results.push({ url, publicId });
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (results.length > 0) {
      onChange(single ? results : [...value, ...results]);
      toast.success(`${results.length} image(s) uploaded`);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = async (i) => {
    const item = value[i];
    const publicId = getImagePublicId(item);

    if (publicId) {
      setRemoving(i);
      try {
        await deleteImage(publicId);
      } catch {
        toast.error('Failed to delete image from Cloudinary');
      }
      setRemoving(null);
    }

    onChange(value.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {value.map((item, i) => {
          const url = getImageUrl(item);
          return (
            <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-neutral-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={removing === i}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex disabled:opacity-50"
              >
                {removing === i ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
              </button>
            </div>
          );
        })}
        {(single ? value.length === 0 : value.length < maxFiles) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary-400 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-primary-500 transition-colors"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            <span className="text-xs">{uploading ? 'Uploading...' : 'Add Image'}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple={!single} onChange={e => handleFiles(e.target.files)} className="hidden" />
      <p className="text-xs text-neutral-400">{single ? 'Upload 1 image (max 5MB)' : `Up to ${maxFiles} images (max 5MB each)`}</p>
    </div>
  );
}
