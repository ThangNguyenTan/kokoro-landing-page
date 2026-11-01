import { groq } from 'next-sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type {
  ClinicDoctor,
  ClinicFaq,
  ClinicPageData,
  ClinicService,
  ClinicSettings,
  ClinicTestimonial,
  OpeningHourSpec,
} from '@/types/clinic';
import { sanityClient } from './client';
import { isSanityConfigured } from './env';
import {
  FALLBACK_CLINIC_DATA,
  FALLBACK_CLINIC_SETTINGS,
  FALLBACK_DOCTORS,
  FALLBACK_FAQS,
  FALLBACK_SERVICES,
  FALLBACK_TESTIMONIALS,
} from './fallbackData';
import { urlForImage } from './image';

export const CLINIC_CACHE_TAG = 'clinic-content';
export const CLINIC_REVALIDATE_SECONDS = 3600;

export const CLINIC_SETTINGS_QUERY = groq`
  *[_type == "clinicSettings"][0] {
    clinicName,
    legalName,
    subtitle,
    motto,
    phoneDisplay,
    phoneRaw,
    zaloUrl,
    email,
    facebookUrl,
    streetAddress,
    ward,
    city,
    postalCode,
    countryCode,
    landmarkNote,
    latitude,
    longitude,
    googleMapsDirectionsUrl,
    googleMapsEmbedUrl,
    operatingLicenseNumber,
    operatingLicenseIssuer,
    operatingHours[] {
      daysLabel,
      schemaDays,
      opens,
      closes
    },
    seoTitle,
    seoDescription,
    seoKeywords
  }
`;

export const CLINIC_SERVICES_QUERY = groq`
  *[_type == "services"] | order(coalesce(orderRank, 999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    categoryBadge,
    shortDescription,
    benefits,
    durationNote,
    targetAudience,
    iconName,
    image,
    "rawImageUrl": image.asset->url,
    seoTitle,
    seoDescription
  }
`;

export const CLINIC_DOCTORS_QUERY = groq`
  *[_type == "doctors"] | order(coalesce(orderRank, 999) asc, _createdAt asc) {
    _id,
    name,
    title,
    degree,
    specialty,
    licenseNumber,
    yearsOfExperience,
    bio,
    highlights,
    photo,
    "rawPhotoUrl": photo.asset->url
  }
`;

export const CLINIC_TESTIMONIALS_QUERY = groq`
  *[_type == "testimonials"] | order(coalesce(orderRank, 999) asc, _createdAt asc) {
    _id,
    patientName,
    patientAge,
    location,
    conditionTreated,
    quote,
    rating,
    treatmentDuration
  }
`;

export const CLINIC_FAQS_QUERY = groq`
  *[_type == "faqs"] | order(coalesce(orderRank, 999) asc, _createdAt asc) {
    _id,
    question,
    answer,
    category
  }
`;

/**
 * Combined single-request GROQ projection for optimal server rendering TTFB.
 */
export const CLINIC_PAGE_DATA_QUERY = groq`{
  "settings": ${CLINIC_SETTINGS_QUERY},
  "services": ${CLINIC_SERVICES_QUERY},
  "doctors": ${CLINIC_DOCTORS_QUERY},
  "testimonials": ${CLINIC_TESTIMONIALS_QUERY},
  "faqs": ${CLINIC_FAQS_QUERY}
}`;

interface RawSanityImageField {
  asset?: {
    _ref?: string;
    _id?: string;
  };
  alt?: string;
}

