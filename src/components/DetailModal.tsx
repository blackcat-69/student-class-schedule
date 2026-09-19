import { useEffect, useRef } from 'react';
import { Class } from '../types/schedule';
import { TYPE_LABELS, TYPE_ICONS } from '../constants';

interface DetailModalProps {
  classItem: Class | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DetailModal({ classItem, isOpen, onClose, onEdit, onDelete }: DetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  if (!isOpen || !classItem) return null;

  const typeIcon = TYPE_ICONS[classItem.type];
  const typeLabel = TYPE_LABELS[classItem.type];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div
        ref={modalRef}
        className="modal-panel detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2 id="detail-title" className="modal-title detail-modal__subject">
              <span className="detail-modal__type-icon" aria-hidden="true">{typeIcon}</span>
              {classItem.name}
            </h2>
            <p className="detail-modal__meta">
              <span className="badge badge-{classItem.type}">{typeLabel}</span>
              <span>{dayLabels[classItem.day]} · {classItem.startTime}–{classItem.endTime}</span>
            </p>
          </div>
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
        <div className="modal-body">
          <section className="detail-modal__section">
            <h3 className="detail-modal__section-title">Instructor</h3>
            <p className="detail-modal__info-value">{classItem.lectureName}</p>
          </section>

          <section className="detail-modal__section">
            <h3 className="detail-modal__section-title">Time & Location</h3>
            <div className="detail-modal__info">
              <div className="detail-modal__info-row">
                <span className="detail-modal__info-label">Day</span>
                <span className="detail-modal__info-value">{dayLabels[classItem.day]}</span>
              </div>
              <div className="detail-modal__info-row">
                <span className="detail-modal__info-label">Time</span>
                <span className="detail-modal__info-value">{classItem.startTime}–{classItem.endTime}</span>
              </div>
              <div className="detail-modal__info-row">
                <span className="detail-modal__info-label">Duration</span>
                <span className="detail-modal__info-value">{calculateDuration(classItem.startTime, classItem.endTime)}</span>
              </div>
              <div className="detail-modal__info-row">
                <span className="detail-modal__info-label">Location</span>
                <span className="detail-modal__info-value">Room TBA</span>
              </div>
            </div>
          </section>

          {classItem.reminders.length > 0 && (
            <section className="detail-modal__section">
              <h3 className="detail-modal__section-title">Reminders</h3>
              <div className="detail-modal__reminders">
                {classItem.reminders.map((reminder) => (
                  <div key={reminder.id} className="detail-modal__reminder">
                    <span>{reminder.text}</span>
                    <span style={{ opacity: 0.7, fontSize: 'var(--text-xs)' }}>{getReminderLabel(reminder.time)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <footer className="modal-footer detail-modal__actions">
          <button
            ref={firstFocusableRef}
            type="button"
            className="btn btn-secondary"
            onClick={onEdit}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>
          <button
            ref={lastFocusableRef}
            type="button"
            className="btn btn-danger"
            onClick={onDelete}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Delete</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

function calculateDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const total = (eh * 60 + em) - (sh * 60 + sm);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

function getReminderLabel(time: string): string {
  const labels: Record<string, string> = {
    '5': '5 min before',
    '10': '10 min before',
    '15': '15 min before',
    '30': '30 min before',
    '60': '1 hour before',
  };
  return labels[time] || time;
}