import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-primary-500" />
          </div>
          <h1 className="font-heading font-extrabold text-8xl text-primary-200 leading-none">404</h1>
          <h2 className="font-heading font-bold text-2xl text-neutral-800 mt-4">Page Not Found</h2>
          <p className="text-neutral-500 mt-2 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-primary"><ArrowLeft size={16} /> Go Home</Link>
            <Link to="/products" className="btn-secondary"><ShoppingBag size={16} /> Shop Products</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
