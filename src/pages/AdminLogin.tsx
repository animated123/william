import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, User, Key } from 'lucide-react';

export const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'google' | 'username'>('google');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      const isDev = user.email === 'ngugimaina4@gmail.com';

      if (adminDoc.exists() || isDev) {
        sessionStorage.removeItem('isTempAdmin');
        navigate('/admin/dashboard');
      } else {
        await signOut(auth);
        setError("Unauthorized access. This area is restricted to authorized firm administrators.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (username === 'maina' && password === 'maina') {
      try {
        // Use anonymous auth to get a Firebase session for the rules to work
        await signInAnonymously(auth);
        // Set a flag to identify this specific temporary session
        sessionStorage.setItem('isTempAdmin', 'true');
        navigate('/admin/dashboard');
      } catch (err: any) {
        console.error("Anonymous login error:", err);
        if (err.code === 'auth/admin-restricted-operation' || err.message?.includes('admin-restricted-operation')) {
          setError("Action required: Please enable 'Anonymous' authentication in your Firebase Console (Authentication > Sign-in method).");
        } else {
          setError("Temporary login error. Please check your internet connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy p-4">
      <div className="max-w-md w-full bg-white p-10 shadow-2xl rounded-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy">Firm Admin Portal</h1>
          <p className="text-gray-500 mt-2 text-sm">Secure access for William & Co. Advocates</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-8 text-sm border-l-4 border-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {loginMode === 'google' ? (
            <>
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign in with Google <ArrowRight size={18} />
                  </>
                )}
              </button>
              <button 
                onClick={() => setLoginMode('username')}
                className="w-full text-brand-blue text-xs uppercase tracking-widest font-bold hover:underline"
              >
                Use Username Login
              </button>
            </>
          ) : (
            <form onSubmit={handleUsernameLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-brand-light border-none outline-none focus:ring-1 focus:ring-brand-gold text-sm"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Login to Dashboard'}
              </button>
              <button 
                type="button"
                onClick={() => setLoginMode('google')}
                className="w-full text-brand-blue text-xs uppercase tracking-widest font-bold hover:underline"
              >
                Back to Google Login
              </button>
            </form>
          )}

          <div className="p-4 bg-brand-light rounded-sm border border-gray-100 flex items-start gap-3">
            <Lock className="text-brand-gold shrink-0 mt-1" size={18} />
            <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-wider">
              By continuing, you agree that you are an authorized representative of the firm. 
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full text-gray-400 text-xs uppercase tracking-widest hover:text-brand-navy transition-colors"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
