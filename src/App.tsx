import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, Award, Clock, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { TeamPage } from './pages/Team';
import { PracticeAreasPage } from './pages/PracticeAreas';
import { PracticeAreaDetailPage } from './pages/PracticeAreaDetail';
import { BookAppointmentPage } from './pages/BookAppointment';
import { ContactPage } from './pages/Contact';
import { BlogListPage } from './pages/BlogList';
import { BlogPostPage } from './pages/BlogPost';
import { TeamMemberDetailPage } from './pages/TeamMemberDetail';
import { AdminLoginPage } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// --- Shared Layout Components ---

const TopBar = () => (
  <div className="bg-brand-light border-b border-gray-100 py-2 hidden lg:block">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] uppercase tracking-widest text-brand-navy/60 font-bold">
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-brand-gold" />
          <span>Wakulima House, Ruiru, Kiambu</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} className="text-brand-gold" />
          <span>+254 712 220 470</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-brand-gold" />
          <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
        </div>
      </div>
      <div className="flex gap-4">
        <a href="#" className="hover:text-brand-gold transition-colors"><Linkedin size={12} /></a>
        <a href="#" className="hover:text-brand-gold transition-colors"><Facebook size={12} /></a>
        <a href="#" className="hover:text-brand-gold transition-colors"><Instagram size={12} /></a>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPage) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Practice Areas', path: '/practice-areas' },
    { name: 'Team', path: '/team' },
    { name: 'Insights', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <TopBar />
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-xl py-4' : 'bg-white py-6 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tight text-brand-gold uppercase leading-tight">William & Co.</span>
              <span className="text-[10px] tracking-[0.4em] font-medium opacity-60 text-brand-blue">ADVOCATES</span>
            </Link>
            
            <div className="hidden lg:flex space-x-10 items-center font-bold text-xs uppercase tracking-widest text-brand-navy">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`transition-all py-1 border-b-2 ${
                      isActive ? 'text-brand-gold border-brand-gold' : 'text-brand-navy border-transparent hover:text-brand-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link to="/book" className="btn-primary">Book Consultation</Link>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-brand-navy hover:text-brand-gold transition-colors">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-8 space-y-6 font-bold text-sm uppercase tracking-[0.2em] text-center text-brand-navy">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 transition-colors ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold'}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link to="/book" onClick={() => setIsOpen(false)} className="block py-2 text-brand-gold">Book Consultation</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <footer className="bg-brand-navy text-white py-6 border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <Link to="/" className="flex flex-col">
            <span className="text-base font-serif font-bold text-brand-gold uppercase leading-tight">William & Co.</span>
            <span className="text-[7px] tracking-[0.4em] font-medium opacity-60 text-white">ADVOCATES</span>
          </Link>
          
          <div className="flex gap-x-4 text-[9px] font-bold uppercase tracking-widest text-white/50">
            <Link to="/about" className="hover:text-brand-gold transition-colors">About</Link>
            <Link to="/practice-areas" className="hover:text-brand-gold transition-colors">Expertise</Link>
            <Link to="/team" className="hover:text-brand-gold transition-colors">Team</Link>
            <Link to="/blog" className="hover:text-brand-gold transition-colors">Insights</Link>
            <Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[8px] text-white/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} William & Co. Advocates.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5"><MapPin size={8} className="text-brand-gold" /> Ruiru, Kenya</p>
            <p className="flex items-center gap-1.5"><Phone size={8} className="text-brand-gold" /> +254 712 220 470</p>
            <Link to="/admin/login" className="opacity-40 hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/:id" element={<TeamMemberDetailPage />} />
            <Route path="/practice-areas" element={<PracticeAreasPage />} />
            <Route path="/practice-areas/:slug" element={<PracticeAreaDetailPage />} />
            <Route path="/book" element={<BookAppointmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
