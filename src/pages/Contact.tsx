import React from 'react';
import { motion } from 'motion/react';
import { ContactForm } from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle } from 'lucide-react';
import { FAQSection } from '../components/FAQSection';

export const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy pt-10 pb-12 md:pt-12 md:pb-14 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Contact Our Offices
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Strategically located in Ruiru to serve the Kiambu business community and beyond.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Reach Out</h2>
                <p className="text-gray-600 leading-relaxed">
                  Whether you have a quick question or require comprehensive legal representation, 
                  our team is here to assist. Use the form or contact us directly via the details below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-300">
                  <MapPin className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-1.5 uppercase tracking-widest text-xs">Headquarters</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    Wakulima House, 2nd Floor,<br />Ruiru Bypass,<br />Kiambu County, Kenya
                  </p>
                </div>
                <div className="p-6 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-300">
                  <Phone className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-1.5 uppercase tracking-widest text-xs">Direct Line</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    +254 712 220 470<br />
                    Mon - Fri, 8AM - 5PM
                  </p>
                </div>
                <div className="p-6 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-300">
                  <Mail className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-1.5 uppercase tracking-widest text-xs">Email Inquiries</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    info@williamadvocates.co.ke<br />
                    williamadvocates@gmail.com
                  </p>
                </div>
                <div className="p-6 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-300">
                  <Clock className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-1.5 uppercase tracking-widest text-xs">Office Hours</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    Mon - Fri: 8:00 - 17:00<br />
                    Weekend: By Appointment
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-sm overflow-hidden shadow-inner flex items-center justify-center border border-gray-200">
                <div className="text-center p-6">
                  <MapPin className="text-brand-navy mx-auto mb-2 opacity-30" size={40} />
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Wakulima House, Ruiru Town</p>
                  <p className="text-[11px] text-gray-400 mt-1">Conveniently accessible along Thika Superhighway & Eastern Bypass</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy p-8 md:p-10 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <MessageSquare size={160} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold text-white mb-6">Send an Inquiry</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <FAQSection />
    </div>
  );
};

