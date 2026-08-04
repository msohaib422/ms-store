import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cloudinary-upload`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  single?: boolean;
}

export default function ImageUpload({ value, onChange, maxFiles = 5, single = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ANON_KEY}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload returned no URL');
    return data.secure_url;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = single ? 1 : maxFiles - value.length;
    if (remaining <= 0) { toast.error(`Maximum ${maxFiles} images allowed`); return; }

    setUploading(true);
    const toUpload = Array.from(files).slice(0, remaining);
    const results: string[] = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} is too large (max 5MB)`); continue; }
      try {
        const url = await uploadFile(file);
        if (url) results.push(url);
      } catch (e) {
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

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {value.map((url, i) => (
          <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-neutral-200">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex">
              <X size={12} />
            </button>
          </div>
        ))}
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
      <p className="text-xs text-neutral-400">
        {single ? 'Upload 1 image (max 5MB)' : `Upload up to ${maxFiles} images (max 5MB each)`}
      </p>
    </div>
  );
}
