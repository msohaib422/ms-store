import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function ReturnPolicyPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Return Policy | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-extrabold text-4xl mb-3">Return Policy</motion.h1>
        <p className="text-primary-200 text-lg">Our hassle-free return and refund process</p>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: RotateCcw, color: 'bg-primary-100 text-primary-600', title: '7-Day Returns', desc: 'You can return items within 7 days of purchase.' },
                { icon: CheckCircle, color: 'bg-green-100 text-green-600', title: 'Easy Process', desc: 'Contact us via WhatsApp to initiate a return.' },
                { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600', title: 'Conditions Apply', desc: 'Items must be unused and in original packaging.' },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                  <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}><Icon size={26} /></div>
                  <h3 className="font-heading font-bold text-neutral-900 text-lg mb-2">{title}</h3>
                  <p className="text-neutral-500 text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">How to Return an Item</h2>
              <ol className="text-neutral-600 leading-relaxed mb-4 space-y-2">
                <li>Contact us via WhatsApp at <strong>{settings.whatsapp}</strong> within 7 days of receiving your order.</li>
                <li>Provide your order number and reason for return.</li>
                <li>Our team will review your request and provide return instructions.</li>
                <li>Pack the item securely in its original packaging.</li>
                <li>Once we receive and inspect the item, your refund will be processed.</li>
              </ol>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Eligible Items</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Items are eligible for return if they are unused, undamaged, and in their original packaging with all tags attached. The following items may not be eligible for return: opened software, personal care items, and clearance/sale items.
              </p>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Refund Process</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Refunds will be processed within 3-5 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method or as store credit, depending on your preference.
              </p>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Damaged or Wrong Items</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                If you receive a damaged or incorrect item, please contact us immediately with photos of the issue. We will arrange a free return and send you the correct item or a full refund.
              </p>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Non-Returnable Items</h2>
              <div className="flex items-start gap-3 mb-4">
                <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <ul className="text-neutral-600 leading-relaxed space-y-1">
                  <li>Items that have been used, washed, or altered</li>
                  <li>Items without original packaging or tags</li>
                  <li>Items returned after the 7-day return window</li>
                  <li>Gift cards and digital products</li>
                </ul>
              </div>

              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">Contact Us</h2>
              <p className="text-neutral-600 leading-relaxed">
                For any return or refund queries, reach out to us at <strong>{settings.email}</strong> or via WhatsApp at <strong>{settings.whatsapp}</strong>. We're here to help!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
