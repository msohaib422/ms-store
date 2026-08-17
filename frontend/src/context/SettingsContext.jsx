import { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '@/services/api';

const defaults = {
  store_name: '',
  store_tagline: 'Your Trusted Shopping Destination',
  store_description: 'We offer a wide range of quality products at the best prices.',
  phone: '03046428782',
  whatsapp: '03249503305',
  email: 'msohaib.ai.dev@gmail.com',
  address: 'Street No. 8, Mohallah Hussain Nagar, 240 Mor, Jaranwala, Faisalabad, Punjab, Pakistan',
  business_hours: 'Mon–Sun: 6:00 AM – 9:00 PM',
  facebook: '',
  instagram: '',
  twitter: '',
  linkedin: '',
  tiktok: '',
  whatsapp_url: '',
  youtube: '',
  logo_url: '',
  hero_title: 'Quality Products, Unbeatable Prices',
  hero_subtitle: 'Discover our wide range of premium products curated just for you',
  map_embed: '',
};

const CACHE_KEY = 'ms_store_settings';

function loadCachedSettings() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}
  return null;
}

function saveSettingsCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

const SettingsContext = createContext({ settings: defaults, loading: true, refreshSettings: () => {} });

export function SettingsProvider({ children }) {
  const cached = loadCachedSettings();
  const [settings, setSettings] = useState(cached ? { ...defaults, ...cached } : defaults);
  const [loading, setLoading] = useState(!cached);

  const fetchSettings = () => {
    settingsApi.get()
      .then(res => {
        const fresh = { ...defaults, ...res.data.data.settings };
        setSettings(fresh);
        saveSettingsCache(fresh);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSettings(); }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
