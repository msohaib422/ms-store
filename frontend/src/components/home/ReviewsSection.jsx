import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviewsApi } from '@/services/api';
import SectionHeader from '@/components/common/SectionHeader';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    reviewsApi.getAll({ approved: 'true' })
      .then(res => setReviews(res.data.data.reviews.slice(0, 6)))
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-primary-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="What Our Customers Say" subtitle="Real reviews from happy shoppers" center />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div key={review._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6">
              <Quote size={28} className="text-primary-200 mb-3" />
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">"{review.review}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-neutral-800 text-sm">{review.customerName}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200 fill-neutral-200'} />)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-heading font-bold text-primary-600">
                  {review.customerName.charAt(0).toUpperCase()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
