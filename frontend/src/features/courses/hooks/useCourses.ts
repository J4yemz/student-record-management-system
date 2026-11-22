import { useState, useEffect, useCallback } from 'react';
import { courseApi } from '../services/courseApi';
import { Course, CourseFilterParams, CreateCourseInput, UpdateCourseInput } from '../types/course.types';

export function useCourses(initialFilters?: CourseFilterParams) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<CourseFilterParams>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await courseApi.getAll(filters);
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = async (input: CreateCourseInput) => {
    const created = await courseApi.create(input);
    setCourses((prev) => [...prev, created]);
    return created;
  };

  const updateCourse = async (id: string, input: UpdateCourseInput) => {
    const updated = await courseApi.update(id, input);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCourse = async (id: string) => {
    await courseApi.delete(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    courses,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
