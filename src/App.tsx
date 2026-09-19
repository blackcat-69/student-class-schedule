import { useState, useRef, useEffect } from 'react';
import { Class } from './types/schedule';
import { WeeklyGrid } from './components/WeeklyGrid';
import { FilterBar } from './components/FilterBar';
import { AddClassButton } from './components/AddClassButton';
import { ClassFormModal } from './components/ClassFormModal';
import { DetailModal } from './components/DetailModal';
import { EmptyState } from './components/EmptyState';
import { useSchedule } from './hooks/useSchedule';
import { getSubjectColor } from './utils/colors';

const seedClass: Class = {
  id: 'seed-1',
  name: 'Welcome',
  lectureName: 'Your Schedule',
  day: 0,
  startTime: '09:00',
  endTime: '10:00',
  type: 'lecture',
  color: '#3b82f6',
  reminders: [],
};

function App() {
  const {
    classes,
    filteredClasses,
    filters,
    addClass,
    updateClass,
    deleteClass,
    setFilterDay,
    setFilterSearch,
  } = useSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [detailClass, setDetailClass] = useState<Class | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (classes.length === 0) {
      addClass(seedClass);
    }
  }, [classes, addClass]);

  const handleAddClick = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleClassClick = (classItem: Class) => {
    setDetailClass(classItem);
  };

  const handleEditFromDetail = () => {
    if (detailClass) {
      setEditingClass(detailClass);
      setIsModalOpen(true);
      setDetailClass(null);
    }
  };

  const handleDeleteFromDetail = () => {
    if (detailClass) {
      if (window.confirm('Delete this class?')) {
        deleteClass(detailClass.id);
      }
      setDetailClass(null);
    }
  };

  const handleCloseDetail = () => {
    setDetailClass(null);
  };

  const handleSave = (classData: Omit<Class, 'color'> | Omit<Class, 'color' | 'id'>) => {
    const color = getSubjectColor(classData.name);
    if (editingClass && 'id' in classData && classData.id) {
      updateClass(classData.id, { ...classData, color });
    } else {
      addClass({ ...classData, color });
    }
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    addButtonRef.current?.focus();
  };

  const handleDeleteFromForm = () => {
    if (editingClass) {
      if (window.confirm('Delete this class?')) {
        deleteClass(editingClass.id);
      }
      setIsModalOpen(false);
      setEditingClass(null);
      addButtonRef.current?.focus();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Student Class Schedule</h1>
        <p className="app-subtitle">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </header>

      <FilterBar
        activeDay={filters.day}
        searchQuery={filters.search}
        onDayChange={setFilterDay}
        onSearchChange={setFilterSearch}
      />

      <WeeklyGrid
        classes={filteredClasses}
        onClassClick={handleClassClick}
      />

      {classes.length > 0 && filteredClasses.length === 0 && (
        <EmptyState message="No classes match your search" />
      )}

      <AddClassButton ref={addButtonRef} onClick={handleAddClick} />

      <DetailModal
        classItem={detailClass}
        isOpen={!!detailClass}
        onClose={handleCloseDetail}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <ClassFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDeleteFromForm}
        initialData={editingClass || undefined}
      />
    </div>
  );
}

export default App;