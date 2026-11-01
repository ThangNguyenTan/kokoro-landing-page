import type { ClinicPageData } from '@/types/clinic';
import { siteUrl } from '@/sanity/env';

export interface ClinicJsonLdProps {
  data: ClinicPageData;
}

/**
 * Normalizes a Vietnamese phone string (e.g. "0922633266" or "092 263 32 66")
 * into international E.164 format ("+84922633266") for Schema.org NAP consistency.
 */
export function formatVietnamPhoneE164(phoneRaw: string): string {
  const digitsAndPlus = (phoneRaw || '').replace(/[^\d+]/g, '');

  if (!digitsAndPlus) {
    return '+84922633266';
  }
  if (digitsAndPlus.startsWith('+84')) {
    return digitsAndPlus;
  }
  if (digitsAndPlus.startsWith('84') && digitsAndPlus.length >= 10) {
    return `+${digitsAndPlus}`;
  }
  if (digitsAndPlus.startsWith('0')) {
    return `+84${digitsAndPlus.slice(1)}`;
  }
  return digitsAndPlus.startsWith('+') ? digitsAndPlus : `+84${digitsAndPlus}`;
}

/**
 * Builds the Schema.org `@graph` payload for Phòng Khám Y Học Cổ Truyền Kokoro,
 * connecting `MedicalClinic` / `LocalBusiness` / `MedicalBusiness`, `Physician` roster,
 * `MedicalTherapy` services, operating credentials, `WebSite`, `MedicalWebPage`, and `FAQPage`.
 */
