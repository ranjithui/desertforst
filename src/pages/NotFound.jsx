import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => { document.title = 'Page not found | Desert Forest'; }, []);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-4 py-20 text-center">
      <p className="font-display text-7xl font-semibold text-accent-soft">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-cocoa md:text-3xl">This page could not be found.</h1>
      <p className="mt-2 max-w-md font-sans text-sm text-cocoa-light">It may have moved, or the link might be out of date.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream transition-colors hover:bg-accent-hover">Back to home</Link>
        <Link to="/products" className="inline-flex h-11 items-center rounded-full border border-accent px-6 font-sans text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-cream">Browse our menu</Link>
      </div>
    </div>
  );
}
