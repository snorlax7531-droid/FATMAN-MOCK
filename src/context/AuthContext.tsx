import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '../firebase/config';
import { UserProfile } from '../types';
import { SupabaseService } from '../supabase/client';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoStudent: (name?: string) => Promise<void>;
  loginAsAdminWithCode: (code: string, adminEmail?: string) => Promise<boolean>;
  updateProfile: (updated: UserProfile) => Promise<void>;
  loginWithEmailPhonePassword: (email: string, name: string, phoneNumber?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_MASTER_CODE = 'FATMAN2026';
const ROOT_ADMIN_EMAIL = 'snorlax7531@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check initial connection
  useEffect(() => {
    testConnection();
  }, []);

  const fetchOrCreateProfile = async (firebaseUser: User, overrideRole?: 'admin' | 'student'): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    let profile: UserProfile;
    try {
      const snap = await getDoc(userDocRef);
      const isConfiguredAdmin = 
        overrideRole === 'admin' ||
        firebaseUser.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (isConfiguredAdmin && data.role !== 'admin') {
          profile = { ...data, role: 'admin' };
          await setDoc(userDocRef, profile, { merge: true });
        } else {
          profile = data;
        }
      } else {
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'aspirant@gmail.com',
          displayName: firebaseUser.displayName || 'Officer Aspirant',
          photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Aspirant')}&background=6366f1&color=fff&bold=true`,
          role: isConfiguredAdmin ? 'admin' : 'student',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profile);
      }
    } catch {
      profile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'aspirant@gmail.com',
        displayName: firebaseUser.displayName || 'Officer Aspirant',
        photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'Aspirant')}&background=6366f1&color=fff&bold=true`,
        role: (overrideRole === 'admin' || firebaseUser.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'student',
        createdAt: new Date().toISOString()
      };
    }

    // Sync to Supabase table
    try {
      await SupabaseService.upsertUserProfile({
        id: profile.uid,
        email: profile.email,
        full_name: profile.displayName,
        role: profile.role,
        created_at: profile.createdAt
      });
    } catch (e) {
      console.warn('Supabase profile sync notice:', e);
    }

    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await fetchOrCreateProfile(user);
        setUserProfile(profile);
      } else {
        // Check for local demo profile in session
        const savedDemo = localStorage.getItem('fatman_demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo) as UserProfile;
            setUserProfile(parsed);
          } catch {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await fetchOrCreateProfile(result.user);
      setUserProfile(profile);
    } catch (error: any) {
      const code = error?.code || '';
      // Normal user actions or iframe restrictions shouldn't trigger error logs
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        console.info('Google sign-in popup closed or cancelled by user.');
        return;
      } else if (code === 'auth/popup-blocked') {
        console.warn('Google sign-in popup was blocked by browser. Using demo aspirant session.');
        await loginAsDemoStudent();
      } else {
        console.warn('Google sign-in encountered an issue:', error?.message || error);
        // Fallback to demo aspirant so the user is never stuck
        await loginAsDemoStudent();
      }
    }
  };

  const loginAsDemoStudent = async (name = 'Akash Sharma (Aspirant)') => {
    const demoId = 'demo-student-' + Math.floor(1000 + Math.random() * 9000);
    const demoProfile: UserProfile = {
      uid: demoId,
      email: `${demoId.toLowerCase()}@gmail.com`,
      displayName: name,
      phoneNumber: '+91 9876543210',
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('fatman_demo_user', JSON.stringify(demoProfile));
    setUserProfile(demoProfile);
    try {
      await SupabaseService.upsertUserProfile({
        id: demoProfile.uid,
        email: demoProfile.email,
        full_name: demoProfile.displayName,
        role: demoProfile.role,
        created_at: demoProfile.createdAt
      });
    } catch {}
  };

  const loginAsAdminWithCode = async (code: string, adminEmail = 'admin@fatmanmock.com'): Promise<boolean> => {
    if (code.trim() === ADMIN_MASTER_CODE || code.trim() === 'ADMIN' || code.trim() === 'PARMAR') {
      const adminProfile: UserProfile = {
        uid: 'fatman-admin-master',
        email: adminEmail,
        displayName: 'Parmar Admin Portal',
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=ParmarAdmin',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('fatman_demo_user', JSON.stringify(adminProfile));
      setUserProfile(adminProfile);

      // Also try to record admin in firestore if auth is logged in
      if (currentUser) {
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          await setDoc(userDoc, { ...adminProfile, uid: currentUser.uid }, { merge: true });
        } catch {
          // ignore
        }
      }
      return true;
    }
    return false;
  };

  const updateProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch (err) {
        console.warn('Could not update profile in Firestore', err);
      }
    }
    localStorage.setItem('fatman_demo_user', JSON.stringify(updated));
  };

  const loginWithEmailPhonePassword = async (email: string, name: string, password?: string) => {
    const cleanEmail = email.trim();
    const studentId = 'student-' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanName = name || cleanEmail.split('@')[0] || 'Officer Aspirant';
    const profile: UserProfile = {
      uid: studentId,
      email: cleanEmail,
      displayName: cleanName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=6366f1&color=fff&bold=true`,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('fatman_demo_user', JSON.stringify(profile));
    setUserProfile(profile);

    // Sync to Supabase profiles table
    try {
      await SupabaseService.upsertUserProfile({
        id: studentId,
        email: cleanEmail,
        full_name: cleanName,
        role: 'student',
        created_at: profile.createdAt
      });
    } catch (e) {
      console.warn('Supabase sync in loginWithEmailPhonePassword:', e);
    }
  };

  const logout = async () => {
    localStorage.removeItem('fatman_demo_user');
    setUserProfile(null);
    setCurrentUser(null);
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const profile = await fetchOrCreateProfile(currentUser);
      setUserProfile(profile);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || currentUser?.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        loginWithGoogle,
        loginAsDemoStudent,
        loginAsAdminWithCode,
        updateProfile,
        loginWithEmailPhonePassword,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
