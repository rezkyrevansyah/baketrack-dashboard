/**
 * Format a number as IDR currency
 * @param amount Number to format
 * @returns string like "Rp 15.000"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a date string or object to a localized string
 * @param date Date string or object
 * @param options Intl.DateTimeFormatOptions
 * @returns string like "30 Jan 2024"
 */
export const formatDate = (date: string | Date | number, locale: string = 'id-ID', options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    // Handle simple language codes
    const finalLocale = locale === 'ID' ? 'id-ID' : locale === 'EN' ? 'en-US' : locale;
    return d.toLocaleDateString(finalLocale, options);
  } catch (e) {
    return '-';
  }
};
