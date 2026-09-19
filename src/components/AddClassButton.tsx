import { forwardRef, useEffect } from 'react';

interface AddClassButtonProps {
  onClick: () => void;
}

export const AddClassButton = forwardRef<HTMLButtonElement, AddClassButtonProps>(({ onClick }, ref) => {
  const buttonRef = ref as React.RefObject<HTMLButtonElement>;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && buttonRef.current?.matches(':focus-visible')) {
        buttonRef.current.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [buttonRef]);

  return (
    <button
      ref={buttonRef}
      className="add-class-btn"
      onClick={onClick}
      aria-label="Add class"
      title="Add class"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
});

AddClassButton.displayName = 'AddClassButton';