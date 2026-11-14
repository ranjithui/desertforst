import { useId } from 'react';
import { MapPin } from 'lucide-react';
import { BRANCHES } from '../../lib/whatsapp';

/**
 * Free-text "Branch" box with the outlet names as suggestions.
 * `variant="dialog"` matches the options dialog's field style; default matches the cake page.
 */
export default function BranchField({ value, onChange, error, variant = 'page' }) {
  const id = useId();
  const listId = `${id}-branches`;
  const dialog = variant === 'dialog';
  return (
    <div className={dialog ? '' : 'space-y-1.5'}>
      <label htmlFor={id} className={dialog
        ? 'mb-3 flex w-full items-baseline justify-between gap-2 font-sans text-sm font-semibold text-cocoa'
        : 'block font-sans text-xs font-semibold uppercase tracking-wide text-cocoa-light'}>
        Branch
        {dialog && <span className="font-sans text-xs font-medium text-cocoa-light">Required</span>}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-light" aria-hidden="true" />
        <input
          id={id}
          list={listId}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. R.S. Puram"
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 font-sans text-sm text-cocoa placeholder:text-cocoa-light/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${error ? 'border-red-400' : 'border-pastel-sand/70'}`}
        />
        <datalist id={listId}>
          {BRANCHES.map(b => <option key={b} value={b} />)}
        </datalist>
      </div>
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 font-sans text-xs text-red-600">{error}</p>}
    </div>
  );
}
