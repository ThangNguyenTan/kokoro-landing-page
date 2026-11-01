import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, projectId } from './env';

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

/**
 * Generates optimized Sanity CDN image URLs with automatic WebP/AVIF negotiation
 * and hotspot/crop preservation.
 */
export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source).auto('format').fit('max');
}
