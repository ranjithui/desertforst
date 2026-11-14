import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { layout } from '../../lib/data';
import { withYear } from '../../lib/format';
import SmartLink from '../ui/SmartLink';
import { WhatsAppIcon, XIcon } from '../ui/Icons';

const SOCIAL = {
  instagram: { label: 'Instagram', Icon: Instagram },
  facebook: { label: 'Facebook', Icon: Facebook },
  x: { label: 'X (Twitter)', Icon: XIcon },
  youtube: { label: 'YouTube', Icon: Youtube },
  whatsapp: { label: 'WhatsApp', Icon: WhatsAppIcon },
};
const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-accent';

export default function Footer() {
  const f = layout.footer;
  return (
    <footer className="relative overflow-hidden bg-accent" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="lg:w-[28%] lg:shrink-0">
            <div className="max-w-xs text-center">
              <Link className={`mx-auto block w-fit rounded ${ring}`} aria-label="Desert Forest — Home" to="/">
                <img alt="Desert Forest" loading="lazy" width="180" height="72" decoding="async" className="h-12 w-auto brightness-0 invert md:h-14" src="/desert-forest-logo.svg" />
              </Link>
              <p className="mt-5 font-sans text-sm leading-relaxed text-white/80">{f.about_text}</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {f.link_columns.map(col => (
              <div key={col.heading}>
                <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{col.heading}</h3>
                <ul className="mt-4 space-y-1 font-sans text-sm">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <SmartLink to={l.url} className={`inline-block rounded py-1.5 text-white/90 transition-colors duration-200 hover:text-white focus-visible:text-white ${ring}`}>
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-5 text-center font-sans text-[13px] text-white/75 sm:px-6 md:grid md:grid-cols-3 md:gap-6 md:text-left lg:px-8">
          <p className="md:justify-self-start">{withYear(f.copyright_text)}</p>
          <div className="flex flex-wrap justify-center gap-2.5 md:justify-self-center">
            {f.social_links.map(s => {
              const { label, Icon } = SOCIAL[s.icon] || SOCIAL.instagram;
              return (
                <SmartLink key={s.icon} to={s.url} aria-label={label} className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white/15 text-white transition-colors duration-200 hover:bg-cream hover:text-accent focus-visible:bg-cream focus-visible:text-accent ${ring}`}>
                  <Icon className="h-[17px] w-[17px]" />
                </SmartLink>
              );
            })}
          </div>
          <p className="flex flex-wrap items-center justify-center gap-x-2 md:justify-end md:justify-self-end">
            <a href={`tel:${f.phone.replace(/\s/g, '')}`} className={`rounded py-1 transition-colors duration-200 hover:text-white focus-visible:text-white ${ring}`}>{f.phone}</a>
            <span aria-hidden="true" className="text-white/40">·</span>
            <a href={`mailto:${f.email}`} className={`rounded py-1 transition-colors duration-200 hover:text-white focus-visible:text-white ${ring}`}>{f.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
