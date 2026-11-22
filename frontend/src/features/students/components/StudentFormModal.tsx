import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import { Button } from '../../../shared/components/ui/Button';
import { Student, CreateStudentInput, UpdateStudentInput } from '../types/student.types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentInput | UpdateStudentInput) => Promise<void>;
  initialData?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<CreateStudentInput>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '2004-01-01',
    gender: 'Male',
    department: 'Computer Science',
    program: 'BS in Computer Science',
    yearLevel: '1st Year',
    status: 'Active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        dateOfBirth: initialData.dateOfBirth,
        gender: initialData.gender,
        department: initialData.department,
        program: initialData.program,
        yearLevel: initialData.yearLevel,
        status: initialData.status,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '2004-01-01',
        gender: 'Male',
        department: 'Computer Science',
        program: 'BS in Computer Science',
        yearLevel: '1st Year',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData as CreateStudentInput);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save student record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Student Record' : 'Register New Student'}
      description={
        initialData
          ? `Update academic and contact information for ${initialData.firstName} ${initialData.lastName}`
          : 'Enter student demographic and degree program details'
      }
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
            label="First Name"
            name="firstName"
            required
            value={formData.firstName || ''}
            onChange={handleChange}
            placeholder="e.g. John"
          />
          <Input
            label="Last Name"
            name="lastName"
            required
            value={formData.lastName || ''}
            onChange={handleChange}
            placeholder="e.g. Doe"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="University Email"
            type="email"
            name="email"
            required
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="e.g. j.doe@university.edu"
          />
          <Input
            label="Contact Phone"
            name="phone"
            required
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth || ''}
            onChange={handleChange}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender || 'Male'}
            onChange={handleChange}
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Degree Program"
            name="program"
            required
            value={formData.program || ''}
            onChange={handleChange}
            placeholder="e.g. BS in Computer Science"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Year Level"
            name="yearLevel"
            value={formData.yearLevel || '1st Year'}
            onChange={handleChange}
            options={[
              { label: '1st Year', value: '1st Year' },
              { label: '2nd Year', value: '2nd Year' },
              { label: '3rd Year', value: '3rd Year' },
              { label: '4th Year', value: '4th Year' },
            ]}
          />
          <Select
            label="Enrollment Status"
            name="status"
            value={formData.status || 'Active'}
            onChange={handleChange}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Graduated', value: 'Graduated' },
              { label: 'Inactive', value: 'Inactive' },
              { label: 'Suspended', value: 'Suspended' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
