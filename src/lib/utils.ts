export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}

export function formatCents(cents: number) {
  return `${Math.round(cents)}¢`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
