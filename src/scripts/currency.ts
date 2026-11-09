import {
  audNote,
  baseCurrency,
  conversionNote,
  currencyForTimeZone,
  formatPrice,
  isCurrencyCode,
  parseRates,
  ratesUrl,
  resolveCurrency,
  type CurrencyCode,
  type ExchangeRates,
} from '../data/currency';

const storageKey = 'commission-currency';
const picker = document.querySelector<HTMLSelectElement>('select#price-currency');
const note = document.querySelector<HTMLElement>('#price-note');
const prices = document.querySelectorAll<HTMLElement>('[data-aud]');
let ratesRequest: Promise<ExchangeRates> | undefined;

function render(currency: CurrencyCode, rate = 1) {
  for (const price of prices) price.textContent = formatPrice(Number(price.dataset.aud), currency, rate);
}

async function showCurrency(currency: CurrencyCode) {
  if (!picker || !note) return;

  const outcome = await resolveCurrency(
    currency,
    () =>
      (ratesRequest ??= fetch(ratesUrl).then(async (response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return parseRates(await response.json());
      })),
    (requested) => picker.value === requested,
  );

  if (outcome.kind === 'stale') return;
  if (outcome.kind === 'converted') {
    render(outcome.currency, outcome.rate);
    note.textContent = conversionNote(outcome.currency, outcome.date);
    return;
  }
  if (outcome.kind === 'failed') {
    console.warn('Could not load exchange rates:', outcome.error);
    ratesRequest = undefined;
    picker.value = baseCurrency;
  }
  render(baseCurrency);
  note.textContent =
    outcome.kind === 'failed' ? `Exchange rates could not be loaded, so prices are shown in AUD. ${audNote}` : audNote;
}

if (picker) {
  picker.disabled = false;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    // Storage can be unavailable (privacy modes); the page then starts from the time zone.
  }
  // A saved choice wins; otherwise the time zone suggests one (no network request). Neither is saved until the
  // visitor picks a currency themselves.
  const initial = isCurrencyCode(stored)
    ? stored
    : currencyForTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  if (initial && initial !== baseCurrency) {
    // The currency is shown in the picker at once, but its rates are fetched only once the page has settled (after
    // load, when the browser is idle); prices stay in AUD until they arrive.
    picker.value = initial;
    const convert = () => {
      if (picker.value === initial) void showCurrency(initial);
    };
    const whenIdle = () =>
      'requestIdleCallback' in window ? requestIdleCallback(convert, { timeout: 2000 }) : setTimeout(convert, 200);
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
  }

  picker.addEventListener('change', () => {
    const currency = picker.value;
    if (!isCurrencyCode(currency)) return;
    try {
      localStorage.setItem(storageKey, currency);
    } catch {
      // Not remembering the choice is fine.
    }
    void showCurrency(currency);
  });
}
