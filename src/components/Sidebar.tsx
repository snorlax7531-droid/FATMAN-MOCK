import React from 'react';
import { 
  Home, 
  FileCheck2, 
  CalendarDays, 
  BarChart3, 
  Bookmark, 
  ShoppingBag, 
  BookOpen, 
  Target, 
  Smile,
  ShieldCheck, 
  LogOut,
  Sparkles,
  Layers,
  FolderPlus,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 
  | 'home' 
  | 'attempted' 
  | '60_day_plan' 
  | 'book_pdf'
  | 'created_mocks' 
  | 'subjects' 
  | 'performance' 
  | 'bookmarks' 
  | 'purchase' 
  | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openAdminModal: () => void;
  openStudentLoginModal: () => void;
  openProfileModal?: () => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openAdminModal,
  openStudentLoginModal,
  openProfileModal,
  onCloseMobile
}) => {
  const { userProfile, isAdmin, logout } = useAuth();

  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'attempted' as NavTab, label: 'Attempted Test', icon: FileCheck2 },
    { id: '60_day_plan' as NavTab, label: '60 Day Study Plan', icon: CalendarDays },
    { id: 'bookmarks' as NavTab, label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <aside className="w-64 bg-[#0d121f] text-slate-200 flex flex-col justify-between shrink-0 h-full border-r border-slate-800/80 select-none overflow-y-auto">
      <div>
        {/* Brand Logo Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              setActiveTab('home');
              onCloseMobile?.();
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white shrink-0">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-wider text-pink-500">FATMAN</span>
              </div>
              <div className="text-[11px] font-bold tracking-widest text-white leading-none">
                MOCK TEST
              </div>
              <div className="text-[9px] text-slate-400 font-medium tracking-tight mt-0.5">
                Practice • Improve • Succeed
              </div>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors md:hidden"
              title="Close Menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 font-bold translate-x-0.5'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* My Profile Button matching screenshot */}
          <button
            onClick={() => {
              if (openProfileModal) {
                openProfileModal();
              } else {
                openStudentLoginModal();
              }
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer"
          >
            <User className="w-5 h-5 text-slate-400" />
            <span>My Profile</span>
          </button>

          {/* Admin Tab if authorized */}
          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 mt-2 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-800/40'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Admin Dashboard</span>
                <span className="text-[10px] uppercase font-bold bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded">Pro</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* Sidebar Footer area */}
      <div className="p-4 space-y-4">
        {/* Inspirational Banner with Smile Face */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#161c2d] p-4 text-center border border-slate-800 shadow-inner group hover:border-pink-500/30 transition-all duration-300">
          <div className="absolute top-2 right-2 opacity-15 group-hover:opacity-35 transition-opacity">
            <Sparkles className="w-10 h-10 text-pink-400" />
          </div>
          
          {/* Smiley Face Design Avatar */}
          <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            {/* Glowing blur halo */}
            <div className="absolute inset-0 rounded-full bg-pink-500/25 blur-md group-hover:bg-pink-500/40 transition-all duration-300" />
            
            {/* Circle container */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-purple-600/20 border border-pink-500/40 group-hover:border-pink-400/80 flex items-center justify-center text-pink-400 group-hover:text-pink-300 shadow-lg shadow-pink-500/10 group-hover:scale-105 transition-all duration-300">
              <Smile className="w-6 h-6 stroke-[2.2] group-hover:rotate-6 transition-transform duration-300" />
              {/* Sweet blush cheeks */}
              <span className="absolute bottom-2.5 left-2 w-1.5 h-1 rounded-full bg-pink-400/50 blur-[0.5px]" />
              <span className="absolute bottom-2.5 right-2 w-1.5 h-1 rounded-full bg-pink-400/50 blur-[0.5px]" />
            </div>
          </div>

          <p className="font-['Caveat',cursive] text-2xl font-bold text-white tracking-wide leading-tight group-hover:text-pink-50 transition-colors">
            Small Steps<br />Make Big Results
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full mx-auto mt-2" />
        </div>

        {/* User / Admin Access Footer */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          {userProfile ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-pink-600/30 border border-pink-500/40 flex items-center justify-center font-bold text-pink-300 text-xs shrink-0">
                  {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">{userProfile.displayName}</div>
                  <div className="text-[10px] text-pink-400 capitalize">{userProfile.role}</div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openStudentLoginModal}
              className="w-full py-2 px-3 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Sign In as Student
            </button>
          )}


        </div>
      </div>
    </aside>
  );
};
