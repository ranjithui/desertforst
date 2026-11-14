import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Minimal accessible modal: portal, overlay click + Esc to close, scroll lock, initial focus. */
export default function Dialog({ open, onClose, overlayClassName, className, labelledBy, describedBy, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const onKey = e => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div data-state="open" className={overlayClassName} aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        data-state="open"
        tabIndex={-1}
        ref={ref}
        className={className}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
