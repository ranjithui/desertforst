export const rupees = n => `₹${n}`;
export const rupees2 = n => `₹${Number(n).toFixed(2)}`;
export const kg = w => `${w} kg`;

export const discountPct = (price, compare) =>
  compare && compare > price ? Math.round((1 - price / compare) * 100) : 0;

export const cx = (...c) => c.filter(Boolean).join(' ');

/** "Copyright {year}. …" → current year, matching the original footer. */
export const withYear = s => s.replace('{year}', new Date().getFullYear());

export const isExternal = url => /^(https?:)?\/\//.test(url) || /^(wa\.|mailto:|tel:)/.test(url);
export const normaliseUrl = url => (/^wa\./.test(url) ? `https://${url}` : url);
