import { Class } from '../types/schedule';
import { DAYS, DAY_LABELS } from '../constants';
import { sortByTime } from '../utils/time';
import { ClassBlock } from './ClassBlock';
import { EmptyState } from './EmptyState';

interface DayColumnProps {
  day: 0 | 1 | 2 | 3 | 4;
  classes: Class[];
  onClassClick: (_c: Class) => void;
}

export function DayColumn({ day, classes, onClassClick }: DayColumnProps) {
  const dayClasses = classes
    .filter((c) => c.day === day)
    .sort(sortByTime);

  const dayLabel = DAYS[day];
  const dayFullLabel = DAY_LABELS[day];

  return (
    <section className="shelf" aria-labelledby={`shelf-${dayLabel}`}>
      <header className="shelf__label">
        <span id={`shelf-${dayLabel}`}>{dayLabel}</span>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', opacity: 0.6 }}>{dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''}</span>
      </header>
      <div className="shelf__track" role="list" aria-label={`${dayFullLabel} classes`}>
        {dayClasses.length === 0 ? (
          <EmptyState message={`No classes on ${dayFullLabel}`} />
        ) : (
          dayClasses.map((classItem) => (
            <ClassBlock
              key={classItem.id}
              classItem={classItem}
              onClick={() => onClassClick(classItem)}
            />
          ))
        )}
      </div>
    </section>
  );
}