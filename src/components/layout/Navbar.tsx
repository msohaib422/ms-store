import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Phone, ChevronDown, ShoppingBag } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';

export default function Navbar() {
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; slug: string; images: string[] }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catDropdown, setCatDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    supabase.from('categories').select('*').eq('status', 'active').order('display_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, images')
        .eq('status', 'active')
        .ilike('name', `%${searchQuery}%`)
        .limit(5);
      setSearchResults(data || []);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Offers', to: '/offers' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Visit us: Street No. 8, Mohallah Hussain Nagar, Jaranwala</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-primary-200 transition-colors">
              <Phone size={12} /> {settings.phone}
            </a>
            <span>|</span>
            <a href={`mailto:${settings.email}`} className="hover:text-primary-200 transition-colors">{settings.email}</a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.store_name} className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={20} className="text-white" />
                  </div>
                  <span className="font-heading font-bold text-xl text-primary-700">{settings.store_name}</span>
                </div>
              )}
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                link.label === 'Products' ? (
                  <div key={link.label} className="relative" onMouseEnter={() => setCatDropdown(true)} onMouseLeave={() => setCatDropdown(false)}>
                    <Link to={link.to} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}>
                      {link.label} <ChevronDown size={14} className={`transition-transform ${catDropdown ? 'rotate-180' : ''}`} />
                    </Link>
                    <AnimatePresence>
                      {catDropdown && categories.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-card-hover border border-neutral-100 py-2 mt-1">
                          <Link to="/products" className="block px-4 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600">All Products</Link>
                          <div className="border-t border-neutral-100 my-1" />
                          {categories.slice(0, 8).map(cat => (
                            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="block px-4 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600">{cat.name}</Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.label} to={link.to} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(s => !s)} className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                <Search size={20} />
              </button>
              <button onClick={() => setMenuOpen(s => !s)} className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} ref={searchRef} className="overflow-hidden border-t border-neutral-100">
                <div className="py-3 relative">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); }}}
                      placeholder="Search products…"
                      className="input pl-10 pr-4"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full bg-white border border-neutral-200 rounded-xl shadow-card-hover z-50 mt-1 overflow-hidden">
                      {searchResults.map(p => (
                        <Link key={p.id} to={`/products/${p.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors">
                          <img src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=60'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium text-neutral-700">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  <Link key={link.label} to={link.to} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-primary-600 bg-primary-50' : 'text-neutral-700 hover:bg-neutral-50'}`}>
                    {link.label}
                  </Link>
                ))}
                {categories.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100">
                    <p className="px-4 text-xs text-neutral-400 font-medium uppercase tracking-wider mb-2">Categories</p>
                    {categories.map(cat => (
                      <Link key={cat.id} to={`/products?category=${cat.slug}`} className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl">{cat.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
