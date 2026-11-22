import { useState, useEffect, useCallback } from 'react';
import { studentApi } from '../services/studentApi';
import { Student, StudentFilterParams, CreateStudentInput, UpdateStudentInput } from '../types/student.types';

export function useStudents(initialFilters?: StudentFilterParams) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<StudentFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await studentApi.getAll(filters);
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = async (input: CreateStudentInput) => {
    const created = await studentApi.create(input);
    setStudents((prev) => [created, ...prev]);
    return created;
  };

  const updateStudent = async (id: string, input: UpdateStudentInput) => {
    const updated = await studentApi.update(id, input);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteStudent = async (id: string) => {
    await studentApi.delete(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    students,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
