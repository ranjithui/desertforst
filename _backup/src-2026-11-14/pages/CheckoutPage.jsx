import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Store } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { inputCls, labelCls } from '../components/ui/form';

const DELIVERY_FREE_ABOVE = 999;
const DELIVERY_FEE = 49;

/** /checkout — order summary, delivery slot and confirmation (orders are confirmed locally). */
export default function CheckoutPage() {
  const { cart, subtotal, store, openPicker, clearCart } = useShop();
  const user = JSON.parse(localStorage.getItem('ksb.user') || 'null');
  const [mode, setMode] = useState('delivery');
  const [form, setForm] = useState({ name: '', address: '', date: new Date().toISOString().slice(0, 10), slot: '18:00 – 20:00' });
  const [placed, setPlaced] = useState(null);
  useEffect(() => { document.title = 'Checkout | Desert Forest'; }, []);

  if (!user) return <Navigate to="/login?next=checkout" replace />;
  if (placed) {
    return (
      <div className="min-h-[60vh] bg-cream px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-cocoa">Order placed</h1>
        <p className="mx-auto mt-3 max-w-md font-sans text-cocoa-light">Order <strong className="text-cocoa">{placed}</strong> is confirmed. {store?.name} will call +91 {user.phone} to confirm your {mode === 'delivery' ? 'delivery' : 'pickup'} slot.</p>
        <Link to="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream hover:bg-accent-hover">Back to home</Link>
      </div>
    );
  }
  if (!cart.length) {
    return (
      <div className="min-h-[60vh] bg-cream px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-cocoa">Your cart is empty</h1>
        <Link to="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 font-sans text-sm font-semibold text-cream hover:bg-accent-hover">Browse Menu</Link>
      </div>
    );
  }

  const delivery = mode === 'delivery' && subtotal < DELIVERY_FREE_ABOVE ? DELIVERY_FEE : 0;
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const place = e => {
    e.preventDefault();
    if (!store) return openPicker();
    setPlaced(`KSB${Date.now().toString().slice(-6)}`);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        <h1 className="mt-3 font-display text-3xl font-semibold text-cocoa">Checkout</h1>
        <form onSubmit={place} className="mt-6 grid gap-8 md:grid-cols-[1fr_22rem]">
          <div className="space-y-5 rounded-2xl border border-pastel-sand/60 bg-white p-5 shadow-soft md:p-6">
            <button type="button" onClick={openPicker} className="flex w-full items-center gap-3 rounded-xl bg-pastel-sand/30 px-4 py-3 text-left font-sans text-sm">
              <Store className="h-5 w-5 text-accent" />
              <span className="flex-1">{store ? <>From <strong className="text-cocoa">{store.name}</strong></> : 'Choose a store'}</span>
              <span className="text-accent underline">Change</span>
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              {['delivery', 'pickup'].map(m => (
                <button key={m} type="button" onClick={() => setMode(m)} className={`h-11 rounded-xl border-2 font-sans text-sm font-semibold capitalize transition-colors ${mode === m ? 'border-accent bg-accent/10 text-cocoa' : 'border-pastel-sand bg-white text-cocoa-muted hover:border-accent/50'}`}>{m}</button>
              ))}
            </div>
            <div className="space-y-2">
              <label className={labelCls} htmlFor="co-name">Name</label>
              <input id="co-name" required className={inputCls} value={form.name} onChange={set('name')} />
            </div>
            {mode === 'delivery' && (
              <div className="space-y-2">
                <label className={labelCls} htmlFor="co-address">Delivery address</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-cocoa-light" />
                  <textarea id="co-address" required rows={3} className={`${inputCls} h-auto pl-10`} value={form.address} onChange={set('address')} />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className={labelCls} htmlFor="co-date">Date</label>
                <input id="co-date" type="date" required min={new Date().toISOString().slice(0, 10)} className={inputCls} value={form.date} onChange={set('date')} />
              </div>
              <div className="space-y-2">
                <label className={labelCls} htmlFor="co-slot">Slot</label>
                <select id="co-slot" className={inputCls} value={form.slot} onChange={set('slot')}>
                  {['10:00 – 12:00', '12:00 – 14:00', '14:00 – 16:00', '16:00 – 18:00', '18:00 – 20:00', '20:00 – 22:00'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <aside className="h-fit space-y-4 rounded-2xl border border-pastel-sand/60 bg-white p-5 shadow-soft md:sticky md:top-[calc(var(--site-header)+1rem)]">
            <h2 className="font-display text-lg font-semibold text-cocoa">Order summary</h2>
            <ul className="space-y-3">
              {cart.map(i => (
                <li key={i.key} className="flex items-start justify-between gap-3 font-sans text-sm">
                  <span className="text-cocoa">{i.qty} × {i.name}{i.meta && <span className="block text-xs text-cocoa-light">{i.meta}</span>}</span>
                  <span className="tabular-nums text-cocoa">₹{i.qty * i.price}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 border-t border-pastel-sand/60 pt-3 font-sans text-sm">
              <p className="flex justify-between text-cocoa-light"><span>Subtotal</span><span className="tabular-nums">₹{subtotal}</span></p>
              <p className="flex justify-between text-cocoa-light"><span>Delivery</span><span className="tabular-nums">{delivery ? `₹${delivery}` : 'Free'}</span></p>
              <p className="flex justify-between pt-1 font-display text-lg font-semibold text-cocoa"><span>Total</span><span className="tabular-nums">₹{subtotal + delivery}</span></p>
            </div>
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-accent font-sans text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-accent-hover">Place order · Pay at {mode === 'delivery' ? 'delivery' : 'store'}</button>
          </aside>
        </form>
      </div>
    </div>
  );
}
