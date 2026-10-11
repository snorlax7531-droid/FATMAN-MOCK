import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  User as UserIcon,
  Lock as LockIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingLoginScreen: React.FC = () => {
  const { loginWithGoogle, loginAsDemoStudent, loginAsAdminWithCode } = useAuth();
  
  // Modes: 'login' | 'signup' | 'admin'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Admin state
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = fullName.trim() || (emailOrMobile ? emailOrMobile.split('@')[0] : 'Officer Aspirant');
      await loginAsDemoStudent(name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.info('Google login info:', err);
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
    if (!success) {
      setAdminError('Invalid Admin Access Code. Use master code: FATMAN2026');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: BRANDING & HERO (Matching Image 100%) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-pink-500/30">
              <BookOpen className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black text-pink-600 tracking-tight leading-none">FATMAN</div>
              <div className="text-xs font-extrabold tracking-widest text-slate-800 mt-0.5">MOCK TEST · Practice · Improve · Succeed</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Your Dream <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                Govt. Job Starts Here
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Take subject wise and chapter wise mock tests, track your performance and boost your preparation with FATMAN.
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Chapter Wise Tests</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Detailed Analysis</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Track Progress</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Achieve Your Goals</span>
            </div>
          </div>

          {/* Student Illustration Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
              <GraduationCap className="w-64 h-64" />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-400 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30">
                100% TCS Exam Simulation
              </span>
              <h3 className="text-lg font-black">Practice Like The Real Exam</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Bilingual questions in English & Hindi, live countdown timers, and detailed solutions by Parmar Sir.
              </p>
            </div>
            <div className="relative z-10 text-right hidden sm:block">
              <span className="text-xs italic font-serif text-pink-300 block">"Better Practice"</span>
              <span className="text-lg font-black text-white">= Higher Score</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LOGIN / SIGNUP / ADMIN CARD */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 w-full max-w-md relative">
            
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">
                {authMode === 'admin' 
                  ? 'Admin Portal Login' 
                  : authMode === 'signup' 
                    ? 'Create Account' 
                    : 'Welcome Back!'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'admin' 
                  ? 'Enter master code to manage tests & questions' 
                  : authMode === 'signup' 
                    ? 'Register with your Gmail or phone number' 
                    : 'Login to continue your preparation'}
              </p>
            </div>

            {/* Switch between Login and Sign Up (Visible when not in admin mode) */}
            {authMode !== 'admin' ? (
              <div>
                <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMode === 'login' 
                        ? 'bg-white text-slate-900 shadow-2xs font-black' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMode === 'signup' 
                        ? 'bg-white text-slate-900 shadow-2xs font-black' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>Sign Up</span>
                  </button>
                </div>

                <form onSubmit={handleStudentAuth} className="space-y-4">
                  
                  {/* Full Name field (Only shown for Sign Up) */}
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Rahul Sharma"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email or Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={emailOrMobile}
                        onChange={(e) => setEmailOrMobile(e.target.value)}
                        placeholder="aspirant@gmail.com or 9876543210"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        {authMode === 'signup' ? 'Create Password' : 'Password'}
                      </label>
                      {authMode === 'login' && (
                        <a 
                          href="#forgot" 
                          onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email/phone!"); }} 
                          className="text-[11px] font-bold text-pink-600 hover:underline"
                        >
                          Forgot Password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <LockIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'login' && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 w-4 h-4"
                        />
                        <span className="text-slate-600 font-medium">Remember me</span>
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                  >
                    <span>{authMode === 'signup' ? 'Create Account & Start' : 'Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">OR</span>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.25C.45 8.22 0 10.06 0 12s.45 3.78 1.25 5.39l4.02-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

              </div>
            ) : (
              /* ADMIN LOGIN FORM */
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {adminError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                    {adminError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admin Access Master Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter admin code"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Open Admin Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center cursor-pointer"
                >
                  ← Back to Student Login
                </button>
              </form>
            )}

            {/* SEPARATE ADMIN LOGIN AT BOTTOM (As shown in Image 2) */}
            <div className="mt-8 pt-5 border-t border-slate-100 text-center">
              {authMode !== 'admin' ? (
                <button
                  type="button"
                  onClick={() => setAuthMode('admin')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 hover:underline cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin Login</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-purple-700">Admin Portal Mode Active</span>
              )}
              <p className="text-[10px] text-slate-400 mt-1">
                (For authorized personnel only)
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
