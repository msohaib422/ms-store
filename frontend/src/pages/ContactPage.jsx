import { useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, MessageCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import MainLayout from '@/components/layout/MainLayout';
import ContactSection from '@/components/home/ContactSection';

export default function ContactPage() {
  const { settings } = useSettings();
  useEffect(() => { document.title = `Contact | ${settings.store_name}`; }, [settings]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 py-14 px-4 text-white text-center">
        <h1 className="font-heading font-extrabold text-4xl mb-3">Contact Us</h1>
        <p className="text-primary-200 text-lg">We're here to help – reach out anytime</p>
      </div>
      <ContactSection />
      {settings.map_embed && (
        <div className="max-w-7xl mx-auto px-4 pb-14">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-neutral-100">
            <div className="flex flex-col lg:flex-row">
              {/* Map – 55% */}
              <div className="lg:w-[55%] h-72 lg:h-auto lg:min-h-[420px]">
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: settings.map_embed }} />
              </div>

              {/* Contact Info – 45% */}
              <div className="lg:w-[45%] p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-1">
                    {settings.store_name || 'Mehar Sajid Store'}
                  </h2>
                  <p className="text-neutral-500 text-sm mb-6">
                    We'd love to hear from you. Visit us or reach out anytime!
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Address</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{settings.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Opening Hours</p>
                        <p className="text-sm text-neutral-700">{settings.business_hours}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <Phone size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Phone / WhatsApp</p>
                        <a href={`tel:${settings.phone}`} className="text-sm text-neutral-700 hover:text-primary-600 transition-colors">{settings.phone}</a>
                        {settings.whatsapp && (
                          <a
                            href={`https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 transition-colors mt-0.5"
                          >
                            <MessageCircle size={13} /> Chat on WhatsApp
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                        <Mail size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Email</p>
                        <a href={`mailto:${settings.email}`} className="text-sm text-neutral-700 hover:text-primary-600 transition-colors">{settings.email}</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full justify-center py-3 text-sm"
                  >
                    <Navigation size={16} /> Get Directions
                  </a>
                  <p className="text-center text-xs text-neutral-400 leading-relaxed">
                    Have a question or want to place an order? Don't hesitate to reach out — we're always happy to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
