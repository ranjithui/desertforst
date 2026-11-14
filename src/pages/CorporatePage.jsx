import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import clients from '../data/clients.json';

const field = 'mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-[rgba(240,236,230,0.6)] px-4 py-3 font-sans text-base text-cocoa placeholder:text-[rgba(138,111,87,0.7)] transition-colors duration-200 hover:border-accent-soft focus-visible:border-accent focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(75,85,62,0.2)]';
const EMPTY = { name: '', phone: '', company: '', email: '', message: '' };

function Logo({ c, hidden }) {
  return (
    <li className="shrink-0" aria-hidden={hidden || undefined} inert={hidden ? '' : undefined}>
      <div className="flex h-16 items-center px-8 md:px-12">
        <img src={c.src} alt={c.alt} loading="lazy" draggable="false" className="max-h-12 w-auto max-w-[150px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
      </div>
    </li>
  );
}

/** /corporate-orders — enquiry form + client logo marquee. */
export default function CorporatePage() {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Corporate Orders | Desert Forest'; }, []);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) return setError('Please enter a valid 10-digit mobile number.');
    setError(''); setState('sending');
    const all = JSON.parse(localStorage.getItem('ksb.enquiries') || '[]');
    localStorage.setItem('ksb.enquiries', JSON.stringify([{ ...form, date: new Date().toISOString() }, ...all]));
    setTimeout(() => { setState('sent'); setForm(EMPTY); }, 500);
  };

  return (
    <div className="bg-cream">
      <section className="container grid items-start gap-10 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div className="lg:sticky lg:top-[calc(var(--site-header)+1.5rem)] lg:transition-[top] lg:duration-300 lg:pt-6">
          <p className="animate-slide-up font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent [animation-fill-mode:both] motion-reduce:animate-none">Corporate orders</p>
          <h1 className="mt-4 animate-slide-up font-display text-4xl font-semibold leading-[1.1] text-cocoa text-balance [animation-delay:80ms] [animation-fill-mode:both] motion-reduce:animate-none md:text-5xl xl:text-6xl">Cakes for teams, launches and clients.</h1>
          <p className="mt-5 max-w-xl animate-slide-up font-sans text-lg leading-relaxed text-cocoa-muted [animation-delay:160ms] [animation-fill-mode:both] motion-reduce:animate-none">Branded cakes and bulk bakes for offices across Coimbatore. Tell us what you need and our team will call you back.</p>
        </div>
        <div className="animate-slide-up rounded-3xl border border-[color:var(--line)] bg-white p-6 [animation-delay:200ms] [animation-fill-mode:both] motion-reduce:animate-none sm:p-8">
          {state === 'sent' ? (
            <div className="py-10 text-center animate-in fade-in duration-300" role="status">
              <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-cocoa">Thanks, we've got it</h2>
              <p className="mt-2 font-sans text-sm text-cocoa-light">Our corporate team will call you back within one working day.</p>
              <button type="button" onClick={() => setState('idle')} className="mt-6 font-sans text-sm font-semibold text-accent underline underline-offset-4">Send another enquiry</button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold text-cocoa">Tell us what you need</h2>
              <p className="mb-6 mt-1.5 font-sans text-sm text-cocoa-light">We usually call back within one working day.</p>
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-sans text-sm font-medium text-cocoa">Your name</span>
                    <input required minLength={2} maxLength={100} autoComplete="name" className={field} value={form.name} onChange={set('name')} />
                  </label>
                  <label className="block">
                    <span className="font-sans text-sm font-medium text-cocoa">Phone number</span>
                    <input required type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className={field} value={form.phone} onChange={set('phone')} />
                  </label>
                </div>
                <label className="block">
                  <span className="font-sans text-sm font-medium text-cocoa">Company name</span>
                  <input required minLength={2} maxLength={120} autoComplete="organization" className={field} value={form.company} onChange={set('company')} />
                </label>
                <label className="block">
                  <span className="font-sans text-sm font-medium text-cocoa">Work email</span>
                  <input required type="email" autoComplete="email" maxLength={200} className={field} value={form.email} onChange={set('email')} />
                </label>
                <label className="block">
                  <span className="font-sans text-sm font-medium text-cocoa">Message <span className="font-normal text-cocoa-light">(optional)</span></span>
                  <textarea rows={4} maxLength={2000} placeholder="How many cakes, for when, and anything about branding" className={field} value={form.message} onChange={set('message')} />
                </label>
                {error && <p className="font-sans text-sm text-red-600" role="alert">{error}</p>}
                <button type="submit" disabled={state === 'sending'} className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 font-sans text-base font-semibold text-cream transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
                  {state === 'sending' ? 'Sending…' : 'Send enquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
      {clients.length > 0 && (<section className="border-y border-[color:var(--line)] bg-white py-10 md:py-12" aria-label="Companies we bake for">
        <p className="container text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-cocoa-light">Trusted by teams at</p>
        <div className="group mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="overflow-hidden [container-type:inline-size]">
            <ul style={{ '--marquee-duration': '84s' }} className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
              {clients.map(c => <Logo key={c.src} c={c} />)}
              {clients.map(c => <Logo key={`${c.src}-dup`} c={c} hidden />)}
            </ul>
          </div>
        </div>
      </section>)}
    </div>
  );
}
