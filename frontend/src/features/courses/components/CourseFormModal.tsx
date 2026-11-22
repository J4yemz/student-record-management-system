import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { Course, CreateCourseInput, UpdateCourseInput } from '../types/course.types';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseInput | UpdateCourseInput) => Promise<void>;
  initialData?: Course | null;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<CreateCourseInput>>({
    code: '',
    name: '',
    department: 'Computer Science',
    credits: 3,
    instructor: '',
    schedule: 'Mon/Wed 10:00 - 11:30 AM',
    room: 'Hall A-101',
    capacity: 40,
    semester: 'Fall 2024',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        code: '',
        name: '',
        department: 'Computer Science',
        credits: 3,
        instructor: '',
        schedule: 'Mon/Wed 10:00 - 11:30 AM',
        room: 'Hall A-101',
        capacity: 40,
        semester: 'Fall 2024',
        description: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData as CreateCourseInput);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Course Offering' : 'Add New Course'}
      description="Define course details, instructor, schedule, and room assignment"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Course Code"
            name="code"
            required
            value={formData.code || ''}
            onChange={handleChange}
            placeholder="e.g. CS-201"
          />
          <Input
            label="Course Name"
            name="name"
            required
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="e.g. Operating Systems"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Department"
            name="department"
            value={formData.department || 'Computer Science'}
            onChange={handleChange}
            options={[
              { label: 'Computer Science', value: 'Computer Science' },
              { label: 'Information Technology', value: 'Information Technology' },
              { label: 'Engineering', value: 'Engineering' },
              { label: 'Business Administration', value: 'Business Administration' },
            ]}
          />
          <Input
            label="Credits"
            name="credits"
            type="number"
            min={1}
            max={6}
            required
            value={formData.credits || 3}
            onChange={handleChange}
          />
          <Input
            label="Capacity"
            name="capacity"
            type="number"
            min={5}
            max={200}
            required
            value={formData.capacity || 40}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Instructor"
            name="instructor"
            required
            value={formData.instructor || ''}
            onChange={handleChange}
            placeholder="e.g. Prof. Alan Turing"
          />
          <Input
            label="Room / Hall"
            name="room"
            required
            value={formData.room || ''}
            onChange={handleChange}
            placeholder="e.g. Tech Lab 202"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Weekly Schedule"
            name="schedule"
            required
            value={formData.schedule || ''}
            onChange={handleChange}
            placeholder="e.g. Tue/Thu 02:00 - 03:30 PM"
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Course Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Brief description of course syllabus and objectives..."
            value={formData.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
