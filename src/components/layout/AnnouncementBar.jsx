import { layout } from '../../lib/data';

// Infinite marquee: the message set is repeated 6x and the track scrolls -50% (see .marquee-track).
export default function AnnouncementBar() {
  const items = Array.from({ length: 6 }, () => layout.announcements).flat();
  return (
    <div className="m-announce" role="region" aria-label="Announcements">
      <div className="marquee-track flex w-max whitespace-nowrap" style={{ animationDuration: '90s' }}>
        {items.map((text, i) => (
          <span key={i} aria-hidden={i >= layout.announcements.length}>{text}</span>
        ))}
      </div>
    </div>
  );
}
