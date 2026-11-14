import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronLeft, Clock, Compass, MapPin, Phone, Store, UserCheck, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { outlets } from '../../lib/data';
import Dialog from '../ui/Dialog';

const area = o => o.name.replace(/^Desert Forest\s*/, '');

/**
 * "Welcome to our menu" → "Set up your order" flow. The original resolves the closest
 * outlet from a saved address; here the delivery areas are the outlet localities.
 */
export default function StorePickerDialog() {
  const { picker, closePicker, explore, chooseStore, store } = useShop();
  const nav = useNavigate();
  const [step, setStep] = useState('welcome');
  const [selected, setSelected] = useState(null);
  const [listOpen, setListOpen] = useState(false);
  const [geoMsg, setGeoMsg] = useState('Location is off - pick an address above, or');
  const listRef = useRef(null);

  useEffect(() => {
    if (picker) { setStep(store ? 'setup' : 'welcome'); setSelected(store); setListOpen(false); }
  }, [picker]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!listOpen) return;
    const onDoc = e => { if (!listRef.current?.contains(e.target)) setListOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [listOpen]);

  const tryLocation = () => {
    if (!navigator.geolocation) return setGeoMsg('Location is not available on this device - pick an address above, or');
    setGeoMsg('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      () => setGeoMsg('We found you, but could not match an outlet automatically - pick your area above, or'),
      () => setGeoMsg('Location is off - pick an address above, or'),
      { timeout: 8000 }
    );
  };

  return (
    <Dialog
      open={!!picker}
      onClose={closePicker}
      labelledBy="store-picker-title"
      describedBy="store-picker-desc"
      overlayClassName="fixed inset-0 bg-cocoa/30 backdrop-blur-sm z-[120] animate-in fade-in"
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[121] w-[calc(100%-1.5rem)] max-w-2xl rounded-3xl border border-pastel-sand/50 bg-cream p-0 shadow-soft-lg focus:outline-none max-h-[min(92vh,800px)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <button type="button" onClick={closePicker} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cocoa-light transition-colors hover:bg-pastel-sand/40 hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <X className="h-5 w-5" />
      </button>

      {step === 'welcome' ? (
        <div className="p-6 sm:p-8">
          <h2 id="store-picker-title" className="font-display text-2xl font-semibold text-cocoa text-center">Welcome to our menu</h2>
          <p id="store-picker-desc" className="font-sans text-cocoa-light text-sm text-center mt-1.5">Shop from a store near you, or just browse what we bake.</p>
          <div className="mt-6 grid gap-3">
            <button type="button" onClick={() => setStep('setup')} className="group flex items-center gap-4 w-full rounded-2xl border border-pastel-sand/60 bg-white p-4 text-left hover:border-accent hover:shadow-soft transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-cream shrink-0 group-hover:scale-105 transition-transform duration-200"><Store className="w-6 h-6" /></span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-cocoa">Shop now</span>
                <span className="block font-sans text-sm text-cocoa-light">Pick a store and order fresh</span>
              </span>
            </button>
            <button type="button" onClick={explore} className="group flex items-center gap-4 w-full rounded-2xl border border-pastel-sand/60 bg-white p-4 text-left hover:border-accent hover:shadow-soft transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-cocoa shrink-0 group-hover:scale-105 transition-transform duration-200"><Compass className="w-6 h-6" /></span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-cocoa">Just exploring</span>
                <span className="block font-sans text-sm text-cocoa-light">Browse the full range</span>
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
          <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-center gap-2 mb-5 pr-10">
              <button type="button" onClick={() => setStep('welcome')} className="rounded-full p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-cocoa-light hover:bg-pastel-sand/40 hover:text-cocoa transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Back to shop or explore">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 id="store-picker-title" className="font-display text-2xl font-semibold text-cocoa">Set up your order</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-6 sm:px-8 py-5">
            <div className="mb-5">
              <p id="deliver-to-label" className="block font-sans text-sm font-medium text-cocoa mb-2">Deliver to</p>
              <div className="relative" ref={listRef}>
                <button type="button" aria-expanded={listOpen} aria-labelledby="deliver-to-label" onClick={() => setListOpen(o => !o)} className="flex items-center gap-3 w-full rounded-2xl border border-pastel-sand/60 bg-white px-4 py-3.5 text-left min-h-[52px] hover:border-accent transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  <span className="flex-1 min-w-0 truncate font-sans text-sm text-cocoa">{selected ? `${area(selected)}, Coimbatore` : 'Select an address'}</span>
                  <ChevronDown className={`w-5 h-5 text-cocoa-light shrink-0 transition-transform duration-200 ${listOpen ? 'rotate-180' : ''}`} />
                </button>
                {listOpen && (
                  <ul role="listbox" aria-label="Delivery area" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto overflow-x-hidden rounded-xl border border-pastel-sand/70 bg-white shadow-soft-lg">
                    {outlets.map(o => (
                      <li key={o.id}>
                        <button type="button" role="option" aria-selected={selected?.id === o.id} onClick={() => { setSelected(o); setListOpen(false); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left font-sans text-sm text-cocoa transition-colors duration-200 hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:outline-none">
                          <MapPin className="h-4 w-4 shrink-0 text-cocoa-light" />
                          <span className="min-w-0 flex-1 truncate">{area(o)}</span>
                          {selected?.id === o.id && <Check className="h-4 w-4 text-accent" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {!selected && (
                <p className="mt-2.5 font-sans text-xs text-cocoa-light">
                  {geoMsg}
                  <button type="button" onClick={tryLocation} className="ml-1 text-accent hover:text-accent-hover underline cursor-pointer">try again</button>.
                </p>
              )}
            </div>
            <p id="store-picker-label" className="block font-sans text-sm font-medium text-cocoa mb-2">Delivering from</p>
            {selected ? (
              <div className="rounded-2xl border border-accent bg-white px-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-cream"><Store className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-cocoa">{selected.name}</p>
                    <p className="mt-0.5 font-sans text-xs leading-relaxed text-cocoa-light">{selected.address}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-cocoa-muted">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selected.hours}</span>
                      <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{selected.phone}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-pastel-sand/60 bg-white px-4 py-4 font-sans text-sm text-cocoa-light">Choose an address above and we'll pick the closest store for you.</p>
            )}
          </div>
          <div className="shrink-0 px-6 pb-6 pt-4 sm:px-8 sm:pb-8 border-t border-pastel-sand/40 bg-cream">
            <button onClick={() => { closePicker(); nav('/login'); }} className="inline-flex items-center justify-center text-sm font-medium transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] border h-10 px-4 py-2 mb-3 w-full rounded-xl border-pastel-sand/70 text-cocoa hover:border-accent hover:bg-accent hover:text-cream bg-white shadow-soft cursor-pointer">
              <UserCheck className="w-4 h-4 mr-2" /> Register / Sign in
            </button>
            <button disabled={!selected} onClick={() => chooseStore(selected)} className="inline-flex items-center justify-center text-sm font-medium transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none active:scale-[0.98] h-10 px-4 py-2 w-full rounded-xl bg-accent text-cream hover:bg-accent-hover shadow-soft disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]">
              {selected ? `Shop from ${area(selected)}` : 'Select a store'}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
