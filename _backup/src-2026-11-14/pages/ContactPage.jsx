import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Cake, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../components/ui/Section';
import StarRating from '../components/ui/StarRating';
import { inputCls, saveReview, submitCls, textareaCls } from '../components/ui/form';

const CARD = 'justify-center text-sm font-medium ring-offset-background transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] hover:text-accent-foreground w-full h-auto bg-white p-10 rounded-2xl shadow-soft flex flex-col items-center text-center gap-6 border border-transparent hover:border-bakery-accent/30 hover:bg-white';

/** /queries — "How can we help?" routing cards + quick review form. */
export default function ContactPage() {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Contact Us | Desert Forest'; }, []);

  const submit = e => {
    e.preventDefault();
    if (!rating) return setError('Please choose a star rating.');
    saveReview({ rating, name, text, date: new Date().toISOString() });
    setSent(true); setError(''); setRating(0); setName(''); setText('');
  };

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="bg-bakery-light/50 py-24 px-6 text-center">
        <Reveal>
          <h1 className="text-3xl sm:text-5xl font-bold text-bakery-text mb-6">How can we help?</h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto font-light">From corporate events to dream weddings, we're here to make it sweet.</p>
        </Reveal>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {[
            { to: '/corporate-orders', Icon: Briefcase, title: 'Corporate Orders', text: 'Bulk orders for events and offices.' },
            { to: '/custom-cakes', Icon: Cake, title: 'Custom Orders', text: 'Unique cakes tailored to you.' },
          ].map(({ to, Icon, title, text: t }) => (
            <Link key={to} className={CARD} to={to}>
              <div className="bg-bakery-light p-6 rounded-full text-bakery-accent"><Icon className="w-8 h-8" /></div>
              <div>
                <h2 className="text-2xl font-bold text-bakery-text mb-2">{title}</h2>
                <p className="text-gray-500">{t}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-24">
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-bakery-text">Customer Feedback</h3>
          <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-soft border border-gray-100">
            <h4 className="text-xl font-bold text-bakery-text mb-6">Leave a Review</h4>
            {sent ? (
              <div className="py-8 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
                <p className="mt-4 font-display text-xl font-semibold text-cocoa">Thank you for your review!</p>
                <p className="mt-1 font-sans text-sm text-cocoa-light">We read every message and pass it on to the team.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 font-sans text-sm font-semibold text-accent underline underline-offset-4">Write another</button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={submit}>
                <div className="mb-4"><StarRating value={rating} onChange={r => { setRating(r); setError(''); }} /></div>
                {error && <p className="font-sans text-sm text-red-600" role="alert">{error}</p>}
                <input className={`${inputCls} mb-2`} placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} />
                <textarea className={`${textareaCls} mb-4`} placeholder="Your Review" required rows={3} value={text} onChange={e => setText(e.target.value)} />
                <button className={submitCls} type="submit">Submit Review</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
