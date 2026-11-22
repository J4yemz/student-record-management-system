import React from 'react';
import { Bell, Search, GraduationCap, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoToLanding, onLogout }) => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    if (onLogout) onLogout();
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Solid Color Icon - No Gradients */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-700 text-white shadow-sm">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">EduRecord</h1>
          <p className="text-[11px] font-medium text-slate-500">Student Record Management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Portal Home
          </button>
        )}

        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
          />
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <Badge variant="brand" size="sm" className="capitalize text-[10px] py-0 px-1.5 bg-blue-50 text-blue-700 border-blue-200">
                {user?.role || 'admin'}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.email || 'admin@university.edu'}</p>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
