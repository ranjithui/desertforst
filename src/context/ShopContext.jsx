import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Shared ordering UI state. Orders are placed on WhatsApp (see src/lib/whatsapp.js), so there
// is no cart or store selection: just the product whose options dialog is open, and a toast.
const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [options, setOptions] = useState(null); // product whose options dialog is open
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Clear data left over from the old cart / store-picker flow.
  useEffect(() => { ['ksb.cart', 'ksb.store', 'ksb.exploring'].forEach(k => localStorage.removeItem(k)); }, []);

  const value = useMemo(() => ({ options, setOptions, toast, setToast }), [options, toast]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
