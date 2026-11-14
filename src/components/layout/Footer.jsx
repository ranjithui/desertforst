import { Link } from 'react-router-dom';
import { ArrowUpRight, Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react';
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

export default function Footer() {
  const f = layout.footer;
  return (
    <footer className="m-footer" role="contentinfo">
      <div className="m-wrap">
        <div className="m-footer__top">
          <div>
            <Link className="block w-fit rounded" aria-label="Desert Forest — Home" to="/">
              <img alt="Desert Forest" loading="lazy" width="180" height="72" decoding="async" className="h-14 w-auto brightness-0 invert" src="/desert-forest-logo.svg" />
            </Link>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed">{f.about_text}</p>
            <div className="m-footer__contact mt-6 flex flex-col">
              <a href={`tel:${f.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2"><Phone className="h-4 w-4 opacity-60" /> {f.phone}</a>
              <a href={`mailto:${f.email}`} className="inline-flex items-center gap-2"><Mail className="h-4 w-4 opacity-60" /> {f.email}</a>
            </div>
            <div className="m-footer__social">
              {f.social_links.map(s => {
                const { label, Icon } = SOCIAL[s.icon] || SOCIAL.instagram;
                return (
                  <SmartLink key={s.icon} to={s.url} aria-label={label}>
                    <Icon className="h-[17px] w-[17px]" />
                  </SmartLink>
                );
              })}
            </div>
          </div>
          <div className="m-footer__cols">
            {f.link_columns.map(col => (
              <div key={col.heading}>
                <h3>{col.heading}</h3>
                <ul className="mt-5 space-y-1">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <SmartLink to={l.url} className="group inline-flex items-center gap-1">
                        {l.label}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="m-footer__bottom">
          <p>{withYear(f.copyright_text)}</p>
          <p>Baked fresh, every single day.</p>
        </div>
      </div>
      <span className="m-footer__word" aria-hidden="true">Desert Forest</span>
    </footer>
  );
}
