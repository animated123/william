import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Briefcase, Home, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, 
  Heart, ArrowRight, BookOpen, CheckCircle2, Info, Award
} from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm';

interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  statutoryFramework: string;
  caseScenarios: string;
}

const IconMap: Record<string, any> = {
  Briefcase, Home, Users, Lightbulb, ShieldCheck, 
  Receipt, Scale, Gavel, HeartHandshake, Landmark, Heart
};

export const PracticeAreaDetailPage = () => {
  const { slug } = useParams();
  const [area, setArea] = useState<PracticeArea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArea = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, 'practice_areas'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setArea({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as PracticeArea);
        }
      } catch (err) {
        console.error("Error fetching practice area:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArea();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="animate-spin text-brand-gold"><Scale size={40} /></div>
    </div>
  );

  if (!area) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light p-8">
      <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Service Not Found</h2>
      <Link to="/practice-areas" className="btn-primary">Return to Services</Link>
    </div>
  );

  const IconComponent = IconMap[area.icon] || Briefcase;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-navy py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <IconComponent className="absolute -right-20 -top-20 text-white" size={400} strokeWidth={1} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/practice-areas" className="text-brand-gold text-xs uppercase tracking-widest font-bold flex items-center gap-2 mb-8 hover:-translate-x-2 transition-transform">
            <ArrowRight className="rotate-180" size={14} /> Back to Expertise
          </Link>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="w-16 h-16 bg-brand-gold/10 flex items-center justify-center mb-6">
              <IconComponent className="text-brand-gold" size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              {area.title}
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Expert legal advisory and representation in {area.title} matters within the Kenyan legal landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* Overview */}
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-brand-navy">Service Overview</h2>
                <div className="w-16 h-1 bg-brand-gold" />
                <p className="text-gray-600 text-lg leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Statutory Framework */}
              <div className="bg-brand-light p-10 border-l-4 border-l-brand-blue">
                <h3 className="flex items-center gap-3 text-xl font-bold text-brand-navy mb-6">
                  <BookOpen className="text-brand-blue" /> Statutory Framework
                </h3>
                <div className="prose prose-brand-navy max-w-none">
                  <p className="text-gray-600 leading-relaxed italic">
                    Our practice is anchored in the following Kenyan laws and regulations:
                  </p>
                  <p className="mt-4 font-medium text-brand-navy leading-relaxed">
                    {area.statutoryFramework}
                  </p>
                </div>
              </div>

              {/* Case Scenarios */}
              <div className="space-y-8">
                <h3 className="text-2xl font-serif font-bold text-brand-navy">Practical Case Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {area.caseScenarios.split(',').map((scenario, i) => (
                    <div key={i} className="p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                      <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                      <span className="text-sm text-gray-700 leading-relaxed">{scenario.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Credentials Highlight */}
              <div className="p-8 border border-brand-gold/20 flex flex-col md:flex-row gap-8 items-center bg-brand-gold/5">
                <div className="shrink-0">
                  <Award className="text-brand-gold" size={48} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy mb-2 uppercase tracking-wider">Certified Legal Experts</h4>
                  <p className="text-sm text-gray-600">
                    Our team includes Notaries Public and Patent Agents with deep specialization in this area of practice, 
                    ensuring every document and representation meets the highest professional standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="sticky top-32">
                <div className="bg-brand-navy p-8 text-white mb-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Book a Specialist</h3>
                  <p className="text-xs text-white/60 mb-6 uppercase tracking-widest">Confidential Consultation</p>
                  <Link to="/book" className="w-full btn-secondary text-center block border-white text-white hover:bg-white hover:text-brand-navy transition-all">
                    Start Now
                  </Link>
                </div>
                
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-brand-navy mb-6 uppercase tracking-wider text-xs">Need Immediate Help?</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-blue"><Info size={16} /></div>
                      <span>Ruiru, Wakulima House</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-brand-navy">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-blue"><Landmark size={16} /></div>
                      <span>+254 712 220 470</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
