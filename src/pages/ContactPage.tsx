import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';
import ContactSection from '@/components/home/ContactSection';

export default function ContactPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Contact | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <h1 className="font-heading font-extrabold text-4xl mb-3">Contact Us</h1>
        <p className="text-primary-200 text-lg">We're here to help – reach out anytime</p>
      </div>
      <ContactSection />
      {settings.map_embed && (
        <div className="max-w-7xl mx-auto px-4 pb-14">
          <div className="rounded-2xl overflow-hidden shadow-card" dangerouslySetInnerHTML={{ __html: settings.map_embed }} />
        </div>
      )}
    </MainLayout>
  );
}
