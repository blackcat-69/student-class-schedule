import { useEffect, useRef, useState } from 'react';
import { Class, ClassType } from '../types/schedule';
import { TYPE_LABELS, DAYS } from '../constants';
import { ReminderList } from './ReminderList';

interface FormData {
  courseCode: string;
  name: string;
  lectureName: string;
  type: ClassType;
  day: 0 | 1 | 2 | 3 | 4;
  startTime: string;
  endTime: string;
  reminders: Array<{ id: string; text: string; time: string }>;
}

interface FormErrors {
  courseCode?: string;
  name?: string;
  lectureName?: string;
  startTime?: string;
  endTime?: string;
}

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Omit<Class, 'color'> | Omit<Class, 'color' | 'id'>) => void;
  onDelete?: () => void;
  initialData?: Class;
}

export function ClassFormModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}: ClassFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(initialData));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function getInitialFormData(data?: Class): FormData {
    if (data) {
      return {
        courseCode: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 10),
        name: data.name,
        lectureName: data.lectureName,
        type: data.type,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        reminders: data.reminders.map(r => ({ ...r })),
      };
    }
    return {
      courseCode: '',
      name: '',
      lectureName: '',
      type: 'lecture',
      day: 0,
      startTime: '09:00',
      endTime: '10:30',
      reminders: [],
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(initialData));
      setErrors({});
      setTouched({});
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        trapFocus(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const trapFocus = (e: KeyboardEvent) => {
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements?.length) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const { courseCode, name, lectureName, startTime, endTime } = formData;

    if (!courseCode.trim()) newErrors.courseCode = 'Course code is required';
    else if (courseCode.length > 10) newErrors.courseCode = 'Max 10 characters';

    if (!name.trim()) newErrors.name = 'Subject name is required';
    else if (name.length > 50) newErrors.name = 'Max 50 characters';

    if (!lectureName.trim()) newErrors.lectureName = 'Lecture name is required';
    else if (lectureName.length > 50) newErrors.lectureName = 'Max 50 characters';

    if (startTime >= endTime) newErrors.endTime = 'End time must be after start time';

    setErrors(newErrors);
    setTouched({
      courseCode: true,
      name: true,
      lectureName: true,
      startTime: true,
      endTime: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { reminders, ...rest } = formData;
    const validReminders = reminders.filter(r => r.text.trim());
    const saveData = isEditing && initialData
      ? { ...rest, id: initialData.id, reminders: validReminders }
      : { ...rest, id: undefined, reminders: validReminders };
    onSave(saveData);
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string | number | Array<{ id: string; text: string; time: string }>) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRemindersChange = (reminders: Array<{ id: string; text: string; time: string }>) => {
    handleChange('reminders', reminders);
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Class' : 'Add Class'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <form id="class-form" className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseCode" className="form-label">Course Code</label>
            <input
              ref={firstFocusableRef}
              id="courseCode"
              type="text"
              className="form-input"
              maxLength={10}
              value={formData.courseCode.toUpperCase()}
              onChange={(e) => handleChange('courseCode', e.target.value.toUpperCase())}
              onBlur={() => setTouched((prev) => ({ ...prev, courseCode: true }))}
              placeholder="CS101"
              aria-describedby={errors.courseCode ? 'courseCode-error' : undefined}
              aria-invalid={!!errors.courseCode}
            />
            {errors.courseCode && touched.courseCode && (
              <span id="courseCode-error" className="form-error">{errors.courseCode}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Subject Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              maxLength={50}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="Calculus I"
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && touched.name && (
              <span id="name-error" className="form-error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lectureName" className="form-label">Lecture Name</label>
            <input
              id="lectureName"
              type="text"
              className="form-input"
              maxLength={50}
              value={formData.lectureName}
              onChange={(e) => handleChange('lectureName', e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, lectureName: true }))}
              placeholder="Prof. Smith"
              aria-describedby={errors.lectureName ? 'lectureName-error' : undefined}
              aria-invalid={!!errors.lectureName}
            />
            {errors.lectureName && touched.lectureName && (
              <span id="lectureName-error" className="form-error">{errors.lectureName}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type" className="form-label">Type</label>
              <select
                id="type"
                className="form-select"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as ClassType)}
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="day" className="form-label">Day</label>
              <select
                id="day"
                className="form-select"
                value={formData.day}
                onChange={(e) => handleChange('day', parseInt(e.target.value, 10))}
              >
                {DAYS.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime" className="form-label">Start Time</label>
              <input
                id="startTime"
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, startTime: true }))}
                aria-describedby={errors.startTime ? 'startTime-error' : undefined}
                aria-invalid={!!errors.startTime}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime" className="form-label">End Time</label>
              <input
                id="endTime"
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, endTime: true }))}
                aria-describedby={errors.endTime ? 'endTime-error' : undefined}
                aria-invalid={!!errors.endTime}
              />
              {errors.endTime && touched.endTime && (
                <span id="endTime-error" className="form-error">{errors.endTime}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reminders</label>
            <ReminderList
              reminders={formData.reminders}
              onChange={handleRemindersChange}
            />
          </div>
        </form>
        <footer className="modal-footer">
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => { onDelete?.(); onClose(); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Delete</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            type="submit"
            form="class-form"
            className="btn btn-primary"
            disabled={false}
          >
            {isEditing ? 'Save Changes' : 'Add Class'}
          </button>
        </footer>
      </div>
    </div>
  );
}