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

## Versions

| Branch | Version | Home hero |
| --- | --- | --- |
| `main` | 1.x | image slider |
| `version2` | 2.0.0 | full-bleed looping video |

Switch with `git switch main` or `git switch version2`, then run `npm run dev` as usual.

### Version 2 video hero

- Video: `public/media/ksbakers/video/cake shop video2.mp4` (1280×720, H.264, 8 s, 5.7 MB).
  It plays muted, looped and inline, so browsers allow autoplay, including on iPhone.
- Poster: a chocolate-cake still shows while the video loads, and also when the visitor has
  *reduce motion* or data saving turned on (the video then doesn't autoplay).
- A pause/play button sits bottom-right (top-right on phones). The video also pauses
  while the hero is scrolled out of view.
- Layout: copy on the left over a dark gradient on desktop and tablet. On phones the copy
  sits at the bottom so the cake stays visible above it.
- Code: `Hero` in `src/pages/Home.jsx`, styles in `src/styles/hero-video.css`.
- To swap the film, replace the file and update `HERO_VIDEO` in `Home.jsx` (and `HERO_POSTER`
  for a matching still). Keep it short, muted-friendly and under ~6 MB, saved with the
  `moov` atom at the start ("fast start") so playback begins before it fully downloads.

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
  context/ShopContext.jsx   options dialog + toast state (orders go to WhatsApp, see lib/whatsapp.js)
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
| `/login` | mobile + OTP sign-in |
| policy pages | privacy, terms, cancellation & refund |

Shared interactions: sticky header, hover mega-menus, full-screen mobile menu, product options
dialog, WhatsApp ordering, toast notifications, reveal-on-scroll animations,
`prefers-reduced-motion` support.

### Ordering on WhatsApp

There is no cart or checkout. Every "Order on WhatsApp" / "Order Now" button opens a chat with
one fixed number, pre-filled with the product name, SKU, size or weight, flavour, cake message,
add-ons, price and the **branch** the customer types (the branch box suggests the outlet names and
remembers the last one used).

- **Change the number**: `ORDER_WHATSAPP_NUMBER` in `src/lib/whatsapp.js` (country code + number,
  digits only, e.g. `919876543210`). It is currently a testing number (+91 96293 73640).
- Message wording: `orderMessage()` in the same file.
- Where it's used: `src/pages/CakePage.jsx` (cake pages) and
  `src/components/product/ProductOptionsDialog.jsx` (Bestsellers, Our Menu, Hampers, Add-ons).

### Backend-dependent features

The original talks to its own API for accounts, OTP SMS, payments and reviews. This replica is
front-end only, so those flows run locally:

- **Login**: any valid Indian mobile number and any 6-digit code sign you in (stored in `localStorage`).
- **Reviews, corporate enquiries**: kept in `localStorage`.

To connect a real backend, replace the handlers in `LoginPage.jsx`, `CorporatePage.jsx` and
`components/ui/form.js` with API calls.

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