export function buildClinicJsonLdGraph(data: ClinicPageData) {
  const { settings, services, doctors, testimonials, faqs } = data;
  const clinicId = `${siteUrl}/#clinic`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${siteUrl}/#webpage`;
  const faqId = `${siteUrl}/#faq`;

  const internationalPhone = formatVietnamPhoneE164(settings.phoneRaw);
  const sameAs = [settings.facebookUrl, settings.zaloUrl].filter(Boolean);

  const postalAddress = {
    '@type': 'PostalAddress',
    streetAddress: settings.streetAddress,
    addressLocality: settings.ward,
    addressRegion: settings.city,
    postalCode: settings.postalCode,
    addressCountry: settings.countryCode,
  };

  const validTestimonials = Array.isArray(testimonials)
    ? testimonials.filter((item) => Boolean(item?.patientName && item?.quote))
    : [];

  const ratingBlock =
    validTestimonials.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(
              (
                validTestimonials.reduce(
                  (sum, item) => sum + Math.min(5, Math.max(1, item.rating || 5)),
                  0,
                ) / validTestimonials.length
              ).toFixed(1),
            ),
            bestRating: 5,
            worstRating: 1,
            reviewCount: validTestimonials.length,
          },
          review: validTestimonials.map((item) => ({
            '@type': 'Review',
            '@id': `${siteUrl}/#review-${item._id}`,
            author: {
              '@type': 'Person',
              name: item.patientName,
            },
            name: item.conditionTreated,
            reviewBody: item.quote,
            inLanguage: 'vi-VN',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: Math.min(5, Math.max(1, item.rating || 5)),
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {};

  const physicianNodes = doctors.map((doctor) => ({
    '@type': 'Physician',
    '@id': `${siteUrl}/#physician-${doctor._id}`,
    name: doctor.name,
    jobTitle: doctor.title,
    description: doctor.bio,
    medicalSpecialty: 'TraditionalChineseMedicine',
    knowsAbout: [doctor.specialty, doctor.degree, ...doctor.highlights].filter(
      Boolean,
    ),
    worksFor: {
      '@id': clinicId,
    },
    address: postalAddress,
    telephone: internationalPhone,
    ...(doctor.photoUrl ? { image: doctor.photoUrl } : {}),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Chứng Chỉ Hành Nghề Khám Bệnh, Chữa Bệnh',
      credentialCategory: 'Chứng Chỉ Hành Nghề Khám Bệnh, Chữa Bệnh',
      ...(doctor.degree ? { educationalLevel: doctor.degree } : {}),
      identifier: doctor.licenseNumber,
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: settings.operatingLicenseIssuer,
      },
    },
  }));

  const primaryClinicEntity = {
    '@type': ['MedicalClinic', 'LocalBusiness', 'MedicalBusiness'],
    '@id': clinicId,
    name: settings.clinicName,
    legalName: settings.legalName,
    alternateName: settings.subtitle,
    slogan: settings.motto,
    description: settings.seoDescription,
    url: siteUrl,
    logo: `${siteUrl}/images/kokoro-logo.png`,
    image: [
      `${siteUrl}/images/og-kokoro-clinic.png`,
      `${siteUrl}/images/kokoro-logo.png`,
    ],
    telephone: internationalPhone,
    ...(settings.email ? { email: settings.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    priceRange: '$$',
    currenciesAccepted: 'VND',
    isAcceptingNewPatients: true,
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    hasMap: settings.googleMapsDirectionsUrl,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Phường An Lạc' },
      { '@type': 'Place', name: 'Khu Tên Lửa' },
      { '@type': 'AdministrativeArea', name: 'Bình Tân' },
      { '@type': 'AdministrativeArea', name: 'Quận 6' },
      { '@type': 'AdministrativeArea', name: 'Tân Phú' },
      { '@type': 'City', name: 'TP. Hồ Chí Minh' },
    ],
    openingHoursSpecification: settings.operatingHours.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: spec.schemaDays,
      opens: spec.opens,
      closes: spec.closes,
    })),
    medicalSpecialty: 'TraditionalChineseMedicine',
    availableService: services.map((service) => ({
      '@type': 'MedicalTherapy',
      '@id': `${siteUrl}/#service-${service.slug || service._id}`,
      name: service.title,
      ...(service.categoryBadge ? { alternateName: service.categoryBadge } : {}),
      description: service.shortDescription,
      relevantSpecialty: 'TraditionalChineseMedicine',
      ...(service.imageUrl ? { image: service.imageUrl } : {}),
    })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Giấy Phép Hoạt Động Khám Bệnh, Chữa Bệnh Y Học Cổ Truyền',
      credentialCategory:
        'Giấy Phép Hoạt Động Khám Bệnh, Chữa Bệnh Y Học Cổ Truyền',
      identifier: settings.operatingLicenseNumber,
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: settings.operatingLicenseIssuer,
      },
    },
    ...(physicianNodes.length > 0
      ? {
          employee: physicianNodes.map((doc) => ({ '@id': doc['@id'] })),
        }
      : {}),
    ...ratingBlock,
  };

  const websiteEntity = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteUrl,
    name: settings.clinicName,
    alternateName: settings.subtitle,
    description: settings.seoDescription,
    publisher: {
      '@id': clinicId,
    },
    inLanguage: 'vi-VN',
  };

  const medicalWebPageEntity = {
    '@type': 'MedicalWebPage',
    '@id': webpageId,
    url: siteUrl,
    name: settings.seoTitle,
    description: settings.seoDescription,
    isPartOf: {
      '@id': websiteId,
    },
    about: {
      '@id': clinicId,
    },
    mainEntity: {
      '@id': clinicId,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/og-kokoro-clinic.png`,
      width: 1200,
      height: 630,
    },
    specialty: 'TraditionalChineseMedicine',
    inLanguage: 'vi-VN',
  };

  const validFaqs = Array.isArray(faqs)
    ? faqs.filter((faq) => Boolean(faq?.question && faq?.answer))
    : [];

  const faqPageEntity =
    validFaqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': faqId,
          inLanguage: 'vi-VN',
          isPartOf: {
            '@id': webpageId,
          },
          mainEntity: validFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      primaryClinicEntity,
      ...physicianNodes,
      websiteEntity,
      medicalWebPageEntity,
      ...(faqPageEntity ? [faqPageEntity] : []),
    ],
  };
}

/**
 * Zero-JS React Server Component injecting sanitized Healthcare & Local SEO JSON-LD `@graph`.
 */
export function ClinicJsonLd({ data }: ClinicJsonLdProps) {
  const jsonLdPayload = buildClinicJsonLdGraph(data);
  const safeJson = JSON.stringify(jsonLdPayload).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}

export default ClinicJsonLd;
