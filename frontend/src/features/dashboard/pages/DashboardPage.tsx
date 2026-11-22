import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatCard } from '../components/StatCard';
import { DepartmentDistribution } from '../components/DepartmentDistribution';
import { RecentStudentsList } from '../components/RecentStudentsList';
import { Card } from '../../../shared/components/ui/Card';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Users, BookOpen, GraduationCap, Award, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { ViewTab } from '../../../shared/types/common.types';

interface DashboardPageProps {
  onNavigateTab: (tab: ViewTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const { stats, isLoading, error, refresh } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold">Error loading dashboard</h3>
          <p className="text-sm mt-1">{error || 'Unable to connect to server'}</p>
        </div>
        <Button variant="outline" onClick={refresh} icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time enrollment, academic performance, and department metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('students')}
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Manage Students
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled / Alumni"
          icon={<Users className="w-5 h-5" />}
          colorScheme="brand"
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          subtitle="This Semester"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="purple"
        />
        <StatCard
          title="Average GPA"
          value={stats.averageGpa.toFixed(2)}
          subtitle="4.00 Max Scale"
          icon={<Award className="w-5 h-5" />}
          colorScheme="emerald"
        />
        <StatCard
          title="Passing Rate"
          value={`${stats.passingRate}%`}
          subtitle="Across all evaluations"
          icon={<GraduationCap className="w-5 h-5" />}
          colorScheme="amber"
        />
      </div>

      {/* Grid: Department Distribution + Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentDistribution data={stats.departmentDistribution} />
        <RecentStudentsList
          students={stats.recentStudents}
          onViewAll={() => onNavigateTab('students')}
        />
      </div>

      {/* Dean's List / Top Academic Performers */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-800">Academic Honor Roll (Top Performers)</h4>
          </div>
          <span className="text-xs text-slate-400">Based on cumulative grade points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.topStudents.map((student, idx) => (
            <div
              key={student.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-white hover:border-slate-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-[10px] text-slate-400">{student.program}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  {student.gpa.toFixed(2)} GPA
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
