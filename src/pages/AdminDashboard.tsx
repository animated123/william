import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  collection, query, getDocs, orderBy, doc, 
  updateDoc, deleteDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { 
  LayoutDashboard, Users, Calendar, MessageSquare, 
  Settings, LogOut, ChevronRight, Check, X, Clock,
  Plus, Edit2, Trash2, Save, Image as ImageIcon,
  Briefcase, BookOpen, User as UserIcon, Mail, Phone,
  Menu, ExternalLink, Globe
} from 'lucide-react';

// --- Types ---
interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  statutoryFramework: string;
  caseScenarios: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  credentials: string;
  order: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  publishedAt: any;
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'messages' | 'practice' | 'team' | 'blogs'>('overview');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = auth.onAuthStateChanged(user => {
      const isTempAdmin = sessionStorage.getItem('isTempAdmin') === 'true';
      if (!user && !isTempAdmin) navigate('/admin/login');
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const apptQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const msgQuery = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
        const practiceQuery = query(collection(db, 'practice_areas'), orderBy('title', 'asc'));
        const teamQuery = query(collection(db, 'team'), orderBy('order', 'asc'));
        const blogQuery = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'));
        
        const [apptSnap, msgSnap, practiceSnap, teamSnap, blogSnap] = await Promise.all([
          getDocs(apptQuery),
          getDocs(msgQuery),
          getDocs(practiceQuery),
          getDocs(teamQuery),
          getDocs(blogQuery)
        ]);

        setAppointments(apptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setMessages(msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setPracticeAreas(practiceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeArea)));
        setTeam(teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
        setBlogs(blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    sessionStorage.removeItem('isTempAdmin');
    await signOut(auth);
    navigate('/');
  };

  // --- CRUD Operations ---

  const handleSave = async (collectionName: string) => {
    if (!editData) return;
    setLoading(true);
    try {
      if (isEditing === 'new') {
        const { id, ...data } = editData;
        await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...(collectionName === 'blogs' ? { publishedAt: serverTimestamp() } : {})
        });
      } else {
        const { id, ...data } = editData;
        await updateDoc(doc(db, collectionName, id), {
          ...data,
          updatedAt: serverTimestamp()
        });
      }
      setIsEditing(null);
      setEditData(null);
      // Refresh data without full page reload for better UX
      const fetchData = async () => {
        if (collectionName === 'team') {
          const q = query(collection(db, 'team'), orderBy('order', 'asc'));
          const snap = await getDocs(q);
          setTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
        } else if (collectionName === 'blogs') {
          const q = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'));
          const snap = await getDocs(q);
          setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
        } else if (collectionName === 'practice_areas') {
          const q = query(collection(db, 'practice_areas'), orderBy('title', 'asc'));
          const snap = await getDocs(q);
          setPracticeAreas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PracticeArea)));
        }
      };
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'team') setTeam(team.filter(t => t.id !== id));
      if (collectionName === 'blogs') setBlogs(blogs.filter(b => b.id !== id));
      if (collectionName === 'practice_areas') setPracticeAreas(practiceAreas.filter(p => p.id !== id));
      if (collectionName === 'appointments') setAppointments(appointments.filter(a => a.id !== id));
      if (collectionName === 'contact_messages') setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  const updateApptStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'practice', icon: Briefcase, label: 'Practice Areas' },
    { id: 'blogs', icon: BookOpen, label: 'Blog / Insights' },
    { id: 'team', icon: Users, label: 'Team Members' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-xl font-serif font-bold text-brand-gold uppercase">William & Co.</span>
          <span className="text-[10px] tracking-widest opacity-60">Admin Portal</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-6">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { 
              setActiveTab(item.id as any); 
              setIsEditing(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium ${
              activeTab === item.id ? 'bg-brand-gold text-brand-navy' : 'hover:bg-white/5 text-white/70'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-white/70 hover:bg-white/5 transition-colors text-sm font-medium"
        >
          <Globe size={18} />
          View Website <ExternalLink size={14} />
        </a>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-white/50 hover:text-white hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-light flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-brand-navy text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-lg font-serif font-bold text-brand-gold uppercase">William & Co.</span>
          <span className="text-[8px] tracking-widest opacity-60">Admin Portal</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-brand-navy z-40 pt-20 flex flex-col">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-brand-navy text-white min-h-screen fixed left-0 top-0 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold font-bold mb-2">
              <div className="w-4 h-[1px] bg-brand-gold"></div>
              Dashboard
            </div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy capitalize">{activeTab.replace('_', ' ')}</h1>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Authenticated As</p>
            <p className="text-sm font-medium text-brand-navy">
              {sessionStorage.getItem('isTempAdmin') === 'true' ? 'Maina (Admin)' : auth.currentUser?.email || 'Admin'}
            </p>
          </div>
        </header>

        {loading && !isEditing && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* --- Overview Tab --- */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Pending Appts', val: appointments.filter(a => a.status === 'pending').length, color: 'border-l-amber-500', tab: 'appointments' },
                { label: 'Total Inquiries', val: messages.length, color: 'border-l-brand-gold', tab: 'messages' },
                { label: 'Team Members', val: team.length, color: 'border-l-brand-navy', tab: 'team' },
                { label: 'Insights', val: blogs.length, color: 'border-l-green-600', tab: 'blogs' }
              ].map((stat, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveTab(stat.tab as any)}
                  className={`bg-white p-4 md:p-6 shadow-sm border border-gray-100 border-l-4 ${stat.color} text-left hover:shadow-md transition-shadow`}
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{stat.label}</p>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-brand-navy">{stat.val}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="font-serif font-bold text-xl mb-6 flex items-center justify-between text-brand-navy">
                  Recent Appointments
                  <button onClick={() => setActiveTab('appointments')} className="text-[10px] text-brand-gold flex items-center gap-1 uppercase tracking-widest font-bold">
                    Manage <ChevronRight size={14} />
                  </button>
                </h3>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 italic">No appointments booked yet.</p>
                  ) : (
                    appointments.slice(0, 5).map(appt => (
                      <div key={appt.id} className="flex items-center justify-between p-4 bg-brand-light rounded-sm border border-gray-50">
                        <div>
                          <p className="font-bold text-brand-navy text-sm">{appt.clientName}</p>
                          <p className="text-[10px] text-gray-400">{appt.date} @ {appt.time}</p>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full ${
                          appt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="font-serif font-bold text-xl mb-6 flex items-center justify-between text-brand-navy">
                  Quick Actions
                  <Settings size={18} className="text-gray-300" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setActiveTab('team'); setIsEditing('new'); setEditData({ name: '', role: '', bio: '', credentials: '', imageUrl: '', order: team.length + 1 }); }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-sm hover:border-brand-gold hover:bg-brand-gold/5 transition-all group"
                  >
                    <Users className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={32} />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Add Team Member</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('blogs'); setIsEditing('new'); setEditData({ title: '', slug: '', category: '', author: 'William Ngugi', imageUrl: '', content: '' }); }}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-sm hover:border-brand-gold hover:bg-brand-gold/5 transition-all group"
                  >
                    <BookOpen className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" size={32} />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Write Insight</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Appointments Tab --- */}
        {activeTab === 'appointments' && (
          <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-brand-navy text-white text-[10px] uppercase tracking-[0.2em]">
                  <th className="p-4">Client</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 italic">No appointments found.</td>
                  </tr>
                )}
                {appointments.map(appt => (
                  <tr key={appt.id} className="border-b border-gray-50 hover:bg-brand-light transition-colors">
                    <td className="p-4"><p className="font-bold text-brand-navy">{appt.clientName}</p></td>
                    <td className="p-4">
                      <p className="text-[11px] text-gray-500 flex items-center gap-2"><Mail size={12} className="text-brand-gold" /> {appt.clientEmail}</p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-2"><Phone size={12} className="text-brand-gold" /> {appt.clientPhone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-[11px] font-bold text-brand-navy">{appt.date}</p>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest">{appt.time}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] uppercase font-bold px-2 py-1 rounded-full ${
                        appt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateApptStatus(appt.id, 'confirmed')} className="p-2 bg-blue-50 text-blue-600 rounded-sm hover:bg-blue-100 transition-colors" title="Confirm"><Check size={16} /></button>
                        <button onClick={() => updateApptStatus(appt.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-sm hover:bg-red-100 transition-colors" title="Cancel"><X size={16} /></button>
                        <button onClick={() => handleDelete('appointments', appt.id)} className="p-2 bg-gray-100 text-gray-400 rounded-sm hover:bg-red-500 hover:text-white transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Messages Tab --- */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length === 0 && <p className="text-gray-400 col-span-full py-12 text-center italic bg-white shadow-sm border border-gray-100">No contact messages received.</p>}
            {messages.map(msg => (
              <div key={msg.id} className="bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-brand-navy uppercase tracking-wider text-xs border-b border-brand-gold pb-1">{msg.subject}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete('contact_messages', msg.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <span className="text-[10px] text-gray-400">{new Date(msg.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{msg.message}"</p>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center text-[10px] font-bold uppercase">{msg.name.charAt(0)}</div>
                    <div>
                      <p className="text-[11px] font-bold text-brand-navy uppercase">{msg.name}</p>
                      <p className="text-[10px] text-gray-400">{msg.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Practice Areas Manager --- */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Service Portfolio</h2>
              <button 
                onClick={() => { setIsEditing('new'); setEditData({ title: '', slug: '', description: '', icon: 'Briefcase', statutoryFramework: '', caseScenarios: '' }); }}
                className="btn-primary flex items-center gap-2 text-[10px]"
              >
                <Plus size={14} /> NEW SERVICE
              </button>
            </div>

            {isEditing && activeTab === 'practice' ? (
              <div className="bg-white p-6 md:p-8 shadow-xl border border-brand-gold/20 space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.title}
                      onChange={e => setEditData({ ...editData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Slug (Auto-generated)</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border-none outline-none text-gray-400 text-sm"
                      value={editData.slug}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Statutory Framework</label>
                  <textarea 
                    rows={2}
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    value={editData.statutoryFramework}
                    onChange={e => setEditData({ ...editData, statutoryFramework: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Case Scenarios (Comma separated)</label>
                  <input 
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    value={editData.caseScenarios}
                    onChange={e => setEditData({ ...editData, caseScenarios: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleSave('practice_areas')} className="btn-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
                  <button onClick={() => setIsEditing(null)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {practiceAreas.map(area => (
                  <div key={area.id} className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mb-4">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="font-serif font-bold text-brand-navy mb-2">{area.title}</h3>
                      <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">{area.description}</p>
                    </div>
                    <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-50">
                      <button onClick={() => { setIsEditing(area.id); setEditData(area); }} className="p-2 text-brand-blue hover:bg-brand-light rounded-sm transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('practice_areas', area.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Team Manager --- */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Advocate Roster</h2>
              <button 
                onClick={() => { setIsEditing('new'); setEditData({ name: '', role: '', bio: '', credentials: '', imageUrl: '', order: team.length + 1 }); }}
                className="btn-primary flex items-center gap-2 text-[10px]"
              >
                <Plus size={14} /> ADD MEMBER
              </button>
            </div>

            {isEditing && activeTab === 'team' ? (
              <div className="bg-white p-6 md:p-8 shadow-xl border border-brand-gold/20 space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.name}
                      onChange={e => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Role / Title</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.role}
                      onChange={e => setEditData({ ...editData, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Academic Credentials (e.g. LLB, LLM)</label>
                  <input 
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    value={editData.credentials}
                    onChange={e => setEditData({ ...editData, credentials: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Profile Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      className="flex-1 p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.imageUrl}
                      onChange={e => setEditData({ ...editData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                    {editData.imageUrl && <img src={editData.imageUrl} className="w-12 h-12 object-cover rounded-sm border border-gray-100" alt="" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Professional Biography</label>
                  <textarea 
                    rows={6}
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    value={editData.bio}
                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleSave('team')} className="btn-primary flex items-center gap-2"><Save size={16} /> Save Profile</button>
                  <button onClick={() => setIsEditing(null)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {team.length === 0 && <p className="text-gray-400 col-span-full py-12 text-center italic bg-white border border-gray-100">No team members added yet.</p>}
                {team.map(member => (
                  <div key={member.id} className="bg-white p-6 shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-shadow group">
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm bg-gray-50 border border-gray-100">
                      <img src={member.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-serif font-bold text-brand-navy text-sm truncate">{member.name}</h3>
                        <p className="text-[9px] uppercase font-bold text-brand-gold tracking-widest mb-1">{member.role}</p>
                        <p className="text-[10px] text-gray-400 truncate">{member.credentials}</p>
                      </div>
                      <div className="flex justify-end gap-1 mt-4">
                        <button onClick={() => { setIsEditing(member.id); setEditData(member); }} className="p-2 text-brand-blue hover:bg-brand-light rounded-sm transition-colors" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete('team', member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Blogs Manager --- */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Legal Insights & News</h2>
              <button 
                onClick={() => { setIsEditing('new'); setEditData({ title: '', slug: '', category: '', author: 'William Ngugi', imageUrl: '', content: '' }); }}
                className="btn-primary flex items-center gap-2 text-[10px]"
              >
                <Plus size={14} /> NEW ARTICLE
              </button>
            </div>

            {isEditing && activeTab === 'blogs' ? (
              <div className="bg-white p-6 md:p-8 shadow-xl border border-brand-gold/20 space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Article Title</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.title}
                      onChange={e => setEditData({ ...editData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Category (e.g. Litigation, Real Estate)</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.category}
                      onChange={e => setEditData({ ...editData, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Author</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.author}
                      onChange={e => setEditData({ ...editData, author: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Featured Image URL</label>
                    <input 
                      className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                      value={editData.imageUrl}
                      onChange={e => setEditData({ ...editData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Content (Markdown or Plain Text)</label>
                  <textarea 
                    rows={12}
                    className="w-full p-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold font-mono text-sm leading-relaxed"
                    value={editData.content}
                    onChange={e => setEditData({ ...editData, content: e.target.value })}
                    placeholder="Write your article content here..."
                  />
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleSave('blogs')} className="btn-primary flex items-center gap-2"><Save size={16} /> Publish Article</button>
                  <button onClick={() => setIsEditing(null)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {blogs.length === 0 && <p className="text-gray-400 col-span-full py-12 text-center italic bg-white border border-gray-100">No blog posts yet.</p>}
                {blogs.map(post => (
                  <div key={post.id} className="bg-white overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-all group">
                    <div className="aspect-video bg-gray-50 relative overflow-hidden">
                      <img src={post.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                      <span className="absolute top-3 left-3 bg-brand-gold text-brand-navy text-[8px] font-bold uppercase px-2 py-1 tracking-widest shadow-lg">{post.category}</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-brand-navy text-sm mb-2 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">{post.title}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <UserIcon size={10} className="text-brand-gold" /> {post.author} 
                          <span className="text-gray-200">|</span>
                          <Calendar size={10} className="text-brand-gold" /> {new Date(post.publishedAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-6 flex justify-end gap-1 pt-4 border-t border-gray-50">
                        <button onClick={() => { setIsEditing(post.id); setEditData(post); }} className="p-2 text-brand-blue hover:bg-brand-light rounded-sm transition-colors" title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete('blogs', post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
