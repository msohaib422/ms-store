import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function TermsOfServicePage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Terms of Service | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-extrabold text-4xl mb-3">Terms of Service</motion.h1>
        <p className="text-primary-200 text-lg">Terms and conditions governing your use of our store</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-neutral max-w-none">
            <p className="text-neutral-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              By accessing and using {settings.store_name}, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our store.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">2. Products and Pricing</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              All products displayed on our store are subject to availability. We reserve the right to discontinue any product at any time. Prices for products are subject to change without notice. We shall not be liable to you or any third party for any modification, price change, or discontinuation.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">3. Orders and Payment</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              When you place an order, you are making an offer to purchase the product. We reserve the right to accept or decline any order. Payment must be received in full before we process your order. We accept payment via Cash on Delivery (COD) and other methods as displayed at checkout.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">4. Returns and Refunds</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We accept returns within 7 days of purchase for eligible items. Items must be unused and in their original packaging.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">5. User Conduct</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              You agree not to use our store for any unlawful purpose, to attempt to gain unauthorized access to any portion of the store, or to interfere with the proper working of the store.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">6. Limitation of Liability</h2>
            <p className="text-neutral-600 leading-relaxed">
              {settings.store_name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our store or products.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
