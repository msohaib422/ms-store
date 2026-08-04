import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Phone, ChevronDown, ShoppingBag } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { categoriesApi, productsApi } from '@/services/api';

export default function Navbar() {
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catDropdown, setCatDropdown] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchDebounce = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    categoriesApi.getAll('active')
      .then(res => setCategories(res.data.data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      productsApi.search(searchQuery)
        .then(res => setSearchResults(res.data.data.products))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(searchDebounce.current);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products', hasDropdown: true },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

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
            <span>{settings.business_hours}</span>
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
                link.hasDropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setCatDropdown(true)}
                    onMouseLeave={() => setCatDropdown(false)}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${catDropdown ? 'rotate-180' : ''}`} />
                    </Link>

                    <AnimatePresence>
                      {catDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-card-hover border border-neutral-100 py-2 mt-1 z-50"
                        >
                          <Link
                            to="/products"
                            onClick={() => setCatDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium"
                          >
                            <ShoppingBag size={14} /> All Products
                          </Link>
                          {categories.length > 0 && (
                            <div className="border-t border-neutral-100 my-1" />
                          )}
                          {categories.slice(0, 8).map(cat => (
                            <Link
                              key={cat._id}
                              to={`/products?category=${cat.slug}`}
                              onClick={() => setCatDropdown(false)}
                              className="block px-4 py-2.5 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                          {categories.length === 0 && (
                            <p className="px-4 py-2 text-xs text-neutral-400">No categories yet</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'}`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Right */}
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
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-neutral-100"
              >
                <div className="py-3 relative">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                          setSearchOpen(false);
                        }
                      }}
                      placeholder="Search products…"
                      className="input pl-10 pr-4 h-10"
                    />
                  </div>
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute left-0 right-0 top-full bg-white border border-neutral-200 rounded-xl shadow-card-hover z-50 mt-1 overflow-hidden"
                      >
                        {searchResults.map(p => (
                          <Link
                            key={p._id}
                            to={`/products/${p.slug}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
                          >
                            <img
                              src={p.images?.[0] || 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?w=60'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="text-sm font-medium text-neutral-700">{p.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(link => (
                  link.hasDropdown ? (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileCatOpen(s => !s)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.to) ? 'text-primary-600 bg-primary-50' : 'text-neutral-700 hover:bg-neutral-50'}`}
                      >
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileCatOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            <Link to="/products" className="block px-4 py-2 text-sm text-primary-600 hover:bg-neutral-50 rounded-xl">All Products</Link>
                            {categories.map(cat => (
                              <Link key={cat._id} to={`/products?category=${cat.slug}`} className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl">{cat.name}</Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(link.to) ? 'text-primary-600 bg-primary-50' : 'text-neutral-700 hover:bg-neutral-50'}`}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
