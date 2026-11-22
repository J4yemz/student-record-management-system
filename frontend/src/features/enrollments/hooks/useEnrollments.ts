import { useState, useEffect, useCallback } from 'react';
import { enrollmentApi } from '../services/enrollmentApi';
import { Enrollment, CreateEnrollmentInput, EnrollmentFilterParams } from '../types/enrollment.types';

export function useEnrollments(initialFilters?: EnrollmentFilterParams) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filters, setFilters] = useState<EnrollmentFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await enrollmentApi.getAll(filters);
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load enrollments');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const createEnrollment = async (input: CreateEnrollmentInput) => {
    const created = await enrollmentApi.create(input);
    setEnrollments((prev) => [created, ...prev]);
    return created;
  };

  const updateEnrollment = async (id: string, input: Partial<CreateEnrollmentInput>) => {
    const updated = await enrollmentApi.update(id, input);
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    return updated;
  };

  const deleteEnrollment = async (id: string) => {
    await enrollmentApi.delete(id);
    setEnrollments((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    enrollments,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  };
}
