import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import ProductsSection from '@/components/home/ProductsSection';
import OffersStrip from '@/components/home/OffersStrip';
import ReviewsSection from '@/components/home/ReviewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = `${settings.store_name} – ${settings.store_tagline}`;
  }, [settings]);

  return (
    <MainLayout>
      <HeroSection />
      <FeaturedCategories />
      <ProductsSection
        title="Featured Products"
        subtitle="Hand-picked products just for you"
        filter={{ column: 'is_featured', value: true }}
        limit={8}
        viewAllLink="/products?featured=true"
      />
      <OffersStrip />
      <ProductsSection
        title="Trending Now"
        subtitle="What everyone is buying this week"
        filter={{ column: 'is_trending', value: true }}
        limit={8}
        viewAllLink="/products?trending=true"
      />
      <ProductsSection
        title="Latest Products"
        subtitle="Fresh additions to our store"
        filter={{ column: 'status', value: 'active' }}
        limit={8}
        viewAllLink="/products"
      />
      <ReviewsSection />
      <ContactSection />
    </MainLayout>
  );
}
