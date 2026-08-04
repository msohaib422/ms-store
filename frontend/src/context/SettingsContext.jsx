import { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi } from '@/services/api';

const defaults = {
  store_name: 'M.S. Store',
  store_tagline: 'Your Trusted Shopping Destination',
  store_description: 'We offer a wide range of quality products at the best prices.',
  phone: '03046428782',
  whatsapp: '03249503305',
  email: 'msohaib422@gmail.com',
  address: 'Street No. 8, Mohallah Hussain Nagar, 240 Mor, Jaranwala, Faisalabad, Punjab, Pakistan',
  business_hours: 'Mon–Sun: 6:00 AM – 9:00 PM',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  logo_url: '',
  hero_title: 'Quality Products, Unbeatable Prices',
  hero_subtitle: 'Discover our wide range of premium products curated just for you',
  map_embed: '',
};

const SettingsContext = createContext({ settings: defaults, refreshSettings: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  const fetchSettings = () => {
    settingsApi.get()
      .then(res => setSettings({ ...defaults, ...res.data.data.settings }))
      .catch(() => {});
  };

  useEffect(() => { fetchSettings(); }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
