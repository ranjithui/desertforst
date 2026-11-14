import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, CakeSlice, Clock, Gift, Heart, Leaf, MapPin, Palette, PartyPopper, PenLine,
  ShieldCheck, ShoppingCart, SlidersHorizontal, Sparkles, Star, Truck,
} from 'lucide-react';
import { home } from '../lib/data';
import SmartLink from '../components/ui/SmartLink';
import { Reveal } from '../components/ui/Section';
import { useOrder } from '../components/product/MenuProductCard';
import { variantsOf } from '../components/product/ProductOptionsDialog';

const UP = '/media/ksbakers/uploads/';

/* ---------------- Hero ---------------- */

const SLIDES = [
  { img: `${UP}b9fbf741-4114-4fea-b8f3-c58cca5ef5b7.jpg`, alt: 'chocolate glaze cake' },
  { img: `${UP}fc1b8e8f-c004-423c-9606-3913e567a401.jpg`, alt: 'red and white rosette cake' },
  { img: `${UP}48ca7ae2-2eb6-4051-98c3-9ca766b6f6c7.jpg`, alt: 'pastel rainbow drip cake' },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(n => (n + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="hm-hero" aria-labelledby="hero-heading">
      <div className="hm-hero__art" aria-hidden="true">
        {SLIDES.map((s, n) => (
          <img key={s.img} src={s.img} alt="" className={n === i ? 'is-on' : ''} loading={n === 0 ? 'eager' : 'lazy'} />
        ))}
        <span className="hm-hero__script">Baked<br />Fresh<br />Daily <Heart className="inline h-6 w-6" /></span>
      </div>
      <Leaf className="hm-hero__leaf" strokeWidth={1} aria-hidden="true" />
      <div className="m-wrap hm-hero__inner">
        <div className="hm-hero__copy m-rise">
          <span className="hm-kicker">Freshly baked</span>
          <h1 id="hero-heading" className="hm-hero__title">
            Cakes for Every <em>Celebration</em>
          </h1>
          <p className="hm-hero__lead">Handcrafted cakes, fresh pastries and custom creations for life&apos;s special moments.</p>
          <div className="hm-hero__ctas">
            <Link to="/birthday-cakes" className="hm-btn hm-btn--solid">Shop Cakes <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/custom-cakes" className="hm-btn hm-btn--outline"><CakeSlice className="h-4 w-4" /> Custom Cake</Link>
          </div>
          <div className="hm-dots">
            {SLIDES.map((s, n) => (
              <button key={s.img} type="button" aria-pressed={n === i} aria-label={`Show ${s.alt}`} onClick={() => setI(n)} className={n === i ? 'is-on' : ''} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quick categories ---------------- */

const QUICK = [
  { label: 'Birthday', to: '/birthday-cakes', Icon: CakeSlice, tone: '#fbeee3' },
  { label: 'Anniversary', to: '/anniversary-cakes', Icon: Heart, tone: '#fbe8ea' },
  { label: 'Theme Cakes', to: '/theme-cakes', Icon: Star, tone: '#fdf1dc' },
  { label: 'Occasions', to: '/occasion-cakes', Icon: PartyPopper, tone: '#eef0e6' },
  { label: 'Corporate', to: '/corporate-orders', Icon: Gift, tone: '#f9e9e6' },
  { label: 'Our Menu', to: '/products', Icon: Sparkles, tone: '#f6ecdf' },
];

function QuickCategories() {
  return (
    <nav className="m-wrap hm-quick-wrap" aria-label="Shop by occasion">
      <ul className="hm-quick" role="list">
        {QUICK.map(({ label, to, Icon, tone }) => (
          <li key={label}>
            <Link to={to} className="hm-quick__item" style={{ '--tone': tone }}>
              <span className="hm-quick__icon"><Icon className="h-7 w-7" strokeWidth={1.6} aria-hidden="true" /></span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------- Bestsellers ---------------- */

const BADGES = ['Bestseller', 'New', 'Popular'];

function BestsellerCard({ product, index }) {
  const { order } = useOrder(product);
  const variants = variantsOf(product);
  const from = Math.min(...variants.map(v => v.price_city));
  const first = variants.find(v => v.price_city === from);
  const was = first?.compare_at_price_city > from ? first.compare_at_price_city : 0;
  const badge = product.custom_tag || BADGES[index % BADGES.length];
  const [name, note] = product.name.split(' - ').map(s => s.trim());

  return (
    <article className="hm-card">
      <button type="button" className="hm-card__media" onClick={order} aria-label={`${product.name} — open options`}>
        <img src={product.image_url} alt={product.name} loading="lazy" />
        <span className={`hm-card__badge hm-card__badge--${badge.toLowerCase()}`}>{badge}</span>
      </button>
      <div className="hm-card__body">
        <h3>{name}{note && <><br /><span>({note})</span></>}</h3>
        <p className="hm-card__meta">{variants.length > 1 ? variants.map(v => v.variant_name).join(' · ') : 'Freshly baked'}</p>
        <div className="hm-card__foot">
          <p className="hm-card__price">
            <strong>₹{from}</strong>
            {was > 0 && <s><span className="sr-only">was </span>₹{was}</s>}
          </p>
          <button type="button" className="hm-card__cart" onClick={order} aria-label={`Add ${product.name} to cart`}>
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Bestsellers() {
  return (
    <section className="m-wrap hm-section" aria-labelledby="best-heading">
      <div className="hm-head">
        <h2 id="best-heading" className="hm-h2">Bestsellers</h2>
        <Link to="/products" className="hm-link">View All Cakes <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <ul className="hm-cards" role="list">
        {home.featured.map((p, n) => (
          <li key={p.id}><BestsellerCard product={p} index={n} /></li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Promise strip ---------------- */

const PROMISES = [
  { Icon: Leaf, text: ['Baked', 'In-house'] },
  { Icon: Clock, text: ['Fresh Every', 'Single Day'] },
  { Icon: Truck, text: ['Free Delivery', 'Above ₹999'] },
  { Icon: ShieldCheck, text: ['Eggless', 'Options'] },
];

function PromiseStrip() {
  return (
    <section className="m-wrap" aria-label="Our promise">
      <ul className="hm-promise" role="list">
        {PROMISES.map(({ Icon, text }) => (
          <li key={text[0]}>
            <Icon className="h-9 w-9 shrink-0" strokeWidth={1.3} aria-hidden="true" />
            <span>{text[0]}<br />{text[1]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- Custom cake banner ---------------- */

const CUSTOM_FEATURES = [
  { Icon: CakeSlice, label: 'Any Design' },
  { Icon: Palette, label: 'Personalised Themes' },
  { Icon: SlidersHorizontal, label: 'Custom Flavours' },
  { Icon: Heart, label: 'Made for Every Occasion' },
];

function CustomBanner() {
  return (
    <section className="m-wrap hm-section" aria-labelledby="custom-heading">
      <Reveal className="hm-custom">
        <div className="hm-custom__art" aria-hidden="true">
          <img src={`${UP}eb584a03-77db-4355-91b0-809ac233065f.jpg`} alt="" loading="lazy" />
        </div>
        <div className="hm-custom__copy">
          <span className="hm-kicker">Custom creations</span>
          <h2 id="custom-heading" className="hm-h2 mt-2">Design Your<br /><em>Dream Cake</em></h2>
          <p>Bring your ideas to life with our custom cakes, themes and flavours.</p>
          <Link to="/custom-cakes" className="hm-btn hm-btn--outline hm-btn--sm mt-5">Create Your Cake <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ul className="hm-custom__list" role="list">
          {CUSTOM_FEATURES.map(({ Icon, label }) => (
            <li key={label}><Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden="true" /> {label}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ---------------- How it works ---------------- */

const STEPS = [
  { Icon: ShoppingCart, title: 'Choose Your Cake', text: 'Browse our collection and pick your favourite.' },
  { Icon: PenLine, title: 'Customise (Optional)', text: 'Add a personal message, theme or design.' },
  { Icon: Truck, title: 'Get It Delivered', text: 'Receive fresh cakes at your doorstep in Coimbatore.' },
];

function HowItWorks() {
  return (
    <section className="m-wrap hm-section" aria-labelledby="how-heading">
      <div className="hm-head hm-head--rule">
        <h2 id="how-heading" className="hm-h2">How It Works</h2>
      </div>
      <ol className="hm-steps">
        {STEPS.map(({ Icon, title, text }, n) => (
          <Reveal as="li" key={title} delay={n * 90} className="hm-step">
            <span className="hm-step__icon"><Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" /></span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            {n < STEPS.length - 1 && <ArrowRight className="hm-step__arrow" aria-hidden="true" />}
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- Stores banner ---------------- */

function StoresBanner() {
  return (
    <section className="m-wrap hm-section" aria-labelledby="stores-heading">
      <Reveal className="hm-stores">
        <div className="hm-stores__art" aria-hidden="true">
          <img src="/Products/Opera Pastry.jpg" alt="" loading="lazy" />
          <img src="/desert-forest-logo.svg" alt="" className="hm-stores__logo" />
        </div>
        <div className="hm-stores__copy">
          <h2 id="stores-heading"><MapPin className="h-9 w-9 shrink-0" aria-hidden="true" /> <span>Visit Our Stores<br />in Coimbatore</span></h2>
          <p>Experience fresh bakes, desserts and more at our outlets.</p>
          <Link to="/stores" className="hm-btn hm-btn--white hm-btn--sm">Find a Store <ArrowRight className="h-4 w-4" /></Link>
          <Leaf className="hm-stores__leaf" strokeWidth={0.7} aria-hidden="true" />
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Shared exports used by other pages ---------------- */

/** Grid of category tiles; used by the Gifting page. */
export function CategoryTiles({ tiles, eyebrow = 'Our collection', title = 'Shop by category', subtitle }) {
  return (
    <section className="m-section" aria-labelledby="categories-heading">
      <div className="m-wrap">
        <div className="m-section-head">
          <div>
            {eyebrow && <span className="m-eyebrow">{eyebrow}</span>}
            <h2 id="categories-heading" className="m-h2 mt-3">{title}</h2>
          </div>
          {subtitle && <p className="m-lead">{subtitle}</p>}
        </div>
        <ul className="m-bento" role="list">
          {tiles.map((t, n) => (
            <Reveal as="li" key={t.id} delay={60 * n}>
              <SmartLink to={t.link} className="m-tile h-full">
                {t.image_url && <img src={t.image_url} alt="" loading="lazy" />}
                <div className="m-tile__body">
                  <div>
                    <small>{String(n + 1).padStart(2, '0')}</small>
                    <h3>{t.label}</h3>
                  </div>
                  <span className="m-tile__arrow" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span>
                </div>
              </SmartLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand({ cta = home.homeCta }) {
  return (
    <section className="m-wrap">
      <div className="m-cta">
        <div>
          <span className="m-eyebrow m-eyebrow--light">Corporate &amp; gifting</span>
          <h2 className="mt-4">{cta.heading}</h2>
          <p>{cta.subheading}</p>
        </div>
        <SmartLink to={cta.cta_url} className="m-btn m-btn--light">
          {cta.cta_text} <ArrowRight className="h-4 w-4" />
        </SmartLink>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="hm relative overflow-x-hidden">
      <Hero />
      <QuickCategories />
      <Bestsellers />
      <PromiseStrip />
      <CustomBanner />
      <HowItWorks />
      <StoresBanner />
    </div>
  );
}
