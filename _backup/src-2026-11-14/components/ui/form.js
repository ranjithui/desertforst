// Shared field styles (shadcn-style Input/Textarea/Label as compiled on the original site).
export const inputCls =
  'flex h-11 w-full rounded-xl border bg-background px-4 py-3 text-base ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-pastel-sand/60 focus-visible:border-accent focus-visible:ring-accent-soft/30';

export const textareaCls =
  'flex min-h-[80px] w-full rounded-xl border border-pastel-sand/60 bg-cream px-4 py-3 text-base ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-accent focus-visible:ring-accent-soft/30';

export const labelCls = 'text-xs font-bold text-muted-foreground uppercase tracking-wide';

export const submitCls =
  'inline-flex items-center justify-center text-sm ring-offset-background transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] h-10 px-4 w-full bg-bakery-text hover:bg-bakery-accent text-white py-6 rounded-xl font-bold';

export const primaryBtnCls =
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full';

/** Reviews are stored locally so the feedback forms work without the original API. */
export const loadReviews = () => { try { return JSON.parse(localStorage.getItem('ksb.reviews')) || []; } catch { return []; } };
export const saveReview = r => localStorage.setItem('ksb.reviews', JSON.stringify([r, ...loadReviews()]));
