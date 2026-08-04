import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { supabase, type Offer } from '@/lib/supabase';

export default function OffersStrip() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    supabase.from('offers').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => setOffers(data || []));
  }, []);

  if (offers.length === 0) return null;

  return (
    <section className="py-14 bg-gradient-to-r from-accent-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-shadow border border-neutral-100"
            >
              {offer.banner_url && (
                <img src={offer.banner_url} alt={offer.title} className="w-full h-36 object-cover" />
              )}
              {!offer.banner_url && (
                <div className="h-36 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                  <span className="text-white text-5xl font-extrabold opacity-20">{offer.discount_percentage}%</span>
                </div>
              )}
              <div className="p-5">
                {offer.badge_text && (
                  <span className="badge bg-accent-100 text-accent-700 font-semibold mb-2">{offer.badge_text}</span>
                )}
                <h3 className="font-heading font-bold text-neutral-800 text-lg">{offer.title}</h3>
                {offer.description && <p className="text-neutral-500 text-sm mt-1">{offer.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  {offer.discount_percentage > 0 && (
                    <span className="text-2xl font-extrabold text-primary-600">{offer.discount_percentage}% OFF</span>
                  )}
                  {offer.expiry_date && (
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <Clock size={12} />
                      Ends {new Date(offer.expiry_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Link to="/products?offer=true" className="mt-4 flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Shop Now <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
