import React, { useState } from 'react';
import { useEnrollments } from '../hooks/useEnrollments';
import { useStudents } from '../../students/hooks/useStudents';
import { useCourses } from '../../courses/hooks/useCourses';
import { Enrollment } from '../types/enrollment.types';
import { NewEnrollmentModal } from '../components/NewEnrollmentModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Select } from '../../../shared/components/ui/Select';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { formatDate } from '../../../shared/utils/helpers';
import { useAuth } from '../../auth/context/AuthContext';
import {
  UserCheck,
  PlusCircle,
  XCircle,
  CheckCircle,
} from 'lucide-react';

export const EnrollmentsPage: React.FC = () => {
  const {
    enrollments,
    isLoading,
    filters,
    setFilters,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  } = useEnrollments();

  const { isAdmin, isStudent } = useAuth();
  const { students } = useStudents();
  const { courses } = useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleSemesterFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, semester: e.target.value }));
  };

  const handleDrop = async (enr: Enrollment) => {
    if (window.confirm(`Drop ${enr.student?.firstName || 'Student'} from ${enr.course?.code || 'Course'}?`)) {
      await updateEnrollment(enr.id, { status: 'Dropped' });
    }
  };

  const handleComplete = async (enr: Enrollment) => {
    await updateEnrollment(enr.id, { status: 'Completed' });
  };

  const handleDelete = async (enr: Enrollment) => {
    if (window.confirm('Delete enrollment record permanently?')) {
      await deleteEnrollment(enr.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isStudent ? 'My Course Registrations' : 'Course Enrollments'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent
              ? 'Active term schedule, enrolled subjects, and credit statuses'
              : 'Enroll students in active courses, track terms, and manage completion states'}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            New Enrollment
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            value={filters.semester || 'All'}
            onChange={handleSemesterFilter}
            options={[
              { label: 'All Semesters', value: 'All' },
              { label: 'Fall 2024', value: 'Fall 2024' },
              { label: 'Spring 2025', value: 'Spring 2025' },
              { label: 'Summer 2025', value: 'Summer 2025' },
            ]}
          />
          <Select
            value={filters.status || 'All'}
            onChange={handleStatusFilter}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Enrolled', value: 'Enrolled' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Dropped', value: 'Dropped' },
            ]}
          />
        </div>
      </Card>

      {/* Enrollments Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-16 text-center">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No enrollment records</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no enrollments matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Course Offering</th>
                  <th className="px-4 py-3.5">Term / Academic Year</th>
                  <th className="px-4 py-3.5">Enrolled Date</th>
                  <th className="px-4 py-3.5">Grade Summary</th>
                  <th className="px-4 py-3.5">Status</th>
                  {isAdmin && <th className="px-4 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-slate-800">
                          {enr.student ? `${enr.student.firstName} ${enr.student.lastName}` : enr.studentId}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {enr.student?.studentId || enr.studentId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                          {enr.course?.code || 'N/A'}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{enr.course?.name || enr.courseId}</p>
                          <p className="text-[11px] text-slate-400">{enr.course?.instructor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{enr.semester}</p>
                      <p className="text-[11px] text-slate-400">{enr.academicYear}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(enr.enrolledDate)}</td>
                    <td className="px-4 py-3">
                      {enr.grade ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-mono">
                            {enr.grade.totalGrade ? `${enr.grade.totalGrade}%` : 'Pending'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {enr.grade.letterGrade || 'INC'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          enr.status === 'Enrolled'
                            ? 'brand'
                            : enr.status === 'Completed'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        {enr.status}
                      </Badge>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {enr.status === 'Enrolled' && (
                            <>
                              <button
                                onClick={() => handleComplete(enr)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDrop(enr)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Drop Student"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(enr)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isAdmin && (
        <NewEnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (data) => {
            await createEnrollment(data);
          }}
          students={students}
          courses={courses}
        />
      )}
    </div>
  );
};
