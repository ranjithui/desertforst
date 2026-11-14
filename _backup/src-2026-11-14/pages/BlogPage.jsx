import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/** /blog — the CMS currently has no posts, matching the original's empty state. */
export default function BlogPage() {
  useEffect(() => { document.title = 'Blog | Desert Forest'; }, []);
  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="pt-10 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cocoa mb-4">From Our Kitchen</h1>
          <p className="font-sans text-lg text-cocoa-light font-light">Stories, recipes, and news from Desert Forest.</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
        <p className="font-sans text-cocoa-light">No blog posts yet. Check back soon.</p>
        <Link to="/products" className="mt-6 inline-flex font-sans text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-hover">Browse our menu</Link>
      </div>
    </div>
  );
}
