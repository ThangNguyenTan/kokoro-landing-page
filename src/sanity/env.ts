/**
 * Sanity CMS Environment Configuration
 * Gracefully detects whether a real Sanity Project ID is configured so the site
 * and `/admin` route never crash when `.env.local` has not been populated yet.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const rawProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();

const PLACEHOLDER_IDS = new Set([
  '',
  'your-project-id',
  'your_project_id',
  'replace-me',
  'placeholder',
  'xxx',
]);

export const isSanityConfigured: boolean =
  !PLACEHOLDER_IDS.has(rawProjectId.toLowerCase()) &&
  /^[a-z0-9-]+$/.test(rawProjectId);

/**
 * Safe projectId passed to `defineConfig` (falls back to placeholder string when unconfigured;
 * `/admin` only mounts `<NextStudio />` when `isSanityConfigured === true`).
 */
export const projectId = isSanityConfigured ? rawProjectId : 'unconfigured-project';

export const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://kokorowellness.vn').replace(/\/+$/, '');
