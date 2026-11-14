import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Reveal } from '../components/ui/Section';
import StarRating from '../components/ui/StarRating';
import { inputCls, labelCls, loadReviews, saveReview, submitCls, textareaCls } from '../components/ui/form';

/** /feedback — review form + list of reviews (persisted locally). */
export default function FeedbackPage() {
  const [reviews, setReviews] = useState(loadReviews);
  const [form, setForm] = useState({ name: '', email: '', productRated: '', reviewText: '' });
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Customer Feedback | Desert Forest'; }, []);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    if (!rating) return setError('Please choose a star rating.');
    const r = { rating, name: form.name, product: form.productRated, text: form.reviewText, date: new Date().toISOString() };
    saveReview(r);
    setReviews(loadReviews());
    setForm({ name: '', email: '', productRated: '', reviewText: '' });
    setRating(0); setError('');
  };

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Reveal className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-bakery-text mb-4">Customer Feedback</h1>
          <p className="text-xl text-gray-600">We value your opinion!</p>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal className="bg-white rounded-xl shadow-soft border border-gray-100 p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-bakery-text mb-6">Leave a Review</h2>
            <form className="space-y-4" onSubmit={submit}>
              <div>
                <label className="block text-sm font-semibold text-bakery-text mb-2">Your Rating</label>
                <StarRating value={rating} onChange={r => { setRating(r); setError(''); }} size="w-10 h-10" idle="text-gray-300" />
                {error && <p className="mt-2 font-sans text-sm text-red-600" role="alert">{error}</p>}
              </div>
              <div className="space-y-2">
                <label className={labelCls} htmlFor="feedback-name">Your Name</label>
                <input type="text" className={inputCls} id="feedback-name" required name="name" value={form.name} onChange={set('name')} />
              </div>
              <div className="space-y-2">
                <label className={labelCls} htmlFor="feedback-email">Email</label>
                <input type="email" className={inputCls} id="feedback-email" required name="email" value={form.email} onChange={set('email')} />
              </div>
              <div className="space-y-2">
                <label className={labelCls} htmlFor="feedback-product">Product (Optional)</label>
                <input type="text" className={inputCls} id="feedback-product" placeholder="e.g., Chocolate Cake" name="productRated" value={form.productRated} onChange={set('productRated')} />
              </div>
              <div className="space-y-2">
                <label className={labelCls} htmlFor="feedback-review">Your Review</label>
                <textarea className={textareaCls} id="feedback-review" name="reviewText" required rows={4} placeholder="Share your experience with us..." value={form.reviewText} onChange={set('reviewText')} />
              </div>
              <button className={submitCls} type="submit">Submit Review</button>
            </form>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-2xl font-bold text-bakery-text mb-6">Customer Reviews</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
                </div>
              ) : reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-bakery-text">{r.name}</p>
                    <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map(n => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                  </div>
                  {r.product && <p className="mt-1 text-xs uppercase tracking-wide text-cocoa-light">{r.product}</p>}
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.text}</p>
                  <p className="mt-3 text-xs text-gray-400">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
