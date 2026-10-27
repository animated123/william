import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: any;
  imageUrl: string;
  slug: string;
}

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, 'blogs'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
      <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Article Not Found</h2>
      <Link to="/blog" className="btn-primary">Return to Insights</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image */}
      <div className="h-[50vh] relative">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/40" />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-24">
        <div className="bg-white p-8 md:p-16 shadow-2xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest mb-8 hover:-translate-x-2 transition-transform">
            <ArrowLeft size={16} /> Back to Insights
          </Link>

          <div className="space-y-6">
            <span className="bg-brand-gold text-brand-navy text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 inline-block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 border-y border-gray-100 py-6 text-xs uppercase tracking-widest font-bold text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-blue"><User size={14} /></div>
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-brand-gold" size={14} />
                <span>{new Date(post.publishedAt?.seconds * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div 
            className="mt-12 prose prose-lg prose-brand-navy max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Share This Article:</span>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-brand-blue transition-colors"><Linkedin size={18} /></button>
                <button className="text-gray-400 hover:text-brand-blue transition-colors"><Twitter size={18} /></button>
                <button className="text-gray-400 hover:text-brand-blue transition-colors"><Facebook size={18} /></button>
              </div>
            </div>
            
            <Link to="/contact" className="text-brand-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
              Discuss this with an Advocate <Share2 size={16} />
            </Link>
          </div>
        </div>
      </article>

      {/* Recommended CTA */}
      <section className="bg-brand-light py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Legal Expertise You Can Trust</h2>
          <p className="text-gray-500 mb-8 leading-relaxed italic">
            This article is provided for informational purposes only and does not constitute legal advice. 
            For specific legal counsel, please book an appointment.
          </p>
          <Link to="/book" className="btn-primary">Book Consultation</Link>
        </div>
      </section>
    </div>
  );
};
