export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const TYPE_LABELS = {
  lecture: 'Lecture',
  lab: 'Lab',
  tutorial: 'Tutorial',
  exam: 'Exam',
} as const;

export const TYPE_ICONS = {
  lecture: '📘',
  lab: '📓',
  tutorial: '📒',
  exam: '📕',
} as const;

export const STORAGE_KEY = 'student-schedule';
export const STORAGE_VERSION = 1;