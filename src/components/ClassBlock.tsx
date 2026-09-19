import { Class } from '../types/schedule';
import { TYPE_ICONS } from '../constants';
import { getContrastText } from '../utils/colors';

interface ClassBlockProps {
  classItem: Class;
  onClick: () => void;
}

export function ClassBlock({ classItem, onClick }: ClassBlockProps) {
  const textColor = getContrastText(classItem.color);
  const typeIcon = TYPE_ICONS[classItem.type];
  const courseCode = classItem.name.split(' ').map(w => w[0]).join('').toUpperCase();

  const ariaLabel = `${classItem.name}, ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][classItem.day]} ${classItem.startTime}–${classItem.endTime}, ${TYPE_ICONS[classItem.type]} ${classItem.type}`;

  return (
    <div
      className="book"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={ariaLabel}
      style={{
        background: classItem.color,
        color: textColor,
      } as React.CSSProperties}
    >
      <div className="book__spine">
        <span className="book__code">{courseCode}</span>
        <span className="book__subject">
          <span className="book__type-icon" aria-hidden="true">{typeIcon}</span>
          <span className="book__name">{classItem.name}</span>
        </span>
        <span className="book__time">{classItem.startTime}–{classItem.endTime}</span>
        <span className="book__lecture">{classItem.lectureName}</span>
      </div>
    </div>
  );
}