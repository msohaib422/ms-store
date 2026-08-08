import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle, ShoppingBag, Clock, Heart } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* CTA strip */}
      <div className="bg-primary-800 border-b border-primary-600/30">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-heading font-bold text-xl">Visit Our Store Today</h3>
            <p className="text-primary-200 text-sm mt-0.5">Browse our full range of quality products</p>
          </div>
          <div className="flex gap-3">
            <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <Link to="/products" className="flex items-center gap-2 bg-white hover:bg-primary-50 text-primary-700 font-medium px-5 py-2.5 rounded-xl transition-colors">
              <ShoppingBag size={18} /> View Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">{settings.store_name}</span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">{settings.store_description}</p>
            <div className="flex gap-3 mt-5">
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"><Facebook size={16} /></a>}
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 bg-neutral-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"><Instagram size={16} /></a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 bg-neutral-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-colors"><Twitter size={16} /></a>}
              {settings.youtube && <a href={settings.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 bg-neutral-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"><Youtube size={16} /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['Products', '/products'], ['Categories', '/products'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4">Information</h4>
            <ul className="space-y-2.5">
              {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['About Us', '/about'], ['Contact Us', '/contact']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 text-sm hover:text-primary-400 transition-colors">
                  <Phone size={15} className="text-primary-400 shrink-0" /> {settings.phone}
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm hover:text-green-400 transition-colors">
                  <MessageCircle size={15} className="text-green-400 shrink-0" /> {settings.whatsapp} (WhatsApp)
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2.5 text-sm hover:text-primary-400 transition-colors">
                  <Mail size={15} className="text-primary-400 shrink-0" /> {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={15} className="text-primary-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Clock size={15} className="text-primary-400 shrink-0" /> {settings.business_hours}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <span>© {year} {settings.store_name}. All rights reserved.</span>
          <span className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500 fill-red-500" /> in Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
