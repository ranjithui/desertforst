import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Plus, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { pages } from '../../lib/data';
import { openWhatsApp, orderMessage, useBranch } from '../../lib/whatsapp';
import Dialog from '../ui/Dialog';
import { WhatsAppIcon } from '../ui/Icons';
import BranchField from './BranchField';

const QUICK_MESSAGES = ['Happy Birthday', 'Happy Anniversary', 'Congratulations', 'Thank You', 'Best Wishes', 'Get Well Soon'];
const MAX_MSG = 34;

export const variantsOf = p =>
  p.variants?.length ? p.variants : [{ id: p.id, variant_name: '', price_city: p.price_city, image_url: p.image_url }];

/** Size / message / add-on picker for menu products (bottom sheet on mobile, centred card on desktop). */
export default function ProductOptionsDialog() {
  const { options: product, setOptions } = useShop();
  const nav = useNavigate();
  const [variantId, setVariantId] = useState(null);
  const [message, setMessage] = useState('');
  const [addons, setAddons] = useState([]);
  const [branch, setBranch] = useBranch();
  const [branchError, setBranchError] = useState('');

  useEffect(() => {
    if (product) { setVariantId(variantsOf(product)[0].id); setMessage(''); setAddons([]); setBranchError(''); }
  }, [product]);

  if (!product) return null;
  const variants = variantsOf(product);
  const variant = variants.find(v => v.id === variantId) || variants[0];
  const textCust = product.customisations?.find(c => c.type === 'TEXT_INPUT');
  const allowsAddons = product.category?.allows_addons;
  const suggested = pages.suggestedAddons;
  const total = variant.price_city + addons.reduce((n, id) => n + (suggested.find(a => a.id === id)?.price || 0), 0);
  const close = () => setOptions(null);
  const toggleAddon = id => setAddons(a => (a.includes(id) ? a.filter(x => x !== id) : [...a, id]));

  // Opens WhatsApp to the orders number with the size, message, add-ons, total and branch.
  const order = () => {
    if (!branch.trim()) { setBranchError('Please enter the branch you want to order from.'); return; }
    setBranchError('');
    const picked = addons.map(id => suggested.find(x => x.id === id)).filter(Boolean);
    openWhatsApp(orderMessage({
      name: product.name,
      sku: variant.sku || product.sku,
      lines: [
        ['Size', variant.variant_name],
        ['Item price', picked.length ? `₹${variant.price_city}` : null],
        ['Message on cake', message && `"${message}"`],
        ['Add-ons', picked.map(a => `${a.name} (₹${a.price})`).join(', ')],
      ],
      total,
      totalLabel: picked.length ? 'Total' : 'Price',
      branch,
    }));
    close();
  };

  return (
    <Dialog
      open
      onClose={close}
      labelledBy="product-options-title"
      overlayClassName="fixed inset-0 z-[110] bg-cocoa/50 backdrop-blur-[2px] animate-in fade-in-0"
      className="fixed z-[111] flex flex-col overflow-hidden bg-cream shadow-2xl inset-x-0 bottom-0 max-h-[92vh] rounded-t-3xl sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl focus:outline-none animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
    >
      <div className="pt-3 pb-1 sm:hidden" aria-hidden="true">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-pastel-sand" />
      </div>
      <button type="button" onClick={close} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-cocoa-light transition-colors duration-200 hover:bg-accent/10 hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-2 sm:px-6 sm:pt-6">
        <div className="flex gap-4 pr-10">
          <img src={variant.image_url || product.image_url} alt={product.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-sm sm:h-24 sm:w-24" />
          <div className="min-w-0 flex-1 self-center">
            <h2 id="product-options-title" className="font-display text-xl font-semibold leading-snug text-cocoa sm:text-2xl">{product.name}</h2>
          </div>
        </div>
        <div className="mt-6 space-y-6">
          {variants.length > 1 && (
            <fieldset className="border-0 p-0">
              <legend className="mb-3 flex w-full items-baseline justify-between gap-2 p-0">
                <span className="font-sans text-sm font-semibold text-cocoa">Choose a size</span>
                <span className="font-sans text-xs font-medium text-cocoa-light">Required</span>
              </legend>
              <div className="grid grid-cols-2 gap-2.5">
                {variants.map(v => {
                  const on = v.id === variant.id;
                  return (
                    <label key={v.id} className={`relative flex min-h-[64px] cursor-pointer flex-col justify-center gap-0.5 rounded-2xl border-2 px-3.5 py-3 transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-cream ${on ? 'border-accent bg-accent/10' : 'border-pastel-sand bg-white hover:border-accent/50 hover:bg-cream-muted'}`}>
                      <input className="sr-only" type="radio" value={v.id} checked={on} onChange={() => setVariantId(v.id)} name="__variants__" />
                      {on && (
                        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-cream" aria-hidden="true">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <span className="font-sans text-sm font-semibold leading-tight text-cocoa">{v.variant_name}</span>
                      <span className="font-sans text-sm font-medium text-cocoa-muted">₹{v.price_city}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {textCust && (
            <fieldset className="border-0 p-0">
              <legend className="mb-3 flex w-full items-baseline justify-between gap-2 p-0">
                <span className="font-sans text-sm font-semibold text-cocoa">{textCust.display_label}</span>
                <span className="font-sans text-xs font-medium text-cocoa-light">{textCust.is_required ? 'Required' : 'Optional'}</span>
              </legend>
              <div>
                <textarea
                  rows={2}
                  maxLength={MAX_MSG}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`e.g. ${textCust.display_label}`}
                  className="w-full resize-none rounded-2xl border-2 bg-white px-4 py-3 font-sans text-base leading-relaxed text-cocoa placeholder:text-cocoa-light/70 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream border-pastel-sand focus:border-accent focus-visible:ring-accent"
                />
                <div className="mt-1.5 flex items-start gap-3">
                  <p className="ml-auto shrink-0 font-sans text-[11px] font-medium tabular-nums transition-colors duration-200 text-cocoa-light" aria-live="polite">{message.length}/{MAX_MSG}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_MESSAGES.map(m => {
                    const on = message === m;
                    return (
                      <button key={m} type="button" aria-pressed={on} onClick={() => setMessage(on ? '' : m)} className={`min-h-[36px] cursor-pointer rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${on ? 'border-accent bg-accent text-cream' : 'border-pastel-sand bg-white text-cocoa-muted hover:border-accent/50 hover:bg-cream-muted hover:text-cocoa'}`}>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </fieldset>
          )}

          <BranchField variant="dialog" value={branch} onChange={v => { setBranch(v); if (v.trim()) setBranchError(''); }} error={branchError} />

          {allowsAddons && (
            <div className="min-w-0 border-t border-pastel-sand/70 pt-6">
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="mb-3 flex w-full items-baseline justify-between gap-2 p-0">
                  <span className="font-sans text-sm font-semibold text-cocoa">Add to your cake</span>
                  <span className="font-sans text-xs font-medium text-cocoa-light">Optional</span>
                </legend>
                <ul className="-mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden" role="list">
                  {suggested.map(a => {
                    const on = addons.includes(a.id);
                    return (
                      <li key={a.id} className="w-[7.25rem] shrink-0 snap-start">
                        <button type="button" aria-pressed={on} aria-label={`Add ${a.name}, ₹${a.price}`} onClick={() => toggleAddon(a.id)} className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-2 bg-white text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${on ? 'border-accent' : 'border-pastel-sand hover:border-accent/50'}`}>
                          <span className="relative block aspect-square w-full overflow-hidden bg-pastel-sand/40">
                            <img src={a.images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                            <span aria-hidden="true" className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${on ? 'bg-accent text-cream' : 'bg-white/95 text-cocoa group-hover:bg-accent group-hover:text-cream'}`}>
                              {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            </span>
                          </span>
                          <span className="flex flex-1 flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
                            <span className="line-clamp-2 font-sans text-[13px] font-medium leading-snug text-cocoa">{a.name}</span>
                            <span className="mt-auto font-sans text-[13px] font-semibold tabular-nums text-cocoa-muted">+ ₹{a.price}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button type="button" onClick={() => { close(); nav('/add-ons'); }} className="group inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-lg font-sans text-sm font-semibold text-accent-strong underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:decoration-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent mt-1">
                  Explore more add-ons
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </fieldset>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-pastel-sand bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-cocoa-light">Total</p>
            <p className="font-display text-2xl font-semibold leading-tight tabular-nums text-cocoa">₹{total}</p>
          </div>
          <button type="button" onClick={order} className="df-wa-btn h-12 min-h-[48px] flex-1">
            <WhatsAppIcon className="h-5 w-5" /> Order on WhatsApp
            <span className="sr-only"> (opens WhatsApp)</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
