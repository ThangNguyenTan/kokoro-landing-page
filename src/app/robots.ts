import type { MetadataRoute } from 'next';
import { siteUrl } from '@/sanity/env';

/**
 * Crawler Directives (`/robots.txt`) for Phòng Khám Y Học Cổ Truyền Kokoro.
 * Allows full indexing of public patient-facing content while shielding Sanity Studio (`/admin`, `/studio`) and API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/studio', '/studio/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
