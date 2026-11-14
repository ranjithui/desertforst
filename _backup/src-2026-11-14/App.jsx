import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import CakePage from './pages/CakePage';
import MenuPage from './pages/MenuPage';
import SearchPage from './pages/SearchPage';
import CustomCakesPage from './pages/CustomCakesPage';
import GiftingPage from './pages/GiftingPage';
import HampersPage from './pages/HampersPage';
import AddOnsPage from './pages/AddOnsPage';
import AboutPage from './pages/AboutPage';
import StoresPage from './pages/StoresPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import FeedbackPage from './pages/FeedbackPage';
import CorporatePage from './pages/CorporatePage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import PolicyPage from './pages/PolicyPage';
import NotFound from './pages/NotFound';

const TITLES = {
  '/': 'Desert Forest — Cakes, Desserts and Celebrations in Coimbatore',
  '/products': 'Our Menu — Cakes, Pastries and Bakes',
};

function TitleSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (TITLES[pathname]) document.title = TITLES[pathname];
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <TitleSync />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<MenuPage />} />
          <Route path="cakes/:slug" element={<CakePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="custom-cakes" element={<CustomCakesPage />} />
          <Route path="gifting" element={<GiftingPage />} />
          <Route path="gifting/:slug" element={<HampersPage />} />
          <Route path="add-ons" element={<AddOnsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="queries" element={<ContactPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="corporate-orders" element={<CorporatePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="privacy-policy" element={<PolicyPage slug="privacy-policy" />} />
          <Route path="terms-and-conditions" element={<PolicyPage slug="terms-and-conditions" />} />
          <Route path="cancellation-and-refund-policy" element={<PolicyPage slug="cancellation-and-refund-policy" />} />
          <Route path=":category" element={<CategoryPage />} />
          <Route path=":category/:sub" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
