import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { courseApi } from '../services/courseApi';
import { Course } from '../types/course.types';
import { Users, BookOpen } from 'lucide-react';

interface CourseRosterModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseRosterModal: React.FC<CourseRosterModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const [rosterData, setRosterData] = useState<{ course: Course; totalEnrolled: number; roster: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course && isOpen) {
      setLoading(true);
      courseApi
        .getRoster(course.id)
        .then((res) => setRosterData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setRosterData(null);
    }
  }, [course, isOpen]);

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${course.code} - Student Class Roster`}
      description={`${course.name} • ${course.instructor}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs text-slate-500">Enrolled Students</span>
            <p className="text-base font-bold text-slate-800">
              {rosterData?.totalEnrolled || 0} / {course.capacity} Seats
            </p>
          </div>
          <Badge variant="brand">
            {Math.round(((rosterData?.totalEnrolled || 0) / course.capacity) * 100)}% Filled
          </Badge>
        </div>

        {loading ? (
          <Spinner size="sm" />
        ) : !rosterData?.roster?.length ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No students are currently enrolled in this course.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">Student</th>
                  <th className="px-3.5 py-2.5">Student ID</th>
                  <th className="px-3.5 py-2.5">Grade</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rosterData.roster.map((item) => (
                  <tr key={item.enrollmentId} className="hover:bg-slate-50/50">
                    <td className="px-3.5 py-2.5 font-bold text-slate-800">
                      {item.student?.firstName} {item.student?.lastName}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-600">
                      {item.student?.studentId}
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-brand-600">
                      {item.grade?.letterGrade || 'Incomplete'}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <Badge variant="success" size="sm">
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};
