import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { Grade, UpdateGradeInput } from '../types/grade.types';

interface GradeEditModalProps {
  grade: Grade | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateGradeInput) => Promise<void>;
}

export const GradeEditModal: React.FC<GradeEditModalProps> = ({
  grade,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{
    prelimGrade: number | '';
    midtermGrade: number | '';
    finalGrade: number | '';
  }>({
    prelimGrade: '',
    midtermGrade: '',
    finalGrade: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (grade) {
      setFormData({
        prelimGrade: grade.prelimGrade ?? '',
        midtermGrade: grade.midtermGrade ?? '',
        finalGrade: grade.finalGrade ?? '',
      });
    }
  }, [grade, isOpen]);

  if (!grade) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(grade.id, {
        prelimGrade: formData.prelimGrade === '' ? undefined : Number(formData.prelimGrade),
        midtermGrade: formData.midtermGrade === '' ? undefined : Number(formData.midtermGrade),
        finalGrade: formData.finalGrade === '' ? undefined : Number(formData.finalGrade),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grade Entry & Evaluation"
      description={`Record test & term scores for ${grade.student?.firstName} ${grade.student?.lastName} in ${grade.course?.code}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Student:</span>
            <span className="font-bold text-slate-800">
              {grade.student?.firstName} {grade.student?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Course:</span>
            <span className="font-bold text-slate-800">
              {grade.course?.code} - {grade.course?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Formula Weight:</span>
            <span className="font-medium text-brand-600">
              Prelim (30%) + Midterm (30%) + Final (40%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Prelim (0-100)"
            name="prelimGrade"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={formData.prelimGrade}
            onChange={handleChange}
            placeholder="e.g. 90"
          />
          <Input
            label="Midterm (0-100)"
            name="midtermGrade"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={formData.midtermGrade}
            onChange={handleChange}
            placeholder="e.g. 92"
          />
          <Input
            label="Final (0-100)"
            name="finalGrade"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={formData.finalGrade}
            onChange={handleChange}
            placeholder="e.g. 95"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Compute & Save Grade
          </Button>
        </div>
      </form>
    </Modal>
  );
};
