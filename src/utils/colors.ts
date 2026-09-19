export const SUBJECT_PALETTE = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
];

export function getSubjectColor(subjectName: string): string {
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = ((hash << 5) - hash) + subjectName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SUBJECT_PALETTE.length;
  return SUBJECT_PALETTE[index];
}

export function getContrastText(bgColor: string): '#1a1a2e' | '#f5f5f5' {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? '#1a1a2e' : '#f5f5f5';
}