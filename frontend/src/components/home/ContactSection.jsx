import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { messagesApi } from '@/services/api';
import { useSettings } from '@/context/SettingsContext';
import SectionHeader from '@/components/common/SectionHeader';

export default function ContactSection() {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await messagesApi.create(data);
      setSubmitted(true);
      reset();
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    }
  };

  const waUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader title="Get in Touch" subtitle="We'd love to hear from you. Send us a message or contact us directly." center />
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: MessageCircle, color: 'bg-green-100 text-green-600', label: 'WhatsApp', value: settings.whatsapp, href: waUrl, hoverClass: 'hover:text-green-600' },
              { icon: Phone, color: 'bg-primary-100 text-primary-600', label: 'Phone', value: settings.phone, href: `tel:${settings.phone}`, hoverClass: 'hover:text-primary-600' },
              { icon: Mail, color: 'bg-accent-100 text-accent-600', label: 'Email', value: settings.email, href: `mailto:${settings.email}`, hoverClass: 'hover:text-accent-600' },
              { icon: MapPin, color: 'bg-neutral-100 text-neutral-600', label: 'Address', value: settings.address, href: null, hoverClass: '' },
              { icon: Clock, color: 'bg-neutral-100 text-neutral-600', label: 'Hours', value: settings.business_hours, href: null, hoverClass: '' },
            ].map(({ icon: Icon, color, label, value, href, hoverClass }) => (
              <div key={label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`text-sm ${hoverClass} transition-colors`}>{value}</a>
                  ) : (
                    <p className="text-neutral-500 text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="card p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircle size={56} className="text-secondary-500 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-neutral-800">Message Sent!</h3>
                <p className="text-neutral-500 mt-2">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary mt-6">Send Another Message</button>
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
                <p className="text-xs text-neutral-400 text-center">Your message will be sent directly to our team</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
