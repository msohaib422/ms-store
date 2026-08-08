import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function TermsOfServicePage() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = `Terms of Service | ${settings.store_name}`;
  }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading font-extrabold text-4xl mb-3"
        >
          Terms of Service
        </motion.h1>

        <p className="text-primary-200 text-lg">
          Terms and conditions governing your use of our store
        </p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-neutral max-w-none"
          >
            <p className="text-neutral-500 text-sm mb-6">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              By accessing and using {settings.store_name}, you agree to comply
              with these Terms of Service. If you do not agree with any part of
              these terms, contact us at <strong>{settings.email}</strong> or via WhatsApp at <strong>{settings.whatsapp}</strong>.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              2. Products and Pricing
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We make reasonable efforts to ensure that product information,
              descriptions, images, and prices displayed on our website are
              accurate. However, errors or changes may occasionally occur.
              Product availability and prices may change without prior notice.
              We reserve the right to update, modify, or discontinue products
              at any time.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              3. Purchases and Payment
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Product information and prices displayed on our website are
              provided for informational purposes. Purchases are made directly
              at {settings.store_name} through our physical store. Payment is
              completed at the store using the available payment methods.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              4. Returns and Refunds
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Eligible products may be returned or exchanged within 7 days of
              purchase, provided they are unused and in their original
              condition and packaging. Returns, exchanges, and refunds are
              handled exclusively through a physical visit to{' '}
              {settings.store_name}. Customers may contact us before visiting
              regarding the eligibility of an item for return or refund.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              5. User Conduct
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              You agree not to use our website for any unlawful or unauthorized
              purpose, attempt to gain unauthorized access to any part of the
              website, or interfere with its operation, security, or proper
              functioning.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              {settings.store_name} shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              from the use of, or inability to use, our website or products, to
              the extent permitted by applicable law.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              7. Changes to These Terms
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We reserve the right to update or modify these Terms of Service at
              any time. Any changes will be posted on this page. Continued use
              of the website after changes are posted constitutes acceptance of
              the updated terms.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              8. Contact Us
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              If you have any questions regarding these Terms of Service, please
              contact us at <strong>{settings.email}</strong> or via WhatsApp at{' '}
              <strong>{settings.whatsapp}</strong>.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
