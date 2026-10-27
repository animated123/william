import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, MessageSquare, Send, Tag } from 'lucide-react';

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // Send Email Notification
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-navy p-8 text-center text-white border border-brand-gold">
        <h3 className="text-2xl font-serif font-bold text-brand-gold mb-2">Message Sent</h3>
        <p className="opacity-70 mb-6">Thank you for contacting William & Co. Advocates. We will respond to your inquiry via email.</p>
        <button onClick={() => setSuccess(false)} className="btn-secondary border-white text-white hover:bg-white hover:text-brand-navy">Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <User className="absolute left-0 top-3 text-brand-gold" size={18} />
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Your Name"
            className="w-full pl-7 py-3 bg-transparent border-b border-white/20 focus:border-brand-gold outline-none text-white transition-colors"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-0 top-3 text-brand-gold" size={18} />
          <input 
            required
            type="email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="Your Email"
            className="w-full pl-7 py-3 bg-transparent border-b border-white/20 focus:border-brand-gold outline-none text-white transition-colors"
          />
        </div>
      </div>
      <div className="relative">
        <Tag className="absolute left-0 top-3 text-brand-gold" size={18} />
        <input 
          required
          type="text" 
          value={formData.subject}
          onChange={e => setFormData({...formData, subject: e.target.value})}
          placeholder="Subject"
          className="w-full pl-7 py-3 bg-transparent border-b border-white/20 focus:border-brand-gold outline-none text-white transition-colors"
        />
      </div>
      <div className="relative">
        <MessageSquare className="absolute left-0 top-3 text-brand-gold" size={18} />
        <textarea 
          required
          rows={4}
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          placeholder="How can we help you?"
          className="w-full pl-7 py-3 bg-transparent border-b border-white/20 focus:border-brand-gold outline-none text-white transition-colors resize-none"
        />
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="w-full btn-secondary border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center gap-2"
      >
        {loading ? 'Sending...' : (
          <>
            Send Message <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
};
