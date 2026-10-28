import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Home, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, 
  Heart, ArrowRight, BookOpen
} from 'lucide-react';

interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  statutoryFramework: string;
}

const IconMap: Record<string, any> = {
  Briefcase, Home, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, Heart
};

export const PracticeAreasPage = () => {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const q = query(collection(db, 'practice_areas'), orderBy('title', 'asc'));
        const snapshot = await getDocs(q);
        setAreas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeArea)));
      } catch (err) {
        console.error("Error fetching practice areas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Header */}
      <section className="bg-brand-navy pt-10 pb-12 md:pt-12 md:pb-14 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Our Legal Expertise
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            Specialized legal solutions anchored in Kenyan law and international standards.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areas.map((area, index) => {
                const IconComponent = IconMap[area.icon] || Briefcase;
                return (
                  <motion.div 
                    key={area.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white group"
                  >
                    <div className="p-10 flex flex-col h-full border-b-4 border-transparent hover:border-brand-gold transition-all duration-500 shadow-sm hover:shadow-2xl">
                      <div className="w-16 h-16 bg-brand-navy/5 flex items-center justify-center mb-8 group-hover:bg-brand-navy transition-colors duration-500">
                        <IconComponent className="text-brand-blue group-hover:text-brand-gold transition-colors duration-500" size={32} />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">{area.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                        {area.description}
                      </p>
                      <div className="flex flex-col gap-4">
                        <div className="text-[10px] uppercase tracking-widest text-brand-gold font-bold flex items-center gap-2">
                          <BookOpen size={14} /> Statutory Compliance
                        </div>
                        <Link 
                          to={`/practice-areas/${area.slug}`} 
                          className="btn-secondary text-center text-xs uppercase tracking-widest py-3 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all"
                        >
                          Explore Services
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Need Specialized Legal Advice?</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Our advocates are ready to discuss your unique situation. 
            Book a confidential consultation today.
          </p>
          <Link to="/book" className="btn-primary inline-flex items-center gap-2">
            Schedule Appointment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
