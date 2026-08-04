import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `${settings.store_name} – ${settings.store_tagline}`; }, [settings]);

  return (
    <MainLayout>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProductsSection />
      <ReviewsSection />
      <ContactSection />
    </MainLayout>
  );
}
