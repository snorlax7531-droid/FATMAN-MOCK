import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Phone, Shield, Edit3, X, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onLogout
}) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setEmail(userProfile.email || '');
      setPhoneNumber(userProfile.phoneNumber || '');
    }
  }, [userProfile]);

  if (!isOpen || !userProfile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated: UserProfile = {
        ...userProfile,
        displayName: displayName.trim() || userProfile.displayName,
        email: email.trim() || userProfile.email,
        phoneNumber: phoneNumber.trim() || userProfile.phoneNumber
      };

      await updateProfile(updated);
      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-full bg-white p-1 shadow-lg mb-3 ring-4 ring-white/30 overflow-hidden flex items-center justify-center text-slate-800">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-pink-600" />
            )}
          </div>

          <h2 className="text-xl font-black tracking-tight">{userProfile.displayName}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mt-1 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>{userProfile.role} Account</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Username / Full Name</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{userProfile.displayName}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gmail / Email Address</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{userProfile.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone Number</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{userProfile.phoneNumber || 'Not provided yet'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-pink-400" />
                  <span>Edit Profile Details</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username / Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gmail / Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-100 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
