import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '@/services/api';
import { useSettings } from '@/context/SettingsContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';

const SECTIONS = [
  {
    title: 'Store Information',
    fields: [
      { key: 'store_name', label: 'Store Name', type: 'text' },
      { key: 'store_tagline', label: 'Tagline', type: 'text' },
      { key: 'store_description', label: 'Description', type: 'textarea' },
    ],
  },
  {
    title: 'Contact Details',
    fields: [
      { key: 'phone', label: 'Phone Number', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'business_hours', label: 'Business Hours', type: 'text' },
    ],
  },
  {
    title: 'Homepage Content',
    fields: [
      { key: 'hero_title', label: 'Hero Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    ],
  },
  {
    title: 'Social Media',
    fields: [
      { key: 'facebook', label: 'Facebook URL', type: 'url' },
      { key: 'instagram', label: 'Instagram URL', type: 'url' },
      { key: 'twitter', label: 'Twitter / X URL', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'whatsapp_url', label: 'WhatsApp URL', type: 'url' },
      { key: 'tiktok', label: 'TikTok URL', type: 'url' },
      { key: 'youtube', label: 'YouTube URL', type: 'url' },
    ],
  },
  {
    title: 'Google Maps',
    fields: [
      { key: 'map_embed', label: 'Google Maps Embed HTML', type: 'textarea' },
    ],
  },
];

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings();
  const [values, setValues] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setValues({ ...settings }); }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await settingsApi.update(values);
      refreshSettings();
      toast.success('Settings saved!');
    } catch (err) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl space-y-6">
        {SECTIONS.map(section => (
          <div key={section.title} className="card p-6">
            <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
                  {type === 'textarea'
                    ? <textarea value={values[key] || ''} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="input resize-none" rows={3} />
                    : <input type={type} value={values[key] || ''} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="input" />
                  }
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card p-6">
          <h2 className="font-heading font-semibold text-lg text-neutral-900 mb-4">Store Logo</h2>
          <ImageUpload
            value={values.logo_url ? [values.logo_url] : []}
            onChange={urls => setValues(v => ({ ...v, logo_url: urls[0] || '' }))}
            single
          />
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full justify-center py-3 text-base">
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </AdminLayout>
  );
}