interface RawSanityService {
  _id: string;
  title?: string;
  slug?: string;
  categoryBadge?: string;
  shortDescription?: string;
  benefits?: string[];
  durationNote?: string;
  targetAudience?: string;
  iconName?: string;
  image?: RawSanityImageField;
  rawImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface RawSanityDoctor {
  _id: string;
  name?: string;
  title?: string;
  degree?: string;
  specialty?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
  highlights?: string[];
  photo?: RawSanityImageField;
  rawPhotoUrl?: string;
}

interface RawSanityTestimonial {
  _id: string;
  patientName?: string;
  patientAge?: number;
  location?: string;
  conditionTreated?: string;
  quote?: string;
  rating?: number;
  treatmentDuration?: string;
}

interface RawSanityFaq {
  _id: string;
  question?: string;
  answer?: string;
  category?: string;
}

interface RawSanityPagePayload {
  settings?: Partial<ClinicSettings> | null;
  services?: RawSanityService[] | null;
  doctors?: RawSanityDoctor[] | null;
  testimonials?: RawSanityTestimonial[] | null;
  faqs?: RawSanityFaq[] | null;
}

function resolveSanityImageUrl(
  imageField: RawSanityImageField | undefined,
  rawAssetUrl: string | undefined,
  width: number,
): string | undefined {
  if (imageField?.asset) {
    try {
      return urlForImage(imageField as SanityImageSource)
        .width(width)
        .quality(85)
        .url();
    } catch {
      return rawAssetUrl;
    }
  }
  return rawAssetUrl || undefined;
}

function normalizeOperatingHours(
  rawHours: OpeningHourSpec[] | undefined,
): OpeningHourSpec[] {
  if (!Array.isArray(rawHours) || rawHours.length === 0) {
    return FALLBACK_CLINIC_SETTINGS.operatingHours;
  }

  const validHours = rawHours
    .filter((item) => item && item.daysLabel && item.opens && item.closes)
    .map((item) => ({
      daysLabel: item.daysLabel,
      schemaDays:
        Array.isArray(item.schemaDays) && item.schemaDays.length > 0
          ? item.schemaDays
          : FALLBACK_CLINIC_SETTINGS.operatingHours[0].schemaDays,
      opens: item.opens,
      closes: item.closes,
    }));

  return validHours.length > 0
    ? validHours
    : FALLBACK_CLINIC_SETTINGS.operatingHours;
}

function mergeClinicSettings(
  raw: Partial<ClinicSettings> | null | undefined,
): ClinicSettings {
  if (!raw) {
    return FALLBACK_CLINIC_SETTINGS;
  }

  return {
    clinicName: raw.clinicName || FALLBACK_CLINIC_SETTINGS.clinicName,
    legalName: raw.legalName || FALLBACK_CLINIC_SETTINGS.legalName,
    subtitle: raw.subtitle || FALLBACK_CLINIC_SETTINGS.subtitle,
    motto: raw.motto || FALLBACK_CLINIC_SETTINGS.motto,
    phoneDisplay: raw.phoneDisplay || FALLBACK_CLINIC_SETTINGS.phoneDisplay,
    phoneRaw: raw.phoneRaw || FALLBACK_CLINIC_SETTINGS.phoneRaw,
    zaloUrl: raw.zaloUrl || FALLBACK_CLINIC_SETTINGS.zaloUrl,
    email: raw.email || FALLBACK_CLINIC_SETTINGS.email,
    facebookUrl: raw.facebookUrl || FALLBACK_CLINIC_SETTINGS.facebookUrl,
    streetAddress: raw.streetAddress || FALLBACK_CLINIC_SETTINGS.streetAddress,
    ward: raw.ward || FALLBACK_CLINIC_SETTINGS.ward,
    city: raw.city || FALLBACK_CLINIC_SETTINGS.city,
    postalCode: raw.postalCode || FALLBACK_CLINIC_SETTINGS.postalCode,
    countryCode: raw.countryCode || FALLBACK_CLINIC_SETTINGS.countryCode,
    landmarkNote: raw.landmarkNote || FALLBACK_CLINIC_SETTINGS.landmarkNote,
    latitude:
      typeof raw.latitude === 'number'
        ? raw.latitude
        : FALLBACK_CLINIC_SETTINGS.latitude,
    longitude:
      typeof raw.longitude === 'number'
        ? raw.longitude
        : FALLBACK_CLINIC_SETTINGS.longitude,
    googleMapsDirectionsUrl:
      raw.googleMapsDirectionsUrl ||
      FALLBACK_CLINIC_SETTINGS.googleMapsDirectionsUrl,
    googleMapsEmbedUrl:
      raw.googleMapsEmbedUrl || FALLBACK_CLINIC_SETTINGS.googleMapsEmbedUrl,
    operatingLicenseNumber:
      raw.operatingLicenseNumber ||
      FALLBACK_CLINIC_SETTINGS.operatingLicenseNumber,
    operatingLicenseIssuer:
      raw.operatingLicenseIssuer ||
      FALLBACK_CLINIC_SETTINGS.operatingLicenseIssuer,
    operatingHours: normalizeOperatingHours(raw.operatingHours),
    seoTitle: raw.seoTitle || FALLBACK_CLINIC_SETTINGS.seoTitle,
    seoDescription:
      raw.seoDescription || FALLBACK_CLINIC_SETTINGS.seoDescription,
    seoKeywords:
      Array.isArray(raw.seoKeywords) && raw.seoKeywords.length > 0
        ? raw.seoKeywords
        : FALLBACK_CLINIC_SETTINGS.seoKeywords,
  };
}

function normalizeServices(
  rawList: RawSanityService[] | null | undefined,
): ClinicService[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_SERVICES;
  }

  const mapped = rawList
    .filter((item) => Boolean(item?._id && item?.title))
    .map((item): ClinicService => {
      const imageUrl = resolveSanityImageUrl(item.image, item.rawImageUrl, 960);
      return {
        _id: item._id,
        title: item.title || '',
        slug: item.slug || item._id,
        categoryBadge: item.categoryBadge || 'Y Học Cổ Truyền',
        shortDescription: item.shortDescription || '',
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
        durationNote: item.durationNote || '45 – 60 phút / buổi',
        targetAudience: item.targetAudience || 'Mọi đối tượng người bệnh phù hợp',
        iconName: item.iconName || 'acupuncture',
        ...(imageUrl ? { imageUrl } : {}),
        ...(item.seoTitle ? { seoTitle: item.seoTitle } : {}),
        ...(item.seoDescription ? { seoDescription: item.seoDescription } : {}),
      };
    });

