import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/context/SettingsContext';
import SectionHeader from '@/components/common/SectionHeader';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.from('messages').insert(data);
    if (error) { toast.error('Failed to send message. Please try again.'); return; }
    setSubmitted(true);
    reset();
    toast.success('Message sent successfully!');
  };

  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Get in Touch" subtitle="We'd love to hear from you. Send us a message or contact us directly." center />

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle size={22} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">WhatsApp</p>
                <a href={waUrl} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-sm">{settings.whatsapp}</a>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={22} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Phone</p>
                <a href={`tel:${settings.phone}`} className="text-primary-600 hover:underline text-sm">{settings.phone}</a>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={22} className="text-accent-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Email</p>
                <a href={`mailto:${settings.email}`} className="text-accent-600 hover:underline text-sm">{settings.email}</a>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-neutral-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Address</p>
                <p className="text-neutral-500 text-sm">{settings.address}</p>
              </div>
            </div>
            <div className="card p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={22} className="text-neutral-600" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Business Hours</p>
                <p className="text-neutral-500 text-sm">{settings.business_hours}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircle size={56} className="text-secondary-500 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-neutral-800">Message Sent!</h3>
                <p className="text-neutral-500 mt-2">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Name *</label>
                    <input {...register('name', { required: true })} className={`input ${errors.name ? 'border-red-400' : ''}`} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email *</label>
                    <input {...register('email', { required: true })} type="email" className={`input ${errors.email ? 'border-red-400' : ''}`} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
                    <input {...register('phone')} className="input" placeholder="03xxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
                    <input {...register('subject')} className="input" placeholder="Order inquiry" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message *</label>
                  <textarea {...register('message', { required: true })} rows={5} className={`input resize-none ${errors.message ? 'border-red-400' : ''}`} placeholder="Write your message here..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                  {isSubmitting ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
