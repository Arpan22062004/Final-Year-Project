const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * Format a numeric value as USD currency.
 */
export function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return '$0.00';
  }

  return currencyFormatter.format(amount);
}

/**
 * Format a date as "Jan 15, 2026".
 */
export function formatDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return dateFormatter.format(date);
}

/**
 * Format a date and time as "Jan 15, 2026, 3:30 PM".
 */
export function formatDateTime(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return dateTimeFormatter.format(date);
}

/**
 * Generate a lightweight unique ID for local application data.
 */
export function uid() {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/**
 * Combine truthy class names into a single string.
 */
export function classNames(...classes) {
  return classes
    .flat(Infinity)
    .filter(Boolean)
    .join(' ');
}