  return mapped.length > 0 ? mapped : FALLBACK_SERVICES;
}

function normalizeDoctors(
  rawList: RawSanityDoctor[] | null | undefined,
): ClinicDoctor[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_DOCTORS;
  }

  const mapped = rawList
    .filter((item) => Boolean(item?._id && item?.name))
    .map((item): ClinicDoctor => {
      const photoUrl = resolveSanityImageUrl(item.photo, item.rawPhotoUrl, 720);
      return {
        _id: item._id,
        name: item.name || '',
        title: item.title || 'Bác Sĩ Y Học Cổ Truyền',
        degree: item.degree || 'Bác sĩ Y Học Cổ Truyền',
        specialty: item.specialty || 'Khám & Điều trị Y Học Cổ Truyền',
        licenseNumber:
          item.licenseNumber || 'Bác sĩ Chuyên khoa YHCT – Sở Y Tế cấp',
        yearsOfExperience:
          typeof item.yearsOfExperience === 'number'
            ? item.yearsOfExperience
            : 10,
        bio: item.bio || '',
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        ...(photoUrl ? { photoUrl } : {}),
      };
    });

  return mapped.length > 0 ? mapped : FALLBACK_DOCTORS;
}

function normalizeTestimonials(
  rawList: RawSanityTestimonial[] | null | undefined,
): ClinicTestimonial[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_TESTIMONIALS;
  }

  const mapped = rawList
    .filter((item) => Boolean(item?._id && item?.patientName && item?.quote))
    .map((item): ClinicTestimonial => ({
      _id: item._id,
      patientName: item.patientName || '',
      patientAge: typeof item.patientAge === 'number' ? item.patientAge : 60,
      location: item.location || 'TP. Hồ Chí Minh',
      conditionTreated: item.conditionTreated || 'Chăm sóc sức khỏe YHCT',
      quote: item.quote || '',
      rating:
        typeof item.rating === 'number'
          ? Math.min(5, Math.max(1, Math.round(item.rating)))
          : 5,
      ...(item.treatmentDuration
        ? { treatmentDuration: item.treatmentDuration }
        : {}),
    }));

  return mapped.length > 0 ? mapped : FALLBACK_TESTIMONIALS;
}

function normalizeFaqs(
  rawList: RawSanityFaq[] | null | undefined,
): ClinicFaq[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return FALLBACK_FAQS;
  }

  const mapped = rawList
    .filter((item) => Boolean(item?._id && item?.question && item?.answer))
    .map(
      (item): ClinicFaq => ({
        _id: item._id,
        question: item.question || '',
        answer: item.answer || '',
        category: item.category || 'Chi Phí & Quy Trình',
      }),
    );

  return mapped.length > 0 ? mapped : FALLBACK_FAQS;
}

/**
 * Fetches full landing page content from Sanity CDN with ISR (`revalidate: 3600`, tag `'clinic-content'`).
 * Gracefully falls back to verified `FALLBACK_CLINIC_DATA` when Sanity is not yet configured,
 * unreachable, or when individual collections have not been populated in `/admin` yet.
 */
export async function getClinicPageData(): Promise<ClinicPageData> {
  if (!isSanityConfigured || !sanityClient) {
    return FALLBACK_CLINIC_DATA;
  }

  try {
    const payload = await sanityClient.fetch<RawSanityPagePayload>(
      CLINIC_PAGE_DATA_QUERY,
      {},
      {
        next: {
          revalidate: CLINIC_REVALIDATE_SECONDS,
          tags: [CLINIC_CACHE_TAG],
        },
      },
    );

    const hasLiveContent = Boolean(
      payload?.settings ||
        (payload?.services && payload.services.length > 0) ||
        (payload?.doctors && payload.doctors.length > 0) ||
        (payload?.testimonials && payload.testimonials.length > 0) ||
        (payload?.faqs && payload.faqs.length > 0),
    );

    if (!hasLiveContent) {
      return FALLBACK_CLINIC_DATA;
    }

    return {
      settings: mergeClinicSettings(payload.settings),
      services: normalizeServices(payload.services),
      doctors: normalizeDoctors(payload.doctors),
      testimonials: normalizeTestimonials(payload.testimonials),
      faqs: normalizeFaqs(payload.faqs),
      dataSource: 'sanity',
    };
  } catch (error) {
    console.warn(
      '[Kokoro Sanity] Falling back to built-in clinic content due to fetch error:',
      error instanceof Error ? error.message : error,
    );
    return FALLBACK_CLINIC_DATA;
  }
}
