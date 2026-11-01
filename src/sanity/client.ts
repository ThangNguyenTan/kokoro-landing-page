import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from './env';

/**
 * Sanity CDN Client for read queries on the Kokoro Wellness Clinic landing page.
 * Safely evaluates to `null` when `NEXT_PUBLIC_SANITY_PROJECT_ID` is not configured,
 * ensuring zero runtime errors in local/preview/production environments without `.env.local`.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;
