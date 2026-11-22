import React, { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { CreateEnrollmentInput } from '../types/enrollment.types';
import { Student } from '../../students/types/student.types';
import { Course } from '../../courses/types/course.types';

interface NewEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEnrollmentInput) => Promise<void>;
  students: Student[];
  courses: Course[];
}

export const NewEnrollmentModal: React.FC<NewEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  courses,
}) => {
  const [formData, setFormData] = useState<CreateEnrollmentInput>({
    studentId: students[0]?.id || '',
    courseId: courses[0]?.id || '',
    academicYear: '2024-2025',
    semester: 'Fall 2024',
    status: 'Enrolled',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
      setError('Please select both a student and a course');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process enrollment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll Student in Course"
      description="Select the student, target course offering, and active semester"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <Select
          label="Select Student"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          options={students.map((s) => ({
            label: `${s.studentId} - ${s.firstName} ${s.lastName} (${s.program})`,
            value: s.id,
          }))}
        />

        <Select
          label="Select Course"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          options={courses.map((c) => ({
            label: `${c.code} - ${c.name} (${c.instructor})`,
            value: c.id,
          }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Academic Year"
            name="academicYear"
            value={formData.academicYear || '2024-2025'}
            onChange={handleChange}
            options={[
              { label: '2024-2025', value: '2024-2025' },
              { label: '2025-2026', value: '2025-2026' },
            ]}
          />
          <Select
            label="Semester"
            name="semester"
            value={formData.semester || 'Fall 2024'}
            onChange={handleChange}
            options={[
              { label: 'Fall 2024', value: 'Fall 2024' },
              { label: 'Spring 2025', value: 'Spring 2025' },
              { label: 'Summer 2025', value: 'Summer 2025' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Confirm Enrollment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
