export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'weight-asc', label: 'Weight: smallest first' },
  { value: 'weight-desc', label: 'Weight: largest first' },
];

export function sortCakes(list, sort) {
  const l = [...list];
  switch (sort) {
    case 'price-asc': return l.sort((a, b) => a.from_price - b.from_price);
    case 'price-desc': return l.sort((a, b) => b.from_price - a.from_price);
    case 'weight-asc': return l.sort((a, b) => a.weights[0] - b.weights[0]);
    case 'weight-desc': return l.sort((a, b) => b.weights[0] - a.weights[0]);
    default: return list;
  }
}
