import React, { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import { Student } from '../types/student.types';
import { StudentFormModal } from '../components/StudentFormModal';
import { StudentDetailModal } from '../components/StudentDetailModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useAuth } from '../../auth/context/AuthContext';
import {
  UserPlus,
  Search,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const {
    students,
    isLoading,
    filters,
    setFilters,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents();

  const { isAdmin, isStudent, user } = useAuth();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, department: e.target.value }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, yearLevel: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDelete = async (student: Student) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${student.firstName} ${student.lastName} (${student.studentId})? This will also remove their enrollments and grades.`
      )
    ) {
      await deleteStudent(student.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await createStudent(data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isStudent ? 'My Student Profile & Transcript' : 'Student Directory'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isStudent
              ? 'View your institutional demographic information and academic status'
              : 'Manage comprehensive academic records, registrations, and student status'}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add New Student
          </Button>
        )}
      </div>

      {/* Filter Toolbar (Visible to staff/admin, or hidden if student viewing own) */}
      {!isStudent && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Search name, ID, or email..."
              icon={<Search className="w-4 h-4" />}
              value={filters.search || ''}
              onChange={handleSearchChange}
            />
            <Select
              value={filters.department || 'All'}
              onChange={handleDepartmentChange}
              options={[
                { label: 'All Departments', value: 'All' },
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'Information Technology', value: 'Information Technology' },
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Business Administration', value: 'Business Administration' },
              ]}
            />
            <Select
              value={filters.yearLevel || 'All'}
              onChange={handleYearChange}
              options={[
                { label: 'All Year Levels', value: 'All' },
                { label: '1st Year', value: '1st Year' },
                { label: '2nd Year', value: '2nd Year' },
                { label: '3rd Year', value: '3rd Year' },
                { label: '4th Year', value: '4th Year' },
              ]}
            />
            <Select
              value={filters.status || 'All'}
              onChange={handleStatusChange}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Active', value: 'Active' },
                { label: 'Graduated', value: 'Graduated' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' },
              ]}
            />
          </div>
        </Card>
      )}

      {/* Students Data Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No students found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No student records matched your query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Student ID</th>
                  <th className="px-4 py-3.5">Department & Program</th>
                  <th className="px-4 py-3.5">Year Level</th>
                  <th className="px-4 py-3.5">GPA</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            student.avatarUrl ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}`
                          }
                          alt={student.firstName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 font-mono">
                      {student.studentId}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{student.department}</p>
                      <p className="text-[11px] text-slate-400">{student.program}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600">{student.yearLevel}</td>
                    <td className="px-4 py-3 font-bold text-blue-700 font-mono">
                      {student.gpa.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(student)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile & Transcript"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Details (Admin)"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Student (Admin)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      {isAdmin && (
        <StudentFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingStudent}
        />
      )}

      {/* Detail View Modal */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};
