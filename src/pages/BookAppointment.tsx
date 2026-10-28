import React from 'react';
import { motion } from 'motion/react';
import { AppointmentForm } from '../components/AppointmentForm';
import { Calendar, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const BookAppointmentPage = () => {
  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-navy pt-10 pb-16 md:pt-12 md:pb-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Secure Your Consultation
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Professional legal guidance starts with a conversation. Choose a time that works for you.
          </p>
        </div>
      </section>

      <section className="py-24 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AppointmentForm />
            </div>
            
            <div className="space-y-8">
              <div className="bg-brand-navy p-10 text-white shadow-2xl">
                <h3 className="text-xl font-serif font-bold mb-8 text-brand-gold uppercase tracking-widest">Why Consult With Us?</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <ShieldCheck className="text-brand-gold shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Confidentiality</h4>
                      <p className="text-xs text-white/60 leading-relaxed">All consultations are strictly private and protected by attorney-client privilege.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-brand-gold shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Punctuality</h4>
                      <p className="text-xs text-white/60 leading-relaxed">We respect your time. Our advocates are committed to keeping scheduled appointments.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="text-brand-gold shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Accessibility</h4>
                      <p className="text-xs text-white/60 leading-relaxed">Visit us at Wakulima House, Ruiru, or request a virtual consultation via video call.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
                  <Calendar size={32} />
                </div>
                <h4 className="font-bold text-brand-navy mb-4">Firm Hours</h4>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Monday — Friday</p>
                  <p className="font-bold text-brand-navy">8:00 AM — 5:00 PM</p>
                  <p className="pt-4">Saturdays</p>
                  <p className="font-bold text-brand-navy">By Prior Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
