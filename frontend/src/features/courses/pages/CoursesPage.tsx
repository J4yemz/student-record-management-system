import React, { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { Course } from '../types/course.types';
import { CourseFormModal } from '../components/CourseFormModal';
import { CourseRosterModal } from '../components/CourseRosterModal';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Badge } from '../../../shared/components/ui/Badge';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useAuth } from '../../auth/context/AuthContext';
import {
  BookPlus,
  Search,
  Users,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  GraduationCap,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const {
    courses,
    isLoading,
    filters,
    setFilters,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses();

  const { isAdmin, isStudent } = useAuth();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, department: e.target.value }));
  };

  const handleRoster = (course: Course) => {
    setSelectedCourse(course);
    setIsRosterOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleDelete = async (course: Course) => {
    if (
      window.confirm(
        `Are you sure you want to delete course ${course.code} - ${course.name}? All associated enrollments will be removed.`
      )
    ) {
      await deleteCourse(course.id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, data);
    } else {
      await createCourse(data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, configure, and schedule university course offerings and capacities
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingCourse(null);
              setIsFormOpen(true);
            }}
            icon={<BookPlus className="w-4 h-4" />}
          >
            Add New Course
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            placeholder="Search code, course name, instructor..."
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
        </div>
      </Card>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="py-16 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No courses available</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No course records matched your query.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Card key={course.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {course.code}
                  </span>
                  <Badge variant="neutral">{course.credits} Credits</Badge>
                </div>

                <h4 className="text-base font-bold text-slate-800 line-clamp-1">{course.name}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{course.department}</p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {course.description || 'No course overview description provided.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.room}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Instructor:</span>
                    <span className="font-semibold text-slate-700">{course.instructor}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {!isStudent ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoster(course)}
                    icon={<Users className="w-3.5 h-3.5" />}
                  >
                    Class Roster
                  </Button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    Capacity: {course.capacity} seats
                  </span>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Course (Admin)"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Course (Admin)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Course Form Modal */}
      {isAdmin && (
        <CourseFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingCourse}
        />
      )}

      {/* Course Roster Modal */}
      <CourseRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
};
