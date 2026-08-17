import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">Admin Login</h1>
          <p className="text-primary-300 mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="msohaib.ai.dev@gmail.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3 text-base">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
            <Link to="/" className="text-sm text-primary-600 hover:underline">← Back to Store</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
