import { useState, useEffect, useCallback } from 'react';
import { gradeApi } from '../services/gradeApi';
import { Grade, UpdateGradeInput, GradeFilterParams } from '../types/grade.types';

export function useGrades(initialFilters?: GradeFilterParams) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filters, setFilters] = useState<GradeFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await gradeApi.getAll(filters);
      setGrades(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load grades');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const updateGrade = async (id: string, input: UpdateGradeInput) => {
    const updated = await gradeApi.update(id, input);
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    return updated;
  };

  return {
    grades,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchGrades,
    updateGrade,
  };
}
