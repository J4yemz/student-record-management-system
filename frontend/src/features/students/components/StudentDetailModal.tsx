import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { formatDate } from '../../../shared/utils/helpers';
import { studentApi } from '../services/studentApi';
import { Student } from '../types/student.types';
import { Mail, Phone, Calendar, BookOpen, Award } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [details, setDetails] = useState<{ student: Student; enrollments: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setLoading(true);
      studentApi
        .getDetails(student.id)
        .then((data) => setDetails(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setDetails(null);
    }
  }, [student, isOpen]);

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Academic Profile"
      description={`Official student record for ${student.studentId}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={student.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}`}
            alt={student.firstName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold text-slate-800">
                  {student.firstName} {student.lastName}
                </h4>
                <p className="text-xs text-brand-600 font-semibold">{student.program}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant={
                    student.status === 'Active'
                      ? 'success'
                      : student.status === 'Graduated'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {student.status}
                </Badge>
                <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                  {student.yearLevel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Enrolled: {formatDate(student.enrollmentDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-brand-50 rounded-xl border border-brand-100">
            <p className="text-[10px] font-bold uppercase text-brand-600">Cumulative GPA</p>
            <p className="text-xl font-extrabold text-brand-700 mt-0.5">{student.gpa.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-500">Student ID</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{student.studentId}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-500">Department</p>
            <p className="text-xs font-bold text-slate-800 mt-1 truncate">{student.department}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[10px] font-bold uppercase text-slate-500">Gender</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{student.gender}</p>
          </div>
        </div>

        {/* Enrolled Courses & Academic Transcript */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Course Enrolment & Grades
              </h5>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {details?.enrollments?.length || 0} Course(s)
            </span>
          </div>

          {loading ? (
            <Spinner size="sm" />
          ) : !details?.enrollments?.length ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No active courses enrolled for this student.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3.5 py-2.5">Course Code</th>
                    <th className="px-3.5 py-2.5">Title</th>
                    <th className="px-3.5 py-2.5">Credits</th>
                    <th className="px-3.5 py-2.5">Prelim</th>
                    <th className="px-3.5 py-2.5">Midterm</th>
                    <th className="px-3.5 py-2.5">Final</th>
                    <th className="px-3.5 py-2.5">Total</th>
                    <th className="px-3.5 py-2.5">Letter</th>
                    <th className="px-3.5 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {details.enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold text-brand-600">
                        {enr.course?.code || 'N/A'}
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-800">
                        {enr.course?.name || 'N/A'}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500">{enr.course?.credits || 3}</td>
                      <td className="px-3.5 py-2.5 font-mono">{enr.grade?.prelimGrade ?? '-'}</td>
                      <td className="px-3.5 py-2.5 font-mono">{enr.grade?.midtermGrade ?? '-'}</td>
                      <td className="px-3.5 py-2.5 font-mono">{enr.grade?.finalGrade ?? '-'}</td>
                      <td className="px-3.5 py-2.5 font-bold text-slate-800 font-mono">
                        {enr.grade?.totalGrade ?? '-'}
                      </td>
                      <td className="px-3.5 py-2.5 font-bold">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {enr.grade?.letterGrade ?? 'INC'}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5">
                        <Badge
                          variant={
                            enr.grade?.remarks === 'Passed'
                              ? 'success'
                              : enr.grade?.remarks === 'Failed'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {enr.grade?.remarks || 'Incomplete'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
