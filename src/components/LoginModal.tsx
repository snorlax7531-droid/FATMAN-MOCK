import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { SupabaseService } from '../supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAdminView?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultAdminView = false
}) => {
  const { loginWithGoogle, loginAsDemoStudent, loginAsAdminWithCode, loginWithEmailPhonePassword } = useAuth();
  const [isAdminView, setIsAdminView] = useState(defaultAdminView);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.info('Sign-in cancelled or closed:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = async () => {
    setLoading(true);
    setErrorMessage('');
    await loginAsDemoStudent('Rahul Sharma (SSC Aspirant)');
    setLoading(false);
    onClose();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage('Sign up failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      const userId = data.user.id;
      const userEmail = data.user.email || email.trim();
      const userName = fullName.trim() || userEmail.split('@')[0];

      // Save user profile to Supabase 'profiles' table
      await SupabaseService.upsertUserProfile({
        id: userId,
        email: userEmail,
        full_name: userName,
        role: 'student',
        created_at: new Date().toISOString()
      });

      await loginWithEmailPhonePassword(userEmail, userName, password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      
      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage('Invalid login credentials. If you are a new student, please click "Sign Up" above to register first.');
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage('Invalid email or password. Please sign up first if you do not have an account.');
        setLoading(false);
        return;
      }

      const userEmail = data.user.email || email.trim();
      const userId = data.user.id;
      const userName = userEmail.split('@')[0];
      
      await SupabaseService.upsertUserProfile({
        id: userId,
        email: userEmail,
        full_name: userName,
        role: 'student',
        created_at: new Date().toISOString()
      });

      await loginWithEmailPhonePassword(userEmail, userName, password);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign in failed. Please check your Supabase credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);

    const success = await loginAsAdminWithCode(adminCode);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setAdminError('Invalid access code. Use master code: FATMAN2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-black text-lg text-pink-600 leading-none">FATMAN</div>
            <div className="text-[10px] font-bold tracking-widest text-slate-800">MOCK TEST PORTAL</div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
          <button
            onClick={() => { setIsAdminView(false); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isAdminView ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-pink-600" />
            <span>Student Portal</span>
          </button>
          <button
            onClick={() => { setIsAdminView(true); setAdminError(''); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isAdminView ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* STUDENT LOGIN VIEW */}
        {!isAdminView ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {authMode === 'signup' ? 'Create Student Account' : 'Sign in to your account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Take timed mock tests, track your percentile, and access complete GK/GS test series.
              </p>
            </div>

            {/* Sign In / Sign Up Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gmail / Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 cursor-pointer"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">Or</span>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.25C.45 8.22 0 10.06 0 12s.45 3.78 1.25 5.39l4.02-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDemoStudent}
                  className="w-full py-2.5 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                >
                  <span>Enter as Demo Student Aspirant</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Username</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gmail / Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your secure password"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-pink-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 cursor-pointer"
                  >
                    {loading ? 'Processing...' : 'Sign Up'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ADMIN LOGIN VIEW */
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-purple-600" />
                <span>Administrator Access</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your administrative authorization code to upload tests, paste bulk questions, or manage student data.
              </p>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {adminError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Access Code / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter code (Hint: FATMAN2026)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick fill code button for testing */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Testing credentials:</span>
              <button
                type="button"
                onClick={() => setAdminCode('FATMAN2026')}
                className="text-purple-600 hover:underline font-bold cursor-pointer"
              >
                Auto-fill Master Code (FATMAN2026)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Open Admin Panel</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Parmar SSC FATMAN GK/GS Test Series • Powered by Supabase & Firebase Auth
          </p>
        </div>

      </div>
    </div>
  );
};
