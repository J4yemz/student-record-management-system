import React from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface LandingPageProps {
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. Institutional Top Navigation Bar (Solid Colors) */}
      <nav className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none block">
              EduRecord
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Student Information System
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-700 transition-colors">
            Core Features
          </a>
          <a href="#roles" className="hover:text-blue-700 transition-colors">
            Role Access
          </a>
          <a href="#database" className="hover:text-blue-700 transition-colors">
            Supabase DB
          </a>
          <a href="#architecture" className="hover:text-blue-700 transition-colors">
            Architecture
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onGoToLogin}
            className="text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white"
            icon={<Lock className="w-3.5 h-3.5" />}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* 2. Hero Section (Clean, Solid, High-Impact) */}
      <section className="py-16 sm:py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Supabase PostgreSQL Ready • Feature-Based Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Comprehensive Student Records & Academic Grading.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A unified university portal built for Registrars, Faculty, and Students. Manage demographic
            profiles, class rosters, terms, and auto-computed weighted 4.0 GPAs with enterprise-grade reliability.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              onClick={onGoToLogin}
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-8 py-3"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Your Account
            </Button>
          </div>
        </div>

        {/* Hero Interactive Preview Mockup (Solid Colors) */}
        <div className="mt-14 max-w-5xl mx-auto border border-slate-200 rounded-2xl bg-slate-50 p-3 sm:p-5 shadow-sm">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 space-y-6">
            {/* Mock Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Live System Preview
                </span>
                <h3 className="text-lg font-bold text-slate-900">University Registrar Dashboard</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono">
                  AY 2024-2025 • Fall Term
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Supabase DB Synced
                </span>
              </div>
            </div>

            {/* Mock KPI Cards (Solid Colors) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold uppercase text-slate-500">Total Enrolled</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">2,845</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold uppercase text-slate-500">Course Offerings</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">142</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold uppercase text-slate-500">Average GPA</p>
                <p className="text-2xl font-extrabold text-blue-700 mt-1">3.68</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold uppercase text-slate-500">Passing Rate</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">98.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metrics Strip (Solid Colors) */}
      <section className="bg-slate-900 text-white py-12 px-6 sm:px-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-400">100%</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Type-Safe TypeScript Stack</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400">4.0 Scale</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Weighted GPA Engine</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">Postgres</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Supabase Cloud Database</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-amber-400">&lt; 50ms</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">API Query Response</p>
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities (Solid Cards) */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
            System Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Engineered for Academic Precision
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Each module is built as an independent, cohesive feature encompassing UI, services, and backend endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Master Directory</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete student profiles with photo avatars, departmental affiliations, degree programs, contact info, and status tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Grading & Weighted GPA Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated grading calculations factoring in Prelim (30%), Midterm (30%), and Final (40%) exams mapped to the official 4.0 grade point scale.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Course Offerings & Rosters</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage course codes, credit allocations, schedules, rooms, and instructor assignments with interactive class rosters.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Course Enrollment Workflows</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Term registrations with capacity enforcement, duplicate checks, and status tracking (Enrolled, Completed, Dropped).
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Supabase Cloud Database</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Production PostgreSQL schema with foreign-key cascades, indexing, and Row-Level Security (RLS) policies for complete data integrity.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Academic Honor Roll</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated Dean's List and ranking based on cumulative grade points across completed terms and departmental distributions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Role-Based Access (Solid Design) */}
      <section id="roles" className="py-16 bg-slate-50 border-y border-slate-200 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Multi-Role Workflows
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Tailored for University Stakeholders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs font-bold mb-4">
                ADM
              </div>
              <h4 className="text-base font-bold text-slate-900">Registrar Administrators</h4>
              <p className="text-xs text-slate-500 mt-1">Full institutional management</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span>Student registration & profile updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span>Course catalog creation & capacity setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span>Institutional stats & department reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold mb-4">
                FAC
              </div>
              <h4 className="text-base font-bold text-slate-900">Faculty Members</h4>
              <p className="text-xs text-slate-500 mt-1">Instruction & grade submissions</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>View class rosters and student attendance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Input Prelim, Midterm, and Final grades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Auto-calculate student marks & letter grades</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center text-xs font-bold mb-4">
                STU
              </div>
              <h4 className="text-base font-bold text-slate-900">Students</h4>
              <p className="text-xs text-slate-500 mt-1">Academic records & transcripts</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Review active term course enrollments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>View cumulative GPA and official transcript</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Check standing on Academic Honor Roll</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Supabase Database Spotlight */}
      <section id="database" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-2xl border border-slate-200 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Database Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Powered by Supabase PostgreSQL
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The project includes a ready-to-execute <code className="text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded">migrations/</code> and <code className="text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded">seed-accounts.sql</code> script.
              Tables, relations, and initial academic records are provisioned with Row-Level Security.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Button
              size="lg"
              onClick={onGoToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Continue
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Footer (Solid Clean) */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 sm:px-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              E
            </div>
            <span className="font-bold text-slate-800">EduRecord</span>
            <span>— University Student Record Management System</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Feature-Based Architecture • React 19 • Express • TypeScript • Supabase
          </p>
        </div>
      </footer>
    </div>
  );
};
