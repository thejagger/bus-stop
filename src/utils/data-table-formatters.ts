import {format, parse, isValid, type Locale} from "date-fns";
import {enUS, de} from "date-fns/locale";

/**
 * Map i18next locale codes to date-fns locale objects
 */
export function getDateLocale(i18nLocale: string): Locale {
  const localeMap: Record<string, Locale> = {
    en: enUS,
    de: de,
  };
  return localeMap[i18nLocale] || enUS;
}

/**
 * Format date values to readable format with locale support
 * Handles null/undefined/empty values and validates date format
 * Expected input format: yyyy-MM-dd (e.g., "2025-07-09")
 */
export function formatDateValue(value: any, i18nLocale: string): string {
  // Check for null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Convert to string if not already
  const dateString = String(value).trim();
  if (dateString === "") {
    return "";
  }

  // Try to parse the date (expected format: yyyy-MM-dd)
  let date: Date;
  try {
    // First try parsing as yyyy-MM-dd format
    date = parse(dateString, "yyyy-MM-dd", new Date());

    // If parsing failed, try parsing as ISO string or Date constructor
    if (!isValid(date)) {
      date = new Date(dateString);
    }
  } catch {
    // If parsing fails, return empty string
    return "";
  }

  // Validate the parsed date
  if (!isValid(date)) {
    return "";
  }

  // Format the date with locale
  try {
    return format(date, "PPP", {locale: getDateLocale(i18nLocale)});
  } catch {
    // If formatting fails, return empty string
    return "";
  }
}

/**
 * Format number values with 2 decimal places using Intl.NumberFormat
 * Handles null/undefined/empty values and validates number format
 */
export function formatNumberValue(value: any, i18nLocale: string): string {
  // Check for null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Convert to number
  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return "";
  }

  // Format number with 2 decimal places using Intl.NumberFormat
  try {
    return new Intl.NumberFormat(i18nLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch {
    // If formatting fails, return empty string
    return "";
  }
}

/**
 * Format currency values with 2 decimal places using Intl.NumberFormat
 * Default currency: EUR (€)
 * Handles null/undefined/empty values and validates number format
 */
export function formatCurrencyValue(
  value: any,
  i18nLocale: string,
  currency: string = "EUR"
): string {
  // Check for null, undefined, or empty string
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Convert to number
  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return "";
  }

  // Format currency with 2 decimal places using Intl.NumberFormat
  try {
    return new Intl.NumberFormat(i18nLocale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch {
    // If formatting fails, return empty string
    return "";
  }
}

