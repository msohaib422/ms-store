import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function ShippingPolicyPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Shipping Policy | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-extrabold text-4xl mb-3">Shipping Policy</motion.h1>
        <p className="text-primary-200 text-lg">Information about how we deliver your orders</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Truck, color: 'bg-primary-100 text-primary-600', title: 'Fast Delivery', desc: 'We dispatch orders within 1-2 business days.' },
                { icon: Clock, color: 'bg-accent-100 text-accent-600', title: 'Processing Time', desc: 'Orders placed before 2 PM are processed same day.' },
                { icon: MapPin, color: 'bg-red-100 text-red-600', title: 'Delivery Coverage', desc: 'We deliver across Pakistan including all major cities.' },
                { icon: Package, color: 'bg-secondary-100 text-secondary-600', title: 'Safe Packaging', desc: 'Every product is carefully packaged for safe delivery.' },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}><Icon size={22} /></div>
                  <div>
                    <h3 className="font-heading font-bold text-neutral-900 text-lg mb-1">{title}</h3>
                    <p className="text-neutral-500 text-sm">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Delivery Timeframes</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Estimated delivery times vary by location:
              </p>
              <ul className="text-neutral-600 leading-relaxed mb-4 space-y-2">
                <li><strong>Jaranwala / Faisalabad:</strong> 1-2 business days</li>
                <li><strong>Punjab (other cities):</strong> 2-4 business days</li>
                <li><strong>Sindh / KPK / Balochistan:</strong> 3-5 business days</li>
                <li><strong>Remote areas:</strong> 5-7 business days</li>
              </ul>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Shipping Charges</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Shipping charges are calculated based on your delivery location and order weight. The exact shipping cost will be displayed at checkout before you confirm your order.
              </p>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Order Tracking</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Once your order is dispatched, you will receive a notification via WhatsApp with your tracking details. You can also contact us anytime for order status updates.
              </p>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Contact Us</h2>
              <p className="text-neutral-600 leading-relaxed">
                For any shipping-related queries, reach out to us at <strong>{settings.email}</strong> or via WhatsApp at <strong>{settings.whatsapp}</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
