import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import ProductOptionsDialog from '../product/ProductOptionsDialog';
import { useShop } from '../../context/ShopContext';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) return el.scrollIntoView();
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Toast() {
  const { toast } = useShop();
  if (!toast) return null;
  return (
    <div role="status" className="fixed bottom-24 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-2 rounded-full bg-cocoa px-4 py-2.5 font-sans text-sm text-cream shadow-soft-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 className="h-4 w-4" /> {toast}
    </div>
  );
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ProductOptionsDialog />
      <Toast />
    </>
  );
}
