/**
 * Global site configuration with environment variable support.
 * Configured via NEXT_PUBLIC_SITE_URL in .env / .env.local
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_MAIN_DOMAIN ||
  'https://modernjournal.info/news'
).replace(/\/+$/, '');

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Algeria Times';

export const getSiteHostname = (): string => {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return 'algeriatimes.info';
  }
};

export const SITE_DOMAIN = getSiteHostname();
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${SITE_DOMAIN}`;
