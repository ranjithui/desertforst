import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, Youtube } from 'lucide-react';
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

/** Line-art leafy branch in the top-right corner. */
function LeafBranch() {
  const leaf = 'M0 0 C 12 -34, 66 -44, 100 -8 C 66 20, 16 26, 0 0 Z M0 0 C 34 -8, 66 -10, 100 -8';
  return (
    <svg className="df-footer__leaf" viewBox="0 0 220 300" fill="none" aria-hidden="true">
      <path d="M210 8 C 170 70, 140 120, 120 175 C 105 215, 98 250, 96 296" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* [x, y on the stem, angle, scale]: leaves alternate left/right and shrink down the branch */}
      {[
        [192, 34, -28, 0.95], [168, 82, 208, 1.05], [146, 132, -40, 0.95],
        [126, 186, 222, 0.9], [110, 238, -55, 0.75],
      ].map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={leaf} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          {[24, 44, 64, 82].map(v => (
            <path key={v} d={`M${v} -${(v / 100) * 8} q 6 -9, 4 -${16 - v / 8}`} stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function Footer() {
  const f = layout.footer;
  return (
    <footer className="df-footer" role="contentinfo">
      {/* Giant wordmark painted behind everything as a background layer */}
      <span className="df-footer__word" aria-hidden="true">Desert Forest</span>
      <LeafBranch />
      <div className="m-wrap df-footer__inner">
        <div className="df-footer__top">
          <div className="df-footer__brand">
            <Link className="df-footer__logo" aria-label="Desert Forest — Home" to="/">
              <img alt="Desert Forest" loading="lazy" width="180" height="72" decoding="async" src="/desert-forest-logo.svg" />
            </Link>
            <p className="df-footer__about">{f.about_text}</p>
            <ul className="df-footer__contact" role="list">
              <li><a href={`tel:${f.phone.replace(/\s/g, '')}`}><Phone className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" /> {f.phone}</a></li>
              <li><a href={`mailto:${f.email}`}><Mail className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" /> {f.email}</a></li>
            </ul>
            <div className="df-footer__social">
              {f.social_links.map(s => {
                const { label, Icon } = SOCIAL[s.icon] || SOCIAL.instagram;
                return (
                  <SmartLink key={s.icon} to={s.url} aria-label={label}>
                    <Icon className="h-[18px] w-[18px]" />
                  </SmartLink>
                );
              })}
            </div>
          </div>
          <nav className="df-footer__cols" aria-label="Footer">
            {f.link_columns.map(col => (
              <div key={col.heading}>
                <h3>{col.heading}</h3>
                <ul role="list">
                  {col.links.map(l => (
                    <li key={l.label}><SmartLink to={l.url}>{l.label}</SmartLink></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="df-footer__bottom">
          <p>{withYear(f.copyright_text)}</p>
          <p>Baked fresh, every single day.</p>
        </div>
      </div>

      <div className="df-footer__mark" aria-hidden="true">
        {/* Wavy copper edge: the dark panel ends on a curve, with a glowing ribbon along it. */}
        <svg className="df-footer__wave" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="df-ribbon" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#8a4a1c" />
              <stop offset=".35" stopColor="#e9a86c" />
              <stop offset=".65" stopColor="#f6cf9f" />
              <stop offset="1" stopColor="#b8672b" />
            </linearGradient>
          </defs>
          <path d="M0 70 C 240 20, 470 120, 760 92 C 1040 66, 1220 18, 1440 46 L1440 160 L0 160 Z" fill="url(#df-ribbon)" />
          <path d="M0 96 C 260 52, 480 150, 770 122 C 1050 96, 1230 52, 1440 78 L1440 160 L0 160 Z" fill="var(--df-page, #faf6f1)" />
        </svg>
      </div>
    </footer>
  );
}
