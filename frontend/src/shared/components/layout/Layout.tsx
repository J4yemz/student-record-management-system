import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ViewTab } from '../../types/common.types';

interface LayoutProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
