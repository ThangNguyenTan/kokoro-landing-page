import type { MetadataRoute } from 'next';
import { siteUrl } from '@/sanity/env';

/**
 * Canonical XML Sitemap (`/sitemap.xml`) for Phòng Khám Y Học Cổ Truyền Kokoro.
 * Strictly includes indexable canonical routes only (excludes `#fragment` anchors, `/admin`, `/studio`, and `/api`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
