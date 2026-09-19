import { useState, useEffect, useRef } from 'react';
import { DAYS } from '../constants';
import type { DayFilter } from '../types/schedule';

interface FilterBarProps {
  activeDay: DayFilter;
  searchQuery: string;
  onDayChange: (_d: DayFilter) => void;
  onSearchChange: (_q: string) => void;
}

export function FilterBar({ activeDay, searchQuery, onDayChange, onSearchChange }: FilterBarProps) {
  const allDays: DayFilter[] = ['all', 0, 1, 2, 3, 4];
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="filter-bar" role="search" aria-label="Filter classes">
      <div className="filter-bar__day-pills day-pills" role="group" aria-label="Filter by day">
        {allDays.map((d) => {
          const label = d === 'all' ? 'All' : DAYS[d];
          return (
            <button
              key={d}
              className={`day-pill ${activeDay === d ? 'active' : ''}`}
              onClick={() => onDayChange(d)}
              aria-pressed={activeDay === d}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="filter-bar__search">
        <input
          type="search"
          className="search-input"
          placeholder="Search classes..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label="Search classes by name"
        />
      </div>
    </div>
  );
}