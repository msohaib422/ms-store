import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderOpen, Star, MessageSquare,
  Settings, LogOut, Menu, X, ShoppingBag, ChevronRight, Bell, User, UserCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import toast from 'react-hot-toast';
import NotificationDropdown from './NotificationDropdown';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Products', icon: Package, to: '/admin/products' },
  { label: 'Categories', icon: FolderOpen, to: '/admin/categories' },
  { label: 'Reviews', icon: Star, to: '/admin/reviews' },
  { label: 'Messages', icon: MessageSquare, to: '/admin/messages' },
  { label: 'Notifications', icon: Bell, to: '/admin/notifications' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/admin/login');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-neutral-800">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm">{settings.store_name}</p>
            <p className="text-neutral-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-neutral-500 text-xs uppercase tracking-widest font-medium mb-3 px-3">Menu</p>
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => {
            const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <li key={label}>
                <Link
                  to={to}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                >
                  <Icon size={18} />
                  {label}
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <Link to="/admin/profile" className="flex items-center gap-3 mb-3 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-neutral-400 text-xs truncate">{user?.email}</p>
          </div>
        </Link>
        <Link to="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white text-sm rounded-xl hover:bg-neutral-800 transition-colors mb-1">
          <ShoppingBag size={16} /> View Store
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 text-sm rounded-xl hover:bg-neutral-800 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }} className="fixed left-0 top-0 h-full w-64 bg-neutral-900 z-50 lg:hidden flex flex-col">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white"><X size={20} /></button>
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-6 h-16 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <Menu size={20} />
          </button>
          <h1 className="font-heading font-bold text-neutral-900 text-lg">{title}</h1>
          <div className="ml-auto flex items-center gap-3">
            <NotificationDropdown />
            <Link to="/admin/profile" className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
              <User size={14} className="text-white" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
