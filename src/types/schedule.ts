export type Reminder = {
  id: string;
  text: string;
  time: string;
};

export type ClassType = 'lecture' | 'lab' | 'tutorial' | 'exam';

export type Class = {
  id: string;
  name: string;
  lectureName: string;
  day: 0 | 1 | 2 | 3 | 4;
  startTime: string;
  endTime: string;
  type: ClassType;
  color: string;
  reminders: Reminder[];
};

export type DayFilter = 'all' | 0 | 1 | 2 | 3 | 4;

export type ScheduleFilters = {
  day: DayFilter;
  search: string;
};

export type ScheduleState = {
  classes: Class[];
  filters: ScheduleFilters;
};