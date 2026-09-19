import { useState, useCallback } from 'react';
import { Reminder } from '../types/schedule';

const REMINDER_TIMES = [
  { value: '5', label: '5 min before' },
  { value: '10', label: '10 min before' },
  { value: '15', label: '15 min before' },
  { value: '30', label: '30 min before' },
  { value: '60', label: '1 hour before' },
] as const;

interface ReminderListProps {
  reminders: Reminder[];
  onChange: (reminders: Reminder[]) => void;
}

export function ReminderList({ reminders, onChange }: ReminderListProps) {
  const [localReminders, setLocalReminders] = useState<Reminder[]>(reminders);

  const updateReminders = useCallback((newReminders: Reminder[]) => {
    setLocalReminders(newReminders);
    onChange(newReminders);
  }, [onChange]);

  const addReminder = useCallback(() => {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      text: '',
      time: '10',
    };
    updateReminders([...localReminders, newReminder]);
  }, [localReminders, updateReminders]);

  const removeReminder = useCallback((id: string) => {
    updateReminders(localReminders.filter((r) => r.id !== id));
  }, [localReminders, updateReminders]);

  const updateReminderText = useCallback((id: string, text: string) => {
    updateReminders(localReminders.map((r) => (r.id === id ? { ...r, text } : r)));
  }, [localReminders, updateReminders]);

  const updateReminderTime = useCallback((id: string, time: string) => {
    updateReminders(localReminders.map((r) => (r.id === id ? { ...r, time } : r)));
  }, [localReminders, updateReminders]);

  return (
    <div className="reminder-list">
      {localReminders.map((reminder) => (
        <div key={reminder.id} className="reminder-item">
          <input
            type="text"
            className="reminder-item__text form-input"
            placeholder="Reminder text (e.g., Bring textbook)"
            value={reminder.text}
            onChange={(e) => updateReminderText(reminder.id, e.target.value)}
            aria-label="Reminder text"
          />
          <select
            className="reminder-item__time form-select"
            value={reminder.time}
            onChange={(e) => updateReminderTime(reminder.id, e.target.value)}
            aria-label="Reminder time"
          >
            {REMINDER_TIMES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="reminder-item__delete btn btn-ghost btn-icon"
            onClick={() => removeReminder(reminder.id)}
            aria-label={`Delete reminder: ${reminder.text || 'empty'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        className="reminder-add btn btn-ghost"
        onClick={addReminder}
        aria-label="Add reminder"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add reminder</span>
      </button>
    </div>
  );
}