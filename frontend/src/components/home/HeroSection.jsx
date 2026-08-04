import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, MessageCircle, Star, Shield, CheckCircle, Headphones } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function HeroSection() {
  const { settings } = useSettings();
  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 min-h-[88vh] flex items-center">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-sm mb-6">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              Trusted by customers in Jaranwala, Faisalabad
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {settings.hero_title}
            </h1>
            <p className="text-primary-200 text-lg md:text-xl mt-5 leading-relaxed">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/products" className="flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                <ShoppingBag size={20} /> Browse Products
              </Link>
              <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg">
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-white/70 text-sm">
              <div className="flex items-center gap-2"><Shield size={16} className="text-primary-300" /> Authentic products</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-300" /> Quality assured</div>
              <div className="flex items-center gap-2"><Headphones size={16} className="text-primary-300" /> 24/7 Support</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-3xl blur-xl transform scale-110" />
              <img
                src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Store products"
                className="relative w-full rounded-3xl shadow-2xl object-cover h-[460px]"
              />
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={22} className="text-secondary-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Quality Assured</p>
                  <p className="font-heading font-bold text-neutral-900 text-sm">500+ Products</p>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="font-heading font-bold text-neutral-900 text-sm">Top Rated</p>
                <p className="text-xs text-neutral-400">Jaranwala, Faisalabad</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Authentic Products', sub: '100% Genuine' },
              { icon: CheckCircle, label: 'Quality Checked', sub: 'Every item verified' },
              { icon: Headphones, label: '24/7 Support', sub: 'Always available' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 text-white">
                <Icon size={20} className="text-primary-200 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-white/60">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
