import { layout } from '../../lib/data';

// Infinite marquee: the message set is repeated 6x and the track scrolls -50% (see .marquee-track).
export default function AnnouncementBar() {
  const items = Array.from({ length: 6 }, () => layout.announcements).flat();
  return (
    <div className="sticky top-0 z-[51]">
      <div className="relative z-40 bg-accent text-white overflow-hidden py-2" role="region" aria-label="Announcements">
        <div
          className="marquee-track flex w-max whitespace-nowrap font-sans text-[0.8125rem] tracking-[0.02em]"
          style={{ animationDuration: '81s' }}
        >
          {items.map((text, i) => (
            <span key={i} className="px-10" aria-hidden={i >= layout.announcements.length}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
