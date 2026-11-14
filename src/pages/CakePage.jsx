import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, ChevronDown, MapPin, ShoppingBag } from 'lucide-react';
import { cakes, cakeFlavours } from '../lib/data';
import { useShop } from '../context/ShopContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { VegMark } from '../components/ui/Icons';
import NotFound from './NotFound';

const MAX_MSG = 28;

function FlavourSelect({ flavours, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const current = flavours.find(f => f.id === value);
  return (
    <div className="relative" ref={ref}>
      <button type="button" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen(o => !o)} className="flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-pastel-sand/70 bg-white px-3 font-sans text-sm text-cocoa transition-colors duration-200 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <span className="flex min-w-0 items-center gap-2">
          <VegMark />
          <span className="truncate">{current?.name}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label="Flavour" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto overflow-x-hidden rounded-xl border border-pastel-sand/70 bg-white shadow-soft-lg">
          {flavours.map(f => (
            <li key={f.id}>
              <button type="button" role="option" aria-selected={f.id === value} onClick={() => { onChange(f.id); setOpen(false); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left font-sans text-sm text-cocoa transition-colors duration-200 hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:outline-none">
                <VegMark />
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                {f.id === value && <Check className="h-4 w-4 text-accent" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** /cakes/:slug — designer cake detail with weight, flavour and message options. */
export default function CakePage() {
  const { slug } = useParams();
  const cake = cakes[slug];
  const { store, requireStore, addToCart, setCartOpen } = useShop();
  const flavours = cake ? cakeFlavours(cake) : [];
  const [weight, setWeight] = useState(cake?.weights[0]);
  const [flavour, setFlavour] = useState(flavours[0]?.id);
  const [message, setMessage] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!cake) return;
    setWeight(cake.weights[0]); setFlavour(cakeFlavours(cake)[0]?.id); setMessage(''); setActiveImg(0);
    document.title = `${cake.name} | Desert Forest`;
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cake) return <NotFound />;
  const crumb = cake.breadcrumbs?.[0];
  const ratio = weight / cake.weights[0];
  const price = Math.round(cake.from_price * ratio);
  const compare = Math.round(cake.compare_from_price * ratio);
  const images = cake.images?.length ? cake.images : [cake.image_url];

  const order = () =>
    requireStore(() => {
      const fl = flavours.find(f => f.id === flavour);
      addToCart({
        key: `${cake.slug}|${weight}|${flavour}|${message}`,
        name: cake.name,
        meta: [`${weight} kg`, fl?.name, message && `“${message}”`].filter(Boolean).join(' · '),
        price,
        image: cake.image_url,
      });
      setCartOpen(true);
    });

  return (
    <div className="min-h-screen bg-bakery-bg">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            crumb?.category && { label: crumb.category.name, to: `/${crumb.category.slug}` },
            crumb?.sub && { label: crumb.sub.name, to: `/${crumb.category.slug}/${crumb.sub.slug}` },
            { label: cake.name },
          ].filter(Boolean)}
        />
        <div className="mt-5 grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-2xl border border-pastel-sand/50 bg-pastel-sand/30">
              <img src={images[activeImg]} alt={cake.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setActiveImg(i)} aria-label={`Show image ${i + 1}`} className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${i === activeImg ? 'border-accent' : 'border-transparent'}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-5 md:sticky md:top-24">
            <div className="space-y-2">
              <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-cocoa sm:text-3xl">{cake.name}</h1>
              <span className="block font-sans text-xs font-light tracking-wide text-cocoa-light/70">SKU: {cake.sku}</span>
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-sans text-2xl font-semibold tabular-nums text-accent-strong">₹{price.toFixed(2)}</span>
                {compare > price && (
                  <>
                    <s className="font-sans text-base tabular-nums text-cocoa-light decoration-cocoa-light/60"><span className="sr-only">was </span>₹{compare.toFixed(2)}</s>
                    <span className="self-center rounded-full bg-green-100 px-2 py-0.5 font-sans text-[11px] font-semibold text-green-800">Save ₹{compare - price}</span>
                  </>
                )}
                <span className="font-sans text-xs text-cocoa-light/80">(Inclusive of GST)</span>
              </p>
              {cake.description && <p className="font-sans text-sm leading-relaxed text-cocoa-light">{cake.description}</p>}
            </div>
            <div className="space-y-4 rounded-2xl border border-pastel-sand/60 bg-white p-5 shadow-soft">
              <label className="block space-y-1.5">
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cocoa-light">Weight</span>
                <select value={weight} onChange={e => setWeight(Number(e.target.value))} className="h-11 w-full cursor-pointer rounded-xl border border-pastel-sand/70 bg-white px-3 font-sans text-sm text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {cake.weights.map(w => <option key={w} value={w}>{w} kg</option>)}
                </select>
              </label>
              {flavours.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-cocoa-light">Flavour</span>
                  <FlavourSelect flavours={flavours} value={flavour} onChange={setFlavour} />
                </div>
              )}
              <label className="block space-y-1.5">
                <span className="flex items-center justify-between font-sans text-xs font-semibold uppercase tracking-wide text-cocoa-light">
                  Message on the cake
                  <span className="tabular-nums normal-case tracking-normal">{message.length}/{MAX_MSG}</span>
                </span>
                <input maxLength={MAX_MSG} placeholder="Happy Birthday Aarav" value={message} onChange={e => setMessage(e.target.value)} className="h-11 w-full rounded-xl border border-pastel-sand/70 bg-white px-3 font-sans text-sm text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
              </label>
            </div>
            <button type="button" disabled={cake.sold_out} onClick={order} className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-accent bg-cream font-sans text-sm font-bold tracking-wide text-accent-strong transition-colors duration-200 hover:bg-accent hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {cake.sold_out ? 'Sold out' : store ? (<><ShoppingBag className="h-4 w-4" />Add to Cart · ₹{price}</>) : (<><MapPin className="h-4 w-4" />Pick a store to order</>)}
            </button>
            <p className="rounded-xl bg-pastel-sand/30 px-4 py-3 font-sans text-xs leading-relaxed text-cocoa-light">
              Baked to order. Please allow at least {cake.prep_hours} hours, and pick a delivery slot to match at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
