const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const currencyPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const dateShort = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export const formatCurrency = (value: number) => currency.format(value);
export const formatCurrencyPrecise = (value: number) => currencyPrecise.format(value);
export const formatCompact = (value: number) => compact.format(value);
export const formatDate = (value: string) => dateShort.format(new Date(value));
export const formatDateTime = (value: string) => dateTime.format(new Date(value));

export function formatRelative(value: string): string {
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.round(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.round(minutes / 60);

    if (hours < 24) return `${hours}h ago`;

    const days = Math.round(hours / 24);

    if (days < 30) return `${days}d ago`;

    return formatDate(value);
}

export const initials = (value: string) =>
    value
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
