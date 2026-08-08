import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  useEffect(() => {
    document.title = `Privacy Policy | ${settings.store_name}`;
  }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading font-extrabold text-4xl mb-3"
        >
          Privacy Policy
        </motion.h1>

        <p className="text-primary-200 text-lg">
          How we collect, use, and protect your information
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
              1. Information We Collect
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              When you visit {settings.store_name}, we may collect basic
              information such as your name, phone number, email address,
              address, and other information you provide when placing an order
              or contacting us.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              2. How We Use Your Information?
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              We use the information we collect to process and manage your
              orders, communicate with you about your purchases, respond to
              your questions, improve our website and services, and maintain
              the security of our website.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              3. Information Sharing
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              We do not sell, rent, or trade your personal information. We may
              only share information when necessary to provide our services,
              process an order, comply with legal requirements, or protect the
              security and rights of our business and customers.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              4. Data Security
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              We take reasonable measures to protect your personal information
              from unauthorized access, misuse, alteration, or disclosure.
              However, no method of storing or transmitting information online
              is completely secure.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              5. Cookies
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              Our website may use cookies and similar technologies to improve
              your browsing experience, remember preferences, and understand
              how visitors use our website. You can manage or disable cookies
              through your browser settings.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              6. Your Rights
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              You may contact us if you want to ask about the personal
              information we have collected from you or request that inaccurate
              information be corrected or deleted where applicable.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              7. Website Accounts
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-4">
              {settings.store_name} does not currently require customers to
              create an account or log in to browse products or place orders.
              We only collect information that you voluntarily provide when
              making an inquiry, placing an order via Whatsapp, or contacting us.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              8. Contact Us
            </h2>

            <p className="text-neutral-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at <strong>{settings.email}</strong> or reach out via
              WhatsApp at <strong>{settings.whatsapp}</strong>.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}