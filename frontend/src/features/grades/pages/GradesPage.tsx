import React, { useState } from 'react';
import { useGrades } from '../hooks/useGrades';
import { Grade } from '../types/grade.types';
import { GradeEditModal } from '../components/GradeEditModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Select } from '../../../shared/components/ui/Select';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useAuth } from '../../auth/context/AuthContext';
import { Award, Edit3 } from 'lucide-react';

export const GradesPage: React.FC = () => {
  const { grades, isLoading, filters, setFilters, updateGrade } = useGrades();
  const { isAdmin, isFaculty, isStudent } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const canEditGrades = isAdmin || isFaculty;

  const handleRemarksFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, remarks: e.target.value }));
  };

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isStudent ? 'My Grades & Academic Evaluation' : 'Academic Grading & GPA Calculation'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent
              ? 'Weighted evaluations: Prelim (30%) + Midterm (30%) + Final (40%) and official 4.0 grade point transcript'
              : 'Faculty evaluation sheet: record test scores and compute credit-weighted grade point averages'}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            value={filters.remarks || 'All'}
            onChange={handleRemarksFilter}
            options={[
              { label: 'All Remarks', value: 'All' },
              { label: 'Passed', value: 'Passed' },
              { label: 'Failed', value: 'Failed' },
              { label: 'Incomplete', value: 'Incomplete' },
            ]}
          />
        </div>
      </Card>

      {/* Grades Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : grades.length === 0 ? (
          <div className="py-16 text-center">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No grades found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Grades are automatically created when students enroll in courses.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Course</th>
                  <th className="px-4 py-3.5">Prelim (30%)</th>
                  <th className="px-4 py-3.5">Midterm (30%)</th>
                  <th className="px-4 py-3.5">Final (40%)</th>
                  <th className="px-4 py-3.5">Total Grade</th>
                  <th className="px-4 py-3.5">Letter</th>
                  <th className="px-4 py-3.5">Grade Pt (4.0)</th>
                  <th className="px-4 py-3.5">Remarks</th>
                  {canEditGrades && <th className="px-4 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-slate-800">
                          {grade.student
                            ? `${grade.student.firstName} ${grade.student.lastName}`
                            : grade.studentId}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {grade.student?.studentId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                          {grade.course?.code || 'N/A'}
                        </span>
                        <span className="font-medium text-slate-700 truncate max-w-[150px]">
                          {grade.course?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {grade.prelimGrade !== undefined ? grade.prelimGrade : '-'}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {grade.midtermGrade !== undefined ? grade.midtermGrade : '-'}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {grade.finalGrade !== undefined ? grade.finalGrade : '-'}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {grade.totalGrade !== undefined ? `${grade.totalGrade}%` : '-'}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {grade.letterGrade || 'INC'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {grade.gradePoint !== undefined ? grade.gradePoint.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          grade.remarks === 'Passed'
                            ? 'success'
                            : grade.remarks === 'Failed'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {grade.remarks}
                      </Badge>
                    </td>
                    {canEditGrades && (
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                          icon={<Edit3 className="w-3.5 h-3.5" />}
                        >
                          Grade
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {canEditGrades && (
        <GradeEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          grade={selectedGrade}
          onSubmit={async (id, data) => {
            await updateGrade(id, data);
          }}
        />
      )}
    </div>
  );
};
