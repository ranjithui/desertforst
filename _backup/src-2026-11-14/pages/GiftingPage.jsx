import { useEffect } from 'react';
import { pages } from '../lib/data';
import BannerCarousel from '../components/ui/BannerCarousel';
import { CategoryTiles } from './Home';

// The CMS has no artwork yet for three gifting tiles; reuse hamper photography so no tile is blank.
const FALLBACK_ART = pages.hampers.hampers.map(h => h.images[0]).slice(1);

export default function GiftingPage() {
  useEffect(() => { document.title = 'Gifting | Desert Forest'; }, []);
  const tiles = pages.gifting.tiles.map((t, i) => ({ ...t, image_url: t.image_url || FALLBACK_ART[i % FALLBACK_ART.length] }));
  return (
    <div className="relative overflow-x-hidden bg-cream pb-10 md:pb-16">
      <h1 className="sr-only">Gifting</h1>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
        <BannerCarousel banners={pages.gifting.banners} label="Gifting" />
      </div>
      <CategoryTiles
        tiles={tiles}
        eyebrow={null}
        subtitle="Thoughtfully put together, ready to give."
        cols="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 md:gap-3 lg:gap-5"
      />
    </div>
  );
}
