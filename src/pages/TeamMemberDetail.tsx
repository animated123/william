import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Linkedin, ArrowLeft, Award, CheckCircle2, MapPin, Phone } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  credentials: string;
  order: number;
}

export const TeamMemberDetailPage = () => {
  const { id } = useParams();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'team', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setMember({ id: snapshot.id, ...snapshot.data() } as TeamMember);
        }
      } catch (err) {
        console.error("Error fetching team member:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!member) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
      <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Advocate Not Found</h2>
      <Link to="/team" className="btn-primary">Return to Team</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb / Back Button */}
      <div className="bg-brand-navy pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/team" className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest hover:-translate-x-2 transition-transform mb-8">
            <ArrowLeft size={16} /> Back to Team
          </Link>
          <div className="flex flex-col md:flex-row gap-12 items-end">
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-sm overflow-hidden shadow-2xl border-4 border-white/10 bg-brand-light">
               <img 
                src={member.imageUrl} 
                alt={member.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="space-y-4">
              <span className="bg-brand-gold text-brand-navy text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 inline-block">
                {member.role}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                {member.name}
              </h1>
              <p className="text-brand-gold/80 text-sm font-bold uppercase tracking-[0.2em]">
                {member.credentials}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Bio & Content */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-brand-navy">Professional Biography</h2>
                <div className="w-16 h-1 bg-brand-gold" />
                <div className="prose prose-lg prose-brand-navy max-w-none text-gray-600 leading-relaxed">
                  {member.bio.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-brand-light border-l-4 border-l-brand-blue space-y-4">
                  <h4 className="font-bold text-brand-navy flex items-center gap-2">
                    <Award className="text-brand-gold" size={20} /> Qualifications
                  </h4>
                  <ul className="space-y-2">
                    {member.credentials.split(',').map((cred, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                        <CheckCircle2 className="text-brand-blue shrink-0 mt-1" size={14} />
                        {cred.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-brand-light border-l-4 border-l-brand-gold space-y-4">
                  <h4 className="font-bold text-brand-navy flex items-center gap-2">
                    <Linkedin className="text-brand-blue" size={20} /> Connected
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Committed to professional excellence and staying connected with the global legal community.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-brand-blue hover:text-brand-navy transition-colors"><Linkedin size={20} /></a>
                    <a href={`mailto:info@williamadvocates.co.ke`} className="text-brand-blue hover:text-brand-navy transition-colors"><Mail size={20} /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar / Contact Info */}
            <aside className="space-y-8">
              <div className="sticky top-32">
                <div className="bg-brand-navy p-10 text-white shadow-xl">
                  <h3 className="text-xl font-serif font-bold mb-6 text-brand-gold uppercase tracking-widest">Consult {member.name.split(' ')[0]}</h3>
                  <p className="text-xs text-white/60 mb-8 leading-relaxed">
                    Schedule a confidential legal consultation with this specialist at our Ruiru offices.
                  </p>
                  <Link to="/book" className="w-full btn-secondary text-center block border-white text-white hover:bg-white hover:text-brand-navy transition-all">
                    Book Appointment
                  </Link>
                </div>

                <div className="p-10 border border-gray-100 bg-white space-y-6 mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Office Location</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <MapPin className="text-brand-gold shrink-0 mt-1" size={16} />
                      <p className="text-sm text-gray-600">Wakulima House, 2nd Floor, Ruiru Bypass, Kiambu</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Phone className="text-brand-gold shrink-0" size={16} />
                      <p className="text-sm text-gray-600">+254 712 220 470</p>
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
