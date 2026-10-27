import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Clock, User, Mail, Phone as PhoneIcon, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const AppointmentForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    time: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Send Email Notification
      await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setSuccess(true);
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        date: '',
        time: '',
        message: ''
      });
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-8 border border-brand-gold/20 shadow-xl text-center">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-brand-navy mb-2">Request Received</h3>
        <p className="text-gray-600 mb-6">Thank you for reaching out. Our team will contact you shortly to confirm your appointment.</p>
        <button onClick={() => setSuccess(false)} className="btn-primary">Book Another</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 border border-gray-100 shadow-2xl">
      <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Book a Consultation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text" 
                value={formData.clientName}
                onChange={e => setFormData({...formData, clientName: e.target.value})}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-brand-light border-none focus:ring-1 focus:ring-brand-gold outline-none text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="email" 
                value={formData.clientEmail}
                onChange={e => setFormData({...formData, clientEmail: e.target.value})}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 bg-brand-light border-none focus:ring-1 focus:ring-brand-gold outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Phone Number</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="tel" 
                value={formData.clientPhone}
                onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                placeholder="+254 ..."
                className="w-full pl-10 pr-4 py-3 bg-brand-light border-none focus:ring-1 focus:ring-brand-gold outline-none text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Preferred Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-brand-light border-none focus:ring-1 focus:ring-brand-gold outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500">Brief Message</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
            <textarea 
              rows={4}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="How can we help you?"
              className="w-full pl-10 pr-4 py-3 bg-brand-light border-none focus:ring-1 focus:ring-brand-gold outline-none text-sm"
            />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
};
