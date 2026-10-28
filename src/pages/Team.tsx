import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, ArrowRight } from 'lucide-react';
import { getTeamSlug, DEFAULT_TEAM_MEMBERS, TeamMember } from '../lib/teamUtils';

export const TeamPage = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'team'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setTeam(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
        } else {
          setTeam(DEFAULT_TEAM_MEMBERS);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        setTeam(DEFAULT_TEAM_MEMBERS);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-navy pt-10 pb-12 md:pt-12 md:pb-14 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Our Legal Team
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base">
            A collective of highly qualified advocates dedicated to your legal success.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {team.map((member, index) => {
                const memberSlug = getTeamSlug(member);
                return (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link to={`/team/${memberSlug}`} className="relative aspect-[3/4] overflow-hidden rounded-sm mb-8 bg-gray-100 shadow-xl block">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center hover:bg-white transition-colors">
                            <Linkedin size={18} />
                          </div>
                          <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center hover:bg-white transition-colors">
                            <Mail size={18} />
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="space-y-3 text-center md:text-left">
                      <div className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                        {member.role}
                      </div>
                      <Link to={`/team/${memberSlug}`} className="hover:text-brand-blue transition-colors">
                        <h3 className="text-2xl font-serif font-bold text-brand-navy">{member.name}</h3>
                      </Link>
                      <p className="text-brand-blue/80 text-xs font-bold uppercase tracking-widest leading-relaxed border-y border-gray-100 py-2">
                        {member.credentials}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                        {member.bio}
                      </p>
                      <Link to={`/team/${memberSlug}`} className="text-brand-gold font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 pt-4 hover:translate-x-2 transition-transform mx-auto md:mx-0">
                        View Profile <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Recruitment CTA */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Join Our Roster</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We are always looking for passionate legal professionals to join our growing firm. 
            If you share our values of integrity and excellence, we would love to hear from you.
          </p>
          <button className="btn-primary">View Careers</button>
        </div>
      </section>
    </div>
  );
};
