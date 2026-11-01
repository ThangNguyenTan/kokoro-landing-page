/**
 * Shared Domain Contracts for Phòng Khám Y Học Cổ Truyền Kokoro
 * Used across Sanity CMS GROQ queries, Vietnamese fallback data, SEO Schema.org JSON-LD, and UI components.
 */

export interface OpeningHourSpec {
  /** Human-readable Vietnamese schedule label (e.g. "Thứ Hai – Chủ Nhật") */
  daysLabel: string;
  /** Schema.org DayOfWeek identifiers (e.g. ["Monday", "Tuesday", ...]) */
  schemaDays: string[];
  /** Opening time in 24h HH:mm format (e.g. "08:00") */
  opens: string;
  /** Closing time in 24h HH:mm format (e.g. "20:00") */
  closes: string;
}

export interface ClinicSettings {
  /** Display clinic name (e.g. "Phòng Khám Y Học Cổ Truyền Kokoro") */
  clinicName: string;
  /** Official registered legal name */
  legalName: string;
  /** Brand subtitle (e.g. "Kokoro Wellness Clinic") */
  subtitle: string;
  /** Core philosophy / motto (e.g. "Từ Tâm – Khoa Học – Hiệu Quả") */
  motto: string;
  /** Formatted phone number for easy reading by older patients (e.g. "092 263 32 66") */
  phoneDisplay: string;
  /** Dialable raw digits / E.164 or local string for tel: links (e.g. "0922633266") */
  phoneRaw: string;
  /** Direct Zalo consultation link (e.g. "https://zalo.me/0922633266") */
  zaloUrl: string;
  /** Official clinic contact email */
  email: string;
  /** Official Facebook fanpage URL */
  facebookUrl: string;
  /** Street address line (e.g. "13 Đường số 15A") */
  streetAddress: string;
  /** Ward / Phường (e.g. "Phường An Lạc") */
  ward: string;
  /** City / Province (e.g. "TP. Hồ Chí Minh") */
  city: string;
  /** Postal code (e.g. "700000") */
  postalCode: string;
  /** ISO 3166-1 alpha-2 country code (e.g. "VN") */
  countryCode: string;
  /** Helpful wayfinding landmark note for patients arriving by car/taxi */
  landmarkNote: string;
  /** Geographic latitude for Schema.org GeoCoordinates & maps */
  latitude: number;
  /** Geographic longitude for Schema.org GeoCoordinates & maps */
  longitude: number;
  /** Direct Google Maps turn-by-turn directions URL */
  googleMapsDirectionsUrl: string;
  /** Embeddable Google Maps iframe URL */
  googleMapsEmbedUrl: string;
  /** Department of Health operating license number (Giấy phép hoạt động KCB) */
  operatingLicenseNumber: string;
  /** Issuing authority (e.g. "Sở Y Tế TP. Hồ Chí Minh") */
  operatingLicenseIssuer: string;
  /** Structured weekly operating hours */
  operatingHours: OpeningHourSpec[];
  /** Primary SEO <title> */
  seoTitle: string;
  /** Primary SEO meta description */
  seoDescription: string;
  /** Target Vietnamese local medical SEO keywords */
  seoKeywords: string[];
}

export interface ClinicService {
  /** Unique document ID */
  _id: string;
  /** Vietnamese treatment/service title */
  title: string;
  /** URL-safe slug */
  slug: string;
  /** Short category badge (e.g. "Cơ Xương Khớp", "Thần Kinh & Giấc Ngủ") */
  categoryBadge: string;
  /** Clear, patient-friendly summary of the therapy */
  shortDescription: string;
  /** Key clinical benefits / symptoms addressed */
  benefits: string[];
  /** Typical session duration note (e.g. "45 – 60 phút / buổi") */
  durationNote: string;
  /** Who this therapy is best suited for */
  targetAudience: string;
  /** Semantic icon identifier mapped by UI components */
  iconName: string;
  /** Optional Sanity CDN or local image URL */
  imageUrl?: string;
  /** Optional service-specific SEO title */
  seoTitle?: string;
  /** Optional service-specific SEO description */
  seoDescription?: string;
}

export interface ClinicDoctor {
  /** Unique document ID */
  _id: string;
  /** Full name of the physician */
  name: string;
  /** Clinical role / title (e.g. "Bác Sĩ Phụ Trách Chuyên Môn") */
  title: string;
  /** Medical degree / academic qualification (e.g. "Bác sĩ Chuyên khoa I Y Học Cổ Truyền") */
  degree: string;
  /** Core clinical specialty */
  specialty: string;
  /** Medical practicing certificate number (Chứng chỉ hành nghề) */
  licenseNumber: string;
  /** Number of years in clinical practice */
  yearsOfExperience: number;
  /** Warm, trustworthy clinical biography */
  bio: string;
  /** Key credentials, hospital affiliations, or treatment strengths */
  highlights: string[];
  /** Optional portrait image URL */
  photoUrl?: string;
}

export interface ClinicTestimonial {
  /** Unique document ID */
  _id: string;
  /** Patient display name (e.g. "Cô Nguyễn Thị Minh H.") */
  patientName: string;
  /** Patient age in years */
  patientAge: number;
  /** Residential district/area (e.g. "P. An Lạc, Quận Bình Tân") */
  location: string;
  /** Condition or symptom treated */
  conditionTreated: string;
  /** Authentic Vietnamese patient feedback quote */
  quote: string;
  /** Star rating (1–5) */
  rating: number;
  /** Optional duration of treatment course (e.g. "Sau 2 liệu trình (10 buổi)") */
  treatmentDuration?: string;
  /** Optional patient portrait / photo URL */
  photoUrl?: string;
}

export interface ClinicFaq {
  /** Unique document ID */
  _id: string;
  /** Patient or family caregiver question */
  question: string;
  /** Clear, reassuring, medically accurate Vietnamese answer */
  answer: string;
  /** Pre-visit guidance category badge */
  category: string;
}

export interface ClinicPageData {
  /** Global clinic contact, license, hours, and SEO settings */
  settings: ClinicSettings;
  /** Ordered list of Traditional Medicine therapies & services */
  services: ClinicService[];
  /** Ordered list of licensed physicians & practitioners */
  doctors: ClinicDoctor[];
  /** Ordered list of verified patient stories */
  testimonials: ClinicTestimonial[];
  /** Ordered list of pre-visit guidance & frequently asked questions */
  faqs: ClinicFaq[];
  /** Indicates whether data came live from Sanity CMS or built-in fallback */
  dataSource: 'sanity' | 'fallback';
}
