import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';

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

export const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-navy pt-10 pb-12 md:pt-12 md:pb-14 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
          >
            Law & Insights
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-white/70 max-w-2xl mx-auto text-base uppercase tracking-widest font-medium">
            Navigating the Kenyan Legal Landscape
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white shadow-sm border border-gray-100">
              <BookOpen className="text-brand-gold mx-auto mb-4 opacity-20" size={64} />
              <h3 className="text-2xl font-serif font-bold text-brand-navy">Insights Coming Soon</h3>
              <p className="text-gray-500 mt-2">Our advocates are currently drafting professional legal insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop'} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-gold text-brand-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-6 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.publishedAt?.seconds * 1000).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1"><User size={12} /> {post.author}</div>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-navy group-hover:text-brand-blue transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
