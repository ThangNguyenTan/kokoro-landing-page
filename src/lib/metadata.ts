import type { Metadata } from 'next';
import type { ClinicSettings } from '@/types/clinic';
import { siteUrl } from '@/sanity/env';

/**
 * Core Vietnamese YHCT & local Phường An Lạc / Bình Tân / Khu Tên Lửa search terms
 * merged with CMS-managed keywords so essential local intent is always preserved.
 */
const CORE_VIETNAMESE_YHCT_KEYWORDS = [
  'phòng khám y học cổ truyền',
  'phòng khám yhct bình tân',
  'phòng khám đông y phường an lạc',
  'châm cứu bấm huyệt an lạc khu tên lửa',
  'điều trị đông y tp hcm',
  'phòng khám kokoro',
  'kokoro wellness clinic',
  'khám cơ xương khớp đông y bình tân',
  'điều trị mất ngủ bằng đông y tphcm',
  'phục hồi chức năng người cao tuổi bình tân',
];

/**
 * Dynamically builds Next.js `Metadata` for Phòng Khám Y Học Cổ Truyền Kokoro
 * with canonical URLs, `vi_VN` OpenGraph, Twitter Card, and Vietnam local geo tags.
 */
export function buildClinicMetadata(settings: ClinicSettings): Metadata {
  const title =
    settings.seoTitle || `${settings.clinicName} | ${settings.motto}`;
  const description = settings.seoDescription;

  const mergedKeywords = Array.from(
    new Set([
      ...(Array.isArray(settings.seoKeywords) ? settings.seoKeywords : []),
      ...CORE_VIETNAMESE_YHCT_KEYWORDS,
    ]),
  ).filter(Boolean);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: mergedKeywords,
    applicationName: settings.clinicName,
    authors: [{ name: settings.clinicName, url: siteUrl }],
    creator: settings.clinicName,
    publisher: settings.legalName || settings.clinicName,
    category: 'Health & Medical',
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: siteUrl,
      siteName: settings.clinicName,
      title,
      description,
      images: [
        {
          url: '/images/og-kokoro-clinic.png',
          width: 1200,
          height: 630,
          alt: settings.clinicName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-kokoro-clinic.png'],
    },
    other: {
      'geo.region': 'VN-SG',
      'geo.placename': `${settings.ward}, ${settings.city}`,
      'geo.position': `${settings.latitude};${settings.longitude}`,
      ICBM: `${settings.latitude}, ${settings.longitude}`,
    },
  };
}
