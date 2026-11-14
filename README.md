# KS Bakers — React + Vite replica

A component-based React rebuild of [ksbakers.com](https://ksbakers.com) (Next.js), built to match the
original visually and functionally. All content, images and fonts are stored locally in this project.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # outputs dist/
npm run preview    # serves dist/ on http://localhost:4173
```

Node 18+ is required (the project pins Vite 5 so it runs on Node 18).

## What's inside

```
public/
  logo.png                  brand mark
  fonts/                    Inter + Montserrat (latin, latin-ext), self-hosted woff2
  media/ksbakers/uploads/   all product, banner, category and client images (same paths as the original)
  leadership/               team portraits
  Products/                 menu product photography
src/
  main.jsx, App.jsx         router + routes
  context/ShopContext.jsx   cart, selected store, dialogs (persisted to localStorage)
  components/
    layout/                 AnnouncementBar, Header (sticky, hide-on-scroll), SearchBox, MobileMenu,
                            Footer, CartDrawer, Layout
    product/                CakeCard, MenuProductCard, ProductOptionsDialog, StorePickerDialog
    ui/                     BannerCarousel, Breadcrumbs, Dialog, Section (heading/scallop/reveal),
                            StarRating, SmartLink, Icons, form styles
  pages/                    Home, CategoryPage, CakePage, MenuPage, SearchPage, CustomCakesPage,
                            GiftingPage, HampersPage, AddOnsPage, AboutPage, StoresPage, FaqPage,
                            ContactPage, FeedbackPage, CorporatePage, BlogPage, LoginPage,
                            CheckoutPage, PolicyPage, NotFound
  data/                     JSON content extracted from the original site (272 cakes, 118 menu items,
                            22 outlets, 34 FAQs, legal pages, banners, navigation)
  lib/                      data access, search, sorting, formatting, icon map
  styles/
    site.css                the original site's compiled design system (Tailwind output)
    fonts.css               @font-face rules pointing at /fonts
    extra.css               the handful of utilities the port needs that the original CSS lacked
scripts/                    one-off extraction tooling (see "Refreshing content")
tests/                      Playwright visual comparison + functional tests
```

### Styling approach

The original site is built with Tailwind. Rather than re-deriving styles, the replica reuses the
original compiled stylesheet (`src/styles/site.css`) and writes JSX with the same utility classes,
so colours, typography, spacing, shadows, radii and breakpoints match exactly. Design tokens
(`--cream`, `--cocoa`, `--accent`, …) live in that stylesheet's `:root`.

`node scripts/check-classes.mjs` lists any class used in `src/` that has no CSS rule. Classes the
original site also renders without a rule (for example opacity modifiers on CSS-variable colours) are
recorded in `scripts/raw/original-noop-classes.txt` and kept for fidelity.

### Pages and features

| Route | Notes |
| --- | --- |
| `/` | hero carousel (autoplay, swipe, arrows, dots), stats, category tiles, bestsellers, promo banner, testimonials, corporate CTA |
| `/:category`, `/:category/:sub` | birthday / theme / anniversary / occasion cakes, sub-category chips, sorting |
| `/cakes/:slug` | weight, flavour (custom listbox), message, price by weight, add to cart |
| `/products` | "Our Menu": sticky category tabs with scroll-spy, collapsible sections, mobile list layout |
| `/search?q=` · `/search?flavour=` | live header suggestions, results with price range + category filters |
| `/custom-cakes`, `/corporate-orders` | counter-scrolling marquees, WhatsApp CTA, enquiry form |
| `/gifting`, `/gifting/:slug`, `/add-ons` | gifting tiles, hampers, add-on search + filters |
| `/about`, `/stores`, `/faq` | story, values, team, press; outlet search; searchable accordion |
| `/queries`, `/feedback`, `/blog` | contact routing, review forms (stored locally) |
| `/login`, `/checkout` | mobile + OTP sign-in and checkout |
| policy pages | privacy, terms, cancellation & refund |

Shared interactions: announcement marquee, sticky header that hides on scroll-down, hover mega-menus,
full-screen mobile menu, store picker → product options → cart drawer flow, toast notifications,
reveal-on-scroll animations, `prefers-reduced-motion` support.

### Backend-dependent features

The original talks to its own API for accounts, OTP SMS, addresses, store routing, payments and
reviews. This replica is front-end only, so those flows run locally:

- **Store selection**: delivery areas are the outlet localities; choosing one selects that outlet.
- **Login**: any valid Indian mobile number and any 6-digit code sign you in (stored in `localStorage`).
- **Cart, checkout, reviews, corporate enquiries**: kept in `localStorage`; checkout shows a confirmation.

To connect a real backend, replace the handlers in `ShopContext.jsx`, `LoginPage.jsx`,
`CheckoutPage.jsx`, `CorporatePage.jsx` and `components/ui/form.js` with API calls.

## Testing

Both suites expect the dev server (or `npm run preview` with `LOCAL=http://localhost:4173`).

```bash
npx playwright install chromium   # first time only
npm run test:e2e                  # functional checks: ordering flow, menus, filters, forms, images, links
npm run test:visual               # screenshot diff vs ksbakers.com at desktop / tablet / mobile
```

`test:visual` writes `tests/screenshots/<viewport>/<route>.{orig,local,diff}.png` and a `report.json`
with the mismatch percentage per page. Options: `--routes=/,/about` and `--vp=desktop,mobile`.

## Refreshing content

The JSON in `src/data` was extracted from the live site. To refresh it:

```bash
node scripts/scrape-products.mjs     # all /cakes/* detail payloads → scripts/raw/products.json
node scripts/scrape-site.mjs         # navigation, home, listings, about, stores, FAQ, gifting → scripts/raw/site.json
node scripts/build-data.mjs          # normalise into src/data/*.json (image URLs made local)
node scripts/download-assets.mjs     # download any new images into public/
```

API snapshots (`scripts/raw/api-*.json`) come from `https://ksbakers.com/api/products`,
`/api/products/featured`, `/api/addons/suggested`, `/api/hero-banners` and `/api/promo-banners`.

## Deployment

`dist/` is a static single-page app. Configure the host to serve `index.html` for unknown paths:

- **Netlify**: add `public/_redirects` containing `/*  /index.html  200` (already included).
- **Vercel**: `vercel.json` with a rewrite of `/(.*)` to `/index.html` (already included).
- **Nginx**: `try_files $uri /index.html;`

The `public/media` folder is about 136 MB of original photography; a CDN or image host is
recommended for production.
