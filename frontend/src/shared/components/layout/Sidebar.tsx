import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Award,
  Shield,
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import { ViewTab } from '../../types/common.types';
import { useAuth } from '../../../features/auth/context/AuthContext';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { user, role, isAdmin, isFaculty, isStudent } = useAuth();

  // Role-customized navigation menu items
  const menuItems: { id: ViewTab; label: string; icon: React.ReactNode; roles: string[] }[] = [
    {
      id: 'dashboard',
      label: isStudent ? 'My Overview' : 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'students',
      label: isStudent ? 'My Profile' : 'Students Directory',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'courses',
      label: isFaculty ? 'My Assigned Courses' : isStudent ? 'Course Offerings' : 'Courses Catalog',
      icon: <BookOpen className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'enrollments',
      label: isStudent ? 'My Enrollments' : 'Term Enrollments',
      icon: <ClipboardList className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
    {
      id: 'grades',
      label: isStudent ? 'My Grades & GPA' : isFaculty ? 'Grade Submissions' : 'Academic Grading & GPA',
      icon: <Award className="w-5 h-5" />,
      roles: ['admin', 'faculty', 'student'],
    },
  ];

  // Filter items matching the active user role
  const allowedItems = menuItems.filter((item) => item.roles.includes(role));

  const roleLabels = {
    admin: { label: 'Administrator', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
    faculty: { label: 'Faculty Instructor', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    student: { label: 'Student Account', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-4">
        {/* Active Role Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Role
            </span>
            <Shield className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={cn(
                'text-[11px] font-bold px-2 py-0.5 rounded border capitalize',
                roleLabels[role]?.bg || 'bg-slate-100 text-slate-700'
              )}
            >
              {roleLabels[role]?.label || role}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 font-semibold truncate">
            {user?.name}
          </p>
          <p className="text-[10px] text-slate-400 truncate">{user?.department || user?.email}</p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {allowedItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(isActive ? 'text-blue-700' : 'text-slate-400')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status info */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-bold text-slate-800">Academic Year 2024-2025</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Fall Semester • Active Term</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          RBAC Protection Active
        </div>
      </div>
    </aside>
  );
};
