import Image from 'next/image';
import type { ClinicSettings } from '@/types/clinic';

export interface HeroSectionProps {
  settings: ClinicSettings;
}

const SENIOR_CARE_COMMITMENTS = [
  {
    title: 'Bác sĩ Chuyên Khoa trực tiếp thăm khám',
    detail:
      'Bắt mạch tứ chẩn kỹ lưỡng, lắng nghe cặn kẽ và giải thích rõ ràng nguyên nhân bệnh bằng ngôn ngữ dễ hiểu.',
  },
  {
    title: 'Phác đồ Đông – Tây y kết hợp khoa học',
    detail:
      'Kim châm vô trùng dùng một lần, dược liệu sạch rõ nguồn gốc, theo dõi chuyển biến thực tế qua từng buổi.',
  },
  {
    title: 'Không gian phòng khám thoáng mát, an toàn cho người cao tuổi',
    detail:
      'Đường nội khu rộng rãi đậu xe ô tô ngay cửa, phòng trị liệu khang trang, nhân viên ân cần hỗ trợ cô chú di chuyển.',
  },
] as const;

export function HeroSection({ settings }: HeroSectionProps) {
  const primarySchedule = settings.operatingHours[0];

  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-[#0D3B2E] bg-[#FAFAF7] py-10 sm:py-14 lg:py-18"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Architectural Heritage Showcase Card (Apothecary Seal Emblem + Commitments) */}
          <div className="flex h-full flex-col justify-between border-2 border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-5">
            <div>
              {/* Framed Apothecary Seal Box */}
              <div className="flex flex-col items-center border border-[#0D3B2E] bg-[#FAFAF7] px-4 py-4 text-center sm:py-5">
                <Image
                  src="/images/kokoro-logo.webp"
                  alt="Logo Phòng Khám Y Học Cổ Truyền Kokoro - Từ Tâm Khoa Học Hiệu Quả"
                  width={340}
                  height={340}
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 200px, 240px"
                  className="h-[190px] w-[190px] object-contain sm:h-[220px] sm:w-[220px]"
                />
                <p className="mt-2.5 font-serif text-[18px] font-bold text-[#06231B] sm:text-[19px]">
                  Ấn Chương Y Đức • {settings.subtitle}
                </p>
              </div>

              <h2 className="mt-6 font-serif text-[23px] font-bold leading-snug text-[#06231B]">
                Cam Kết Chăm Sóc Chuẩn Mực Cho Người Cao Tuổi
              </h2>

              <ul className="mt-4 space-y-3.5">
                {SENIOR_CARE_COMMITMENTS.map((item, idx) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3.5 border-t border-[#0D3B2E] pt-3.5 first:border-t-0 first:pt-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center bg-[#0D3B2E] text-[16px] font-bold text-[#FFFFFF]"
                    >
                      0{idx + 1}
                    </span>
                    <div className="text-[17px] leading-relaxed text-[#06231B]">
                      <p className="font-bold text-[#06231B]">{item.title}</p>
                      <p className="mt-0.5 text-[#06231B]">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Medical Authority, Headline, Dual CTAs (Single Row) & Location Card (Matches Left Height) */}
          <div className="flex h-full flex-col justify-between gap-6 border-2 border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-7">
            {/* 1. Authority Badge & Main Title */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-2 text-[16px] font-semibold tracking-wide text-[#FFFFFF] sm:text-[17px]">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#FAFAF7]"
                />
                <span>
                  PHÒNG KHÁM CHUYÊN KHOA YHCT • {settings.motto.toUpperCase()}
                </span>
              </div>

              <h1
                id="hero-heading"
                className="mt-4 font-serif text-3xl font-bold leading-[1.22] text-[#06231B] sm:text-4xl lg:text-[42px]"
              >
                Phòng Khám Y Học Cổ Truyền Kokoro – Châm Cứu, Bấm Huyệt &amp; Điều Trị
                Đông Y Tận Tâm
              </h1>
            </div>

            {/* 2. Clinical Lead Description */}
            <p className="text-[19px] leading-relaxed text-[#06231B] sm:text-[20px]">
              Đồng hành chăm sóc sức khỏe cơ xương khớp, thần kinh cột sống, mất ngủ và
              phục hồi vận động cho cô chú trung niên, cao tuổi cùng gia đình tại Khu Tên
              Lửa, Phường An Lạc. Mỗi liệu trình đều do Bác sĩ chuyên khoa trực tiếp thăm
              khám, kết hợp tinh hoa Y Học Cổ Truyền và chuẩn mực y học hiện đại an toàn.
            </p>

            {/* 3. Dual CTAs Arranged on 1 Single Row */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-4 py-3.5 text-center text-[19px] font-bold leading-snug text-[#06231B] transition-colors hover:bg-[#C99224]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>GỌI TƯ VẤN: {settings.phoneDisplay}</span>
              </a>

              <a
                href={settings.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-4 py-3.5 text-center text-[19px] font-bold leading-snug text-[#FFFFFF] transition-colors hover:bg-[#06231B]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 shrink-0"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>NHẮN ZALO ĐẶT LỊCH</span>
              </a>
            </div>

            {/* 4. Quick Location & Hours Summary Card anchored at bottom */}
            <div className="border border-[#0D3B2E] bg-[#FAFAF7] p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#0D3B2E] bg-[#FFFFFF] text-[#0D3B2E]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[18px] font-bold text-[#06231B]">
                      {settings.streetAddress}, {settings.ward}, {settings.city}
                    </p>
                    <p className="mt-1 text-[17px] leading-relaxed text-[#0D3B2E]">
                      Khu Tên Lửa, cách AEON Mall Bình Tân 100m — Có chỗ đậu xe ô tô ngay
                      cửa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-[#0D3B2E] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#0D3B2E] bg-[#FFFFFF] text-[#0D3B2E]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[18px] font-bold text-[#06231B]">
                      Giờ mở cửa đón bệnh nhân
                    </p>
                    {primarySchedule ? (
                      <p className="mt-1 text-[17px] leading-relaxed text-[#0D3B2E]">
                        {primarySchedule.daysLabel}:{' '}
                        <strong className="font-bold text-[#06231B]">
                          {primarySchedule.opens} – {primarySchedule.closes}
                        </strong>
                      </p>
                    ) : (
                      <p className="mt-1 text-[17px] leading-relaxed text-[#0D3B2E]">
                        Thứ Hai – Chủ Nhật: 08:00 – 20:00
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#0D3B2E] pt-4">
                <a
                  href="#dat-lich"
                  className="inline-flex min-h-[48px] items-center gap-2 text-[17px] font-bold text-[#0D3B2E] underline underline-offset-4 hover:text-[#06231B]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  <span>Xem phiếu đăng ký giờ khám trước bên dưới</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
