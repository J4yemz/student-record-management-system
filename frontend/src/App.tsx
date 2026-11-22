import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { Layout } from './shared/components/layout/Layout';
import { ViewTab } from './shared/types/common.types';
import { LandingPage } from './features/landing/pages/LandingPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { StudentsPage } from './features/students/pages/StudentsPage';
import { CoursesPage } from './features/courses/pages/CoursesPage';
import { EnrollmentsPage } from './features/enrollments/pages/EnrollmentsPage';
import { GradesPage } from './features/grades/pages/GradesPage';

type AppView = 'landing' | 'login' | 'portal';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [portalTab, setPortalTab] = useState<ViewTab>('dashboard');

  // Enforce access control: if user tries to enter portal without being authenticated, redirect to login
  useEffect(() => {
    if (view === 'portal' && !isAuthenticated) {
      setView('login');
    }
  }, [view, isAuthenticated]);

  if (view === 'landing') {
    return <LandingPage onGoToLogin={() => setView('login')} />;
  }

  if (view === 'login' || !isAuthenticated) {
    return (
      <LoginPage
        onNavigateHome={() => setView('landing')}
        onLoginSuccess={() => setView('portal')}
      />
    );
  }

  return (
    <Layout
      currentTab={portalTab}
      onSelectTab={setPortalTab}
      onLogout={() => setView('login')}
    >
      {portalTab === 'dashboard' && <DashboardPage onNavigateTab={setPortalTab} />}
      {portalTab === 'students' && <StudentsPage />}
      {portalTab === 'courses' && <CoursesPage />}
      {portalTab === 'enrollments' && <EnrollmentsPage />}
      {portalTab === 'grades' && <GradesPage />}
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
