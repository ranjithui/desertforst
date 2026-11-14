// WhatsApp ordering: every "Order on WhatsApp" button opens a chat with this number,
// pre-filled with the product details and the branch the customer typed.
import { useEffect, useState } from 'react';
import { outlets } from './data';

/**
 * The single number all orders go to: country code + number, digits only (no +, spaces or dashes).
 * Currently set to a testing number (+91 96293 73640); swap in the shop's orders number before launch.
 */
export const ORDER_WHATSAPP_NUMBER = '919629373640';

/** Branch names for the branch box's suggestions, e.g. "R.S. Puram". */
export const BRANCHES = outlets.map(o => o.name.replace(/^(Desert Forest|KS Bakers)\s*/i, '').trim());

/** Remembers the last branch typed, so it's pre-filled on the next product. */
export function useBranch() {
  const [branch, setBranch] = useState(() => localStorage.getItem('ksb.branch') || '');
  useEffect(() => { localStorage.setItem('ksb.branch', branch); }, [branch]);
  return [branch, setBranch];
}

/**
 * Builds the order message. `lines` are [label, value] pairs; empty values are skipped.
 * WhatsApp renders *text* as bold.
 */
export function orderMessage({ name, sku, lines = [], total, totalLabel = 'Price', branch, link }) {
  const rows = [
    'Hello Desert Forest! I would like to order:',
    '',
    `*${name.trim()}*${sku ? ` (SKU ${sku})` : ''}`,
    ...lines.filter(([, v]) => v !== undefined && v !== null && `${v}`.trim() !== '').map(([k, v]) => `${k}: ${v}`),
    total ? `${totalLabel}: ₹${total}` : null,
    '',
    `Branch: ${branch.trim()}`,
    link ? `Product link: ${link}` : null,
    '',
    'Please confirm availability and delivery/pickup time. Thank you!',
  ];
  return rows.filter(r => r !== null).join('\n');
}

export const whatsappUrl = text => `https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Opens WhatsApp (app on phones, WhatsApp Web on desktop) in a new tab. */
export function openWhatsApp(text) {
  window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
}
