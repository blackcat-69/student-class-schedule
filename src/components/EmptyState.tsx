import React from 'react';

interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <svg className="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
      </svg>
      <p className="empty-state__message">{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}