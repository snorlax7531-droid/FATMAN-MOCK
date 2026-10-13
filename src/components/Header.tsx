import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  User as UserIcon,
  Shield,
  ChevronDown,
  Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  appLanguage?: 'EN' | 'HI' | 'DUAL';
  setAppLanguage?: (lang: 'EN' | 'HI' | 'DUAL') => void;
  openLoginModal: () => void;
  openAdminModal: () => void;
  openProfileModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  appLanguage = 'DUAL',
  setAppLanguage = () => {},
  openLoginModal,
  openAdminModal,
  openProfileModal
}) => {
  const { userProfile, isAdmin } = useAuth();

  return (
    <header className="h-18 lg:h-20 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Hamburger & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl lg:max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 lg:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 absolute left-3.5 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, chapters or tests..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 text-sm lg:text-base pl-10 lg:pl-11 pr-4 lg:pr-5 py-2.5 lg:py-3 rounded-full border border-slate-200 focus:border-pink-500 focus:outline-none focus:ring-3 focus:ring-pink-100 transition-all duration-150 shadow-xs"
          />
        </div>
      </div>

      {/* Right: Profile & Admin */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
        {/* Admin Quick Portal Pill if admin */}
        {isAdmin && (
          <button
            onClick={openAdminModal}
            className="hidden md:flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs lg:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-600" />
            <span>Admin Active</span>
          </button>
        )}

        {/* User Card */}
        <div
          onClick={userProfile ? openProfileModal : openLoginModal}
          className="flex items-center gap-3 lg:gap-3.5 pl-2 py-1 cursor-pointer select-none group"
          title="View & Edit Student Profile"
        >
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-sm ring-2 ring-slate-100 overflow-hidden">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] lg:text-xs text-slate-400 font-medium leading-none">
              Welcome
            </div>
            <div className="text-xs lg:text-sm font-bold text-slate-800 leading-tight flex items-center gap-1 mt-0.5 group-hover:text-pink-600 transition-colors">
              <span>{userProfile?.displayName || 'Future Officer'}</span>
              <ChevronDown className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
