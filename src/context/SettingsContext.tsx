import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Settings {
  store_name: string;
  store_tagline: string;
  store_description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  map_embed: string;
  [key: string]: string;
}

const defaultSettings: Settings = {
  store_name: '',
  store_tagline: 'Your Trusted Shopping Destination',
  store_description: 'We offer a wide range of quality products at the best prices.',
  phone: '03046428782',
  whatsapp: '03249503305',
  email: 'www.msohaib422@gmail.com',
  address: 'Pakistan',
  business_hours: 'Mon - Sat: 9:00 AM - 9:00 PM',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  logo_url: '',
  hero_title: 'Quality Products, Unbeatable Prices',
  hero_subtitle: 'Discover our wide range of premium products curated just for you',
  map_embed: '',
};

const CACHE_KEY = 'ms_store_settings';

function loadCachedSettings(): Settings | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}
  return null;
}

function saveSettingsCache(data: Settings) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const cached = loadCachedSettings();
  const [settings, setSettings] = useState<Settings>(cached ? { ...defaultSettings, ...cached } : defaultSettings);
  const [loading, setLoading] = useState(!cached);

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('key, value');
    if (data) {
      const map = { ...defaultSettings };
      data.forEach(({ key, value }) => { if (value !== null) map[key] = value; });
      setSettings(map);
      saveSettingsCache(map);
    }
    setLoading(false);
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
