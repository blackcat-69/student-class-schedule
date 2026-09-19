import { Class } from '../types/schedule';
import { DayColumn } from './DayColumn';

interface WeeklyGridProps {
  classes: Class[];
  onClassClick: (_c: Class) => void;
}

export function WeeklyGrid({ classes, onClassClick }: WeeklyGridProps) {
  return (
    <div className="shelves" role="region" aria-label="Weekly schedule">
      {(['0', '1', '2', '3', '4'] as const).map((dayStr) => {
        const day = parseInt(dayStr, 10) as 0 | 1 | 2 | 3 | 4;
        return (
          <DayColumn
            key={day}
            day={day}
            classes={classes}
            onClassClick={onClassClick}
          />
        );
      })}
    </div>
  );
}