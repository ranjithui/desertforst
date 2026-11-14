import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MapPin, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/** Floating cart button (bottom-right) + slide-in cart panel. */
export default function CartDrawer() {
  const { cart, count, subtotal, cartOpen, setCartOpen, setQty, store, openPicker } = useShop();
  const nav = useNavigate();

  useEffect(() => {
    if (!cartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = e => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [cartOpen, setCartOpen]);

  const browse = () => { setCartOpen(false); nav('/products'); };
  const checkout = () => { setCartOpen(false); nav('/login?next=checkout'); };

  return (
    <>
      <div className="m-fab fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 animate-in fade-in zoom-in-95 duration-300">
        <button
          className="inline-flex items-center justify-center text-sm font-medium ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative h-14 w-14 rounded-full shadow-soft-lg bg-accent hover:bg-accent-hover text-cream border-0 transition-colors duration-300 focus-visible:ring-accent-soft focus-visible:ring-offset-2"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag className="w-6 h-6" aria-hidden="true" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-cream px-1 font-sans text-[11px] font-bold tabular-nums text-accent shadow-soft">
              {count}
            </span>
          )}
        </button>
      </div>

      {cartOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[99] bg-cocoa/30 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setCartOpen(false)} aria-hidden="true" />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md panel shadow-soft-lg z-[100] flex flex-col border-l border-pastel-sand/50 custom-scrollbar animate-in slide-in-from-right duration-300" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-pastel-sand/50">
              <div className="flex items-baseline gap-2">
                <h2 id="cart-title" className="font-display text-xl font-semibold text-cocoa">Your Cart</h2>
                {count > 0 && <span className="font-sans text-sm text-cocoa-light">({count} {count === 1 ? 'item' : 'items'})</span>}
              </div>
              <button className="inline-flex items-center justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] h-10 w-10 rounded-full text-cocoa-light hover:text-cocoa hover:bg-pastel-sand/40 transition-colors duration-300" aria-label="Close cart" onClick={() => setCartOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="bg-pastel-sand/40 p-4 rounded-full mb-5 text-cocoa-light">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-sans text-cocoa font-medium text-lg">Your cart is empty</p>
                  <p className="font-sans text-cocoa-light mt-2 text-sm">Add something sweet from our shop.</p>
                  <button className="inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] underline-offset-4 hover:underline h-10 px-4 py-2 mt-6 text-accent-strong font-semibold hover:text-accent transition-colors duration-300 cursor-pointer" onClick={browse}>
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-4" role="list">
                  {cart.map(item => (
                    <li key={item.key} className="flex gap-4 rounded-2xl border border-pastel-sand/60 bg-white p-3">
                      <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold leading-snug text-cocoa">{item.name}</p>
                        {item.meta && <p className="mt-0.5 font-sans text-xs text-cocoa-light">{item.meta}</p>}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-full border border-pastel-sand/70">
                            <button type="button" aria-label="Decrease quantity" onClick={() => setQty(item.key, item.qty - 1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cream">
                              {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            </button>
                            <span className="w-6 text-center font-sans text-sm font-semibold tabular-nums text-cocoa">{item.qty}</span>
                            <button type="button" aria-label="Increase quantity" onClick={() => setQty(item.key, item.qty + 1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-cocoa transition-colors hover:bg-cream">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-sans text-sm font-semibold tabular-nums text-accent-strong">₹{item.price * item.qty}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-pastel-sand/50 p-5 md:p-6 space-y-3">
                {store && (
                  <button type="button" onClick={() => { setCartOpen(false); openPicker(); }} className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-pastel-sand/30 px-3 py-2.5 text-left font-sans text-xs text-cocoa-light transition-colors hover:bg-pastel-sand/50">
                    <MapPin className="h-4 w-4 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 truncate">Delivering from <strong className="font-semibold text-cocoa">{store.name}</strong></span>
                    <span className="text-accent underline">Change</span>
                  </button>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-sm text-cocoa-light">Subtotal</span>
                  <span className="font-display text-xl font-semibold tabular-nums text-cocoa">₹{subtotal}</span>
                </div>
                <p className="font-sans text-xs text-cocoa-light">Delivery and taxes are calculated at checkout.</p>
                <button onClick={checkout} className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl bg-accent px-6 font-sans text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-accent-hover">
                  Checkout
                </button>
              </div>
            )}
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
