import { useState } from 'react';
import { Star } from 'lucide-react';

/** Clickable 1–5 star input with hover preview. */
export default function StarRating({ value, onChange, size = 'w-8 h-8', idle = 'text-gray-200' }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] hover:bg-pastel-sand/40 hover:text-accent h-auto w-auto p-0 hover:scale-110 transition-transform"
        >
          <Star className={`${size} ${n <= shown ? 'fill-yellow-400 text-yellow-400' : idle}`} />
        </button>
      ))}
    </div>
  );
}
