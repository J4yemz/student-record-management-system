import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { Badge } from '../../../shared/components/ui/Badge';
import { formatDate } from '../../../shared/utils/helpers';
import { ChevronRight } from 'lucide-react';

interface Props {
  students: any[];
  onViewAll?: () => void;
  onSelectStudent?: (student: any) => void;
}

export const RecentStudentsList: React.FC<Props> = ({ students, onViewAll, onSelectStudent }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800">Recently Enrolled Students</h4>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => onSelectStudent && onSelectStudent(student)}
            className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 -mx-2 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={student.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}`}
                alt={student.firstName}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {student.studentId} • {student.program}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  student.status === 'Active'
                    ? 'success'
                    : student.status === 'Graduated'
                    ? 'info'
                    : 'warning'
                }
                size="sm"
              >
                {student.status}
              </Badge>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {formatDate(student.enrollmentDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
