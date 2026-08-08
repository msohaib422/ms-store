import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { supabase, type Offer } from '@/lib/supabase';
import MainLayout from '@/components/layout/MainLayout';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Offers & Deals';
    supabase.from('offers').select('*').eq('status', 'active').order('created_at', { ascending: false })
      .then(({ data }) => { setOffers(data || []); setLoading(false); });
  }, []);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-accent-600 to-primary-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl mb-3">Exclusive Offers & Deals</h1>
          <p className="text-white/80 text-lg">Limited time discounts – grab them before they're gone!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? <LoadingSpinner /> : offers.length === 0 ? (
          <EmptyState title="No active offers" description="Check back soon for exciting deals!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="card overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  {offer.banner_url ? (
                    <img src={offer.banner_url} alt={offer.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-700 to-accent-600 flex items-center justify-center">
                      <span className="text-white text-7xl font-extrabold opacity-20">{offer.discount_percentage}%</span>
                    </div>
                  )}
                  {offer.badge_text && (
                    <span className="absolute top-3 left-3 badge bg-accent-500 text-white font-bold">{offer.badge_text}</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-neutral-900">{offer.title}</h3>
                  {offer.description && <p className="text-neutral-500 text-sm mt-2">{offer.description}</p>}
                  <div className="flex items-center justify-between mt-4">
                    {offer.discount_percentage > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-accent-600" />
                        <span className="text-2xl font-extrabold text-accent-600">{offer.discount_percentage}% OFF</span>
                      </div>
                    )}
                    {offer.expiry_date && (
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock size={12} />
                        Expires {new Date(offer.expiry_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Link to="/products?offer=true" className="btn-primary mt-4 w-full justify-center">
                    Shop This Offer <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
