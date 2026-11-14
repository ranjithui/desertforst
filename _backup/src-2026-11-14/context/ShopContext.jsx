import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Client-side stand-in for the original site's store selection + cart (persisted in localStorage).
const ShopContext = createContext(null);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load('ksb.cart', []));
  const [store, setStore] = useState(() => load('ksb.store', null));
  const [exploring, setExploring] = useState(() => load('ksb.exploring', false));
  const [cartOpen, setCartOpen] = useState(false);
  const [picker, setPicker] = useState(null); // { then?: fn } while the store picker is open
  const [options, setOptions] = useState(null); // product whose options dialog is open
  const [toast, setToast] = useState(null);

  useEffect(() => localStorage.setItem('ksb.cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('ksb.store', JSON.stringify(store)), [store]);
  useEffect(() => localStorage.setItem('ksb.exploring', JSON.stringify(exploring)), [exploring]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  /** Run `then` once a store is chosen (opens the picker first when needed). */
  const requireStore = useCallback(then => {
    if (store) then?.();
    else setPicker({ then });
  }, [store]);

  const chooseStore = useCallback(outlet => {
    setStore(outlet);
    setExploring(false);
    const then = picker?.then;
    setPicker(null);
    if (then) setTimeout(then, 60);
  }, [picker]);

  const addToCart = useCallback(item => {
    setCart(c => {
      const i = c.findIndex(x => x.key === item.key);
      if (i < 0) return [...c, { ...item, qty: item.qty || 1 }];
      const next = [...c];
      next[i] = { ...next[i], qty: next[i].qty + (item.qty || 1) };
      return next;
    });
    setToast(`${item.name} added to cart`);
  }, []);

  const setQty = useCallback((key, qty) =>
    setCart(c => (qty <= 0 ? c.filter(x => x.key !== key) : c.map(x => (x.key === key ? { ...x, qty } : x)))), []);

  const value = useMemo(() => ({
    cart, store, exploring, cartOpen, picker, options, toast,
    count: cart.reduce((n, x) => n + x.qty, 0),
    subtotal: cart.reduce((n, x) => n + x.qty * x.price, 0),
    setCartOpen, setOptions, setToast, setExploring,
    openPicker: () => setPicker({}),
    closePicker: () => setPicker(null),
    explore: () => { setExploring(true); setPicker(null); },
    requireStore, chooseStore, clearStore: () => setStore(null),
    addToCart, setQty, clearCart: () => setCart([]),
  }), [cart, store, exploring, cartOpen, picker, options, toast, requireStore, chooseStore, addToCart, setQty]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
