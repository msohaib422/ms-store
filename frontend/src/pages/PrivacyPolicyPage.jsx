import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Privacy Policy | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-extrabold text-4xl mb-3">Privacy Policy</motion.h1>
        <p className="text-primary-200 text-lg">How we collect, use, and protect your information</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-neutral max-w-none">
            <p className="text-neutral-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">1. Information We Collect</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              When you visit {settings.store_name}, we may collect certain information including your name, email address, phone number, contact address, and payment details. This information is collected when you place an order, create an account, or contact us.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We use the information we collect to process and fulfill your orders, communicate with you about your purchases, send you promotional materials (with your consent), improve our store and services, and comply with legal obligations.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">3. Information Sharing</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our store, processing payments, and fulfilling orders. These providers are obligated to keep your information confidential.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">4. Data Security</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">5. Cookies</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Our store may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect your ability to use certain features of our store.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">6. Your Rights</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us through our contact page or via WhatsApp.
            </p>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">7. Contact Us</h2>
            <p className="text-neutral-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <strong>{settings.email}</strong> or reach out via WhatsApp at <strong>{settings.whatsapp}</strong>.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
