/**
 * Currencies for the commissions page. Prices are set in AUD, which stays the quote and invoice currency; the others
 * are estimates converted in the browser. Adapted from brainage04.github.io (src/lib/currency.ts), with the time-zone
 * default from the Skyport Minigames site.
 */
export const baseCurrency = 'AUD';

/** Picker order: the base currency first. `prefix` is drawn before the amount. */
export const currencies = {
  AUD: { label: 'AUD', prefix: '$' },
  USD: { label: 'USD', prefix: 'US$' },
  EUR: { label: 'EUR', prefix: '€' },
  GBP: { label: 'GBP', prefix: '£' },
  CAD: { label: 'CAD', prefix: 'C$' },
  NZD: { label: 'NZD', prefix: 'NZ$' },
} as const;

export type CurrencyCode = keyof typeof currencies;

export const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  typeof value === 'string' && Object.hasOwn(currencies, value);

const canadianTimeZones: Record<string, true> = {
  'America/Toronto': true,
  'America/Vancouver': true,
  'America/Edmonton': true,
  'America/Winnipeg': true,
  'America/Halifax': true,
  'America/St_Johns': true,
};

/**
 * The visitor's likely currency from their time zone (no network request), or null to keep the base currency. Other
 * `America/` zones are taken as the US: the picker offers no other currency of the Americas.
 */
export function currencyForTimeZone(timeZone: string | null | undefined): CurrencyCode | null {
  if (!timeZone) return null;
  if (timeZone.startsWith('Australia/')) return 'AUD';
  if (timeZone === 'Pacific/Auckland' || timeZone === 'Pacific/Chatham') return 'NZD';
  if (timeZone === 'Europe/London') return 'GBP';
  if (timeZone.startsWith('Europe/')) return 'EUR';
  if (canadianTimeZones[timeZone]) return 'CAD';
  if (timeZone.startsWith('America/') || timeZone.startsWith('US/')) return 'USD';
  return null;
}

/** `$40` in AUD; converted amounts are rounded to whole units and marked as estimates: `≈US$26`. */
export function formatPrice(aud: number, currency: CurrencyCode = baseCurrency, rate = 1): string {
  const amount = currency === baseCurrency ? aud : Math.round(aud * rate);
  return `${currency === baseCurrency ? '' : '≈'}${currencies[currency].prefix}${amount.toLocaleString('en')}`;
}

/** Live mid-market rates from the European Central Bank via Frankfurter (free, no key, CORS-enabled). */
export const ratesUrl = `https://api.frankfurter.dev/v1/latest?base=${baseCurrency}&symbols=${Object.keys(currencies)
  .filter((code) => code !== baseCurrency)
  .join(',')}`;

export type ExchangeRates = { date: string; rates: Partial<Record<CurrencyCode, number>> };

export function parseRates(body: unknown): ExchangeRates {
  if (typeof body !== 'object' || body === null) throw new Error('Exchange rate response is not an object');
  const { date, rates } = body as { date?: unknown; rates?: unknown };
  if (typeof date !== 'string' || typeof rates !== 'object' || rates === null) {
    throw new Error('Exchange rate response is missing its date or rates');
  }

  const parsed: ExchangeRates['rates'] = {};
  for (const [code, rate] of Object.entries(rates)) {
    if (isCurrencyCode(code) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0) parsed[code] = rate;
  }
  return { date, rates: parsed };
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** An ECB rate date (`2026-10-14`) as `14 October 2026`. */
export function formatRateDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(isoDate);
  const month = match ? months[Number(match[2]) - 1] : undefined;
  if (!match || !month) return isoDate;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export const audNote = 'Quotes and invoices are in AUD.';

/** The note under the services once prices are converted. */
export function conversionNote(currency: CurrencyCode, isoDate: string): string {
  return `${currency} prices are estimates, converted from AUD at the European Central Bank rate for ${formatRateDate(isoDate)}. ${audNote}`;
}

export type CurrencyOutcome =
  | { kind: 'base' }
  | { kind: 'converted'; currency: CurrencyCode; rate: number; date: string }
  | { kind: 'failed'; error: unknown }
  /** The visitor picked another currency while this one was loading; change nothing. */
  | { kind: 'stale' };

/**
 * Works out what to show for `currency`. `isCurrent` is checked after the rates load and before every outcome that
 * changes the page, so a slow or failed request for an earlier choice can never overwrite a later one.
 */
export async function resolveCurrency(
  currency: CurrencyCode,
  loadRates: () => Promise<ExchangeRates>,
  isCurrent: (currency: CurrencyCode) => boolean,
): Promise<CurrencyOutcome> {
  if (currency === baseCurrency) return { kind: 'base' };

  let loaded: ExchangeRates;
  try {
    loaded = await loadRates();
  } catch (error) {
    return isCurrent(currency) ? { kind: 'failed', error } : { kind: 'stale' };
  }
  if (!isCurrent(currency)) return { kind: 'stale' };

  const rate = loaded.rates[currency];
  if (!rate) return { kind: 'failed', error: new Error(`No ${currency} rate in the response`) };
  return { kind: 'converted', currency, rate, date: loaded.date };
}
