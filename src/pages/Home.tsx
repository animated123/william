import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Home as HomeIcon, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, 
  Heart, ArrowRight, Award, MapPin, Phone, Mail
} from 'lucide-react';
import { motion } from 'motion/react';
import { ContactForm } from '../components/ContactForm';

// --- Types ---
interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  statutoryFramework: string;
}

const IconMap: Record<string, any> = {
  Briefcase, Home: HomeIcon, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, Heart
};

export const HomePage = () => {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const q = query(collection(db, 'practice_areas'), orderBy('title', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeArea));
        setAreas(data);
      } catch (err) {
        console.error("Error fetching practice areas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Simplified & Refined */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-brand-navy border-t border-brand-gold/10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy/90 to-brand-navy z-10" />
          <img 
            src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" 
            alt="Law Library" 
            className="w-full h-full object-cover scale-110 blur-[2px] opacity-40"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 text-brand-gold mb-6 bg-brand-gold/10 px-4 py-1 rounded-full border border-brand-gold/20">
              <Award size={14} />
              <span className="uppercase tracking-[0.3em] text-[9px] font-bold">Excellence & Integrity</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-8">
              Redefining <span className="text-brand-gold italic font-light">Legal Advocacy</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 leading-relaxed font-light">
              William & Co. Advocates provides bespoke legal solutions with global standards, 
              anchored in the heart of Ruiru, Kiambu.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/practice-areas" className="btn-primary flex items-center gap-2">
                Explore Expertise <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-navy">
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Extremely Brief */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-serif font-bold text-brand-navy">Excellence in Practice</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto" />
            <p className="text-gray-500 leading-relaxed text-lg font-light">
              Our firm is dedicated to providing efficient, ethical, and client-centric legal solutions. 
              With qualified advocates including Notaries Public and Patent Agents, 
              we empower our clients to navigate complex legal landscapes with absolute confidence.
            </p>
            <Link to="/about" className="inline-block text-brand-gold font-bold text-xs uppercase tracking-widest border-b border-brand-gold pb-1 hover:text-brand-navy hover:border-brand-navy transition-colors">
              Our Full Story
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Areas Section - Compact Grid */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-navy">Core Specializations</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area, index) => {
                const IconComponent = IconMap[area.icon] || Briefcase;
                return (
                  <Link 
                    key={area.id}
                    to={`/practice-areas/${area.slug}`}
                    className="group bg-white p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-start gap-6"
                  >
                    <div className="w-12 h-12 flex items-center justify-center shrink-0 text-brand-blue group-hover:text-brand-gold transition-colors">
                      <IconComponent size={32} strokeWidth={1.2} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors leading-tight">{area.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Simplified Contact CTA */}
      <section className="bg-brand-navy py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <h2 className="text-4xl font-serif font-bold leading-tight">Need Legal Support? <br /><span className="text-brand-gold">Reach Out Today.</span></h2>
              <div className="space-y-4 text-white/60">
                <p className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-brand-gold" /> Wakulima House, Ruiru, Kiambu</p>
                <p className="flex items-center gap-3 text-sm"><Phone size={16} className="text-brand-gold" /> +254 712 220 470</p>
                <p className="flex items-center gap-3 text-sm"><Mail size={16} className="text-brand-gold" /> info@williamcoadvocates.com</p>
              </div>
            </div>
            <div className="bg-white/5 p-8 backdrop-blur-sm border border-white/10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
