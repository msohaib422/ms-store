import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Award, Users, Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';

export default function AboutPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `About Us | ${settings.store_name}`; }, [settings]);
  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-primary-950 to-primary-700 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading font-extrabold text-4xl md:text-5xl mb-4">About {settings.store_name}</motion.h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">{settings.store_tagline}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="relative inline-block">
                <img
                  src="/images/IMG-20230525-WA0037.jpg"
                  alt="Shop Owner M. Sohaib"
                  className="w-72 h-80 object-cover object-top rounded-3xl shadow-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-heading font-bold text-neutral-900 text-sm">Trusted Seller</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider">Meet the Owner</span>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mt-2 mb-4">M. Sohaib</h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Welcome to <strong>{settings.store_name}</strong>! I'm M. Sohaib, the founder and owner. My mission is simple: to provide quality products at honest prices, with service you can trust.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Located at <strong>Street No. 8, Mohallah Hussain Nagar, 240 Mor, Jaranwala, Faisalabad</strong>, we serve our local community with dedication and pride.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6">
                Every product in our store is carefully selected to ensure the highest quality standards. Customer satisfaction is our top priority — always.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
                  <MessageCircle size={18} /> Chat with Us
                </a>
                <Link to="/contact" className="btn-secondary">Contact Us</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Values</h2>
            <div className="mt-3 h-1 w-14 bg-primary-600 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, color: 'bg-primary-100 text-primary-600', title: 'Authenticity', desc: 'Every product is 100% genuine.' },
              { icon: Heart, color: 'bg-red-100 text-red-600', title: 'Customer First', desc: 'Your satisfaction is our highest priority.' },
              { icon: Award, color: 'bg-accent-100 text-accent-600', title: 'Quality', desc: 'We source only the best products.' },
              { icon: Users, color: 'bg-secondary-100 text-secondary-600', title: 'Community', desc: 'Serving Jaranwala with pride.' },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}><Icon size={26} /></div>
                <h3 className="font-heading font-bold text-neutral-900 text-lg mb-2">{title}</h3>
                <p className="text-neutral-500 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-700 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['500+', 'Products'], ['1000+', 'Happy Customers'], ['5★', 'Rating'], ['24/7', 'Customer Support']].map(([value, label]) => (
              <div key={label}>
                <p className="font-heading font-extrabold text-4xl text-white">{value}</p>
                <p className="text-primary-200 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
