import React from 'react';
import { motion } from 'motion/react';
import { ContactForm } from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
          >
            Contact Our Offices
          </motion.h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-6" />
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Strategically located in Ruiru to serve the Kiambu business community and beyond.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Reach Out</h2>
                <p className="text-gray-600 leading-relaxed">
                  Whether you have a quick question or require comprehensive legal representation, 
                  our team is here to assist. Use the form or contact us directly via the details below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-500">
                  <MapPin className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-2 uppercase tracking-widest text-xs">Headquarters</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    Wakulima House, 2nd Floor,<br />Ruiru Bypass,<br />Kiambu County, Kenya
                  </p>
                </div>
                <div className="p-8 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-500">
                  <Phone className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-2 uppercase tracking-widest text-xs">Direct Line</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    +254 712 220 470<br />
                    Mon - Fri, 8AM - 5PM
                  </p>
                </div>
                <div className="p-8 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-500">
                  <Mail className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-2 uppercase tracking-widest text-xs">Email Support</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    info@williamcoadvocates.com<br />
                    legal@williamcoadvocates.com
                  </p>
                </div>
                <div className="p-8 bg-brand-light rounded-sm border border-gray-100 group hover:bg-brand-navy transition-all duration-500">
                  <Clock className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="font-bold text-brand-navy group-hover:text-white mb-2 uppercase tracking-widest text-xs">Office Hours</h4>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed">
                    Mon - Fri: 8:00 - 17:00<br />
                    Weekend: Closed
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-gray-200 rounded-sm overflow-hidden shadow-inner flex items-center justify-center border border-gray-100">
                <div className="text-center">
                  <MapPin className="text-brand-navy mx-auto mb-2 opacity-20" size={48} />
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Interactive Map Component</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-navy p-12 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <MessageSquare size={200} className="text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold text-white mb-8">Send an Inquiry</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
