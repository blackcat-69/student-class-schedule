import { useState, useMemo, useCallback } from 'react';
import { Class, ScheduleFilters, DayFilter } from '../types/schedule';
import { sortByTime } from '../utils/time';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY, STORAGE_VERSION } from '../constants';

export function useSchedule() {
  const [classes, setClasses] = useLocalStorage<Class[]>(STORAGE_KEY, [], {
    version: STORAGE_VERSION,
    debounceMs: 300,
  });
  const [filters, setFilters] = useState<ScheduleFilters>({
    day: 'all',
    search: '',
  });

  const filteredClasses = useMemo(() => {
    let result = classes;

    if (filters.day !== 'all') {
      result = result.filter((c) => c.day === filters.day);
    }

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.lectureName.toLowerCase().includes(query) ||
          c.name.split(' ').map(w => w[0]).join('').toLowerCase().includes(query)
      );
    }

    return result.sort(sortByTime);
  }, [classes, filters]);

  const addClass = useCallback((classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: crypto.randomUUID(),
    };
    setClasses((prev) => [...prev, newClass]);
  }, [setClasses]);

  const updateClass = useCallback((id: string, patch: Partial<Class>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, [setClasses]);

  const deleteClass = useCallback((id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }, [setClasses]);

  const setFilterDay = useCallback((day: DayFilter) => {
    setFilters((prev) => ({ ...prev, day }));
  }, []);

  const setFilterSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  return {
    classes,
    filteredClasses,
    filters,
    addClass,
    updateClass,
    deleteClass,
    setFilters,
    setFilterDay,
    setFilterSearch,
  };
}