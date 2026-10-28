import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Shield, Users, Target, Landmark } from 'lucide-react';
import { FAQSection } from '../components/FAQSection';

export const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-brand-navy pt-10 pb-12 md:pt-12 md:pb-14 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            About Our Firm
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base uppercase tracking-widest font-medium">
            Integrity • Excellence • Client Advocacy
          </p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest">
                <div className="w-8 h-[1px] bg-brand-gold" />
                Our Story
              </div>
              <h2 className="text-4xl font-serif font-bold text-brand-navy leading-tight">
                A Legacy of Justice <br /> in Kiambu County
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Established with a vision to provide world-class legal services to the people and businesses of Ruiru and beyond, 
                William & Co. Advocates has grown into a beacon of professional excellence and ethical legal practice.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our founders recognized the need for a law firm that combines deep local roots with the sophistication 
                required for complex corporate and property transactions. Today, we are proud to be one of Kiambu's 
                most trusted legal institutions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-blue">
                    <Target size={24} />
                  </div>
                  <h4 className="font-bold text-brand-navy">Our Mission</h4>
                  <p className="text-sm text-gray-500">To provide efficient, ethical, and client-centric legal solutions that empower our clients to achieve their goals.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center text-brand-gold">
                    <Shield size={24} />
                  </div>
                  <h4 className="font-bold text-brand-navy">Our Vision</h4>
                  <p className="text-sm text-gray-500">To be the leading law firm in Kenya, recognized for transforming the legal landscape through innovation and integrity.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1453948575181-85c150391ecb?q=80&w=2070&auto=format&fit=crop" 
                alt="Law Office" 
                className="rounded-sm shadow-2xl"
              />
              <div className="absolute -bottom-10 -left-10 bg-brand-navy p-10 hidden md:block">
                <div className="text-brand-gold text-5xl font-serif font-bold mb-2">15+</div>
                <div className="text-white text-xs uppercase tracking-widest font-bold">Years of Legal Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Core Values</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Integrity", icon: CheckCircle2, desc: "We adhere to the highest ethical standards in every case and interaction." },
              { title: "Excellence", icon: Award, desc: "We strive for perfection in legal research, drafting, and courtroom representation." },
              { title: "Client Advocacy", icon: Users, desc: "Our clients' success and peace of mind are the metrics of our achievements." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 text-center shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-brand-navy/5 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-4">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials Banner */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-12 text-center">
            <div className="space-y-2">
              <Landmark className="text-brand-gold mx-auto" size={32} />
              <p className="text-white font-bold text-xs uppercase tracking-widest">Notaries Public</p>
            </div>
            <div className="space-y-2">
              <Award className="text-brand-gold mx-auto" size={32} />
              <p className="text-white font-bold text-xs uppercase tracking-widest">Patent Agents</p>
            </div>
            <div className="space-y-2">
              <Users className="text-brand-gold mx-auto" size={32} />
              <p className="text-white font-bold text-xs uppercase tracking-widest">Commissioners for Oaths</p>
            </div>
            <div className="space-y-2">
              <Shield className="text-brand-gold mx-auto" size={32} />
              <p className="text-white font-bold text-xs uppercase tracking-widest">Qualified Arbitrators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <FAQSection 
        title="Frequently Asked Legal Questions" 
        subtitle="Common questions regarding our firm, practice, and the Kenyan legal process."
      />
    </div>
  );
};
