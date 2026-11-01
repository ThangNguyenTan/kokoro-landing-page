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
    title: 'Đường nội khu rộng rãi đậu xe ô tô tận cửa',
    detail:
      'Tọa lạc tại Số 13 Đường số 15A (Khu Tên Lửa), cách AEON Mall Bình Tân 100m, nhân viên ân cần hỗ trợ cô chú di chuyển.',
  },
] as const;

export function HeroSection({ settings }: HeroSectionProps) {
  const primarySchedule = settings.operatingHours[0];

  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-[#0D3B2E] bg-[#FAFAF7] py-6 sm:py-10 lg:py-12"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Unified Grand Horizontal Hero Container */}
        <div className="overflow-hidden border-2 border-[#0D3B2E] bg-[#FFFFFF] shadow-sm">
          {/* TIER 1: Full-Width Brand & Authority Bar */}
          <div className="flex flex-col justify-between gap-3 border-b-2 border-[#0D3B2E] bg-[#FAFAF7] px-6 py-3.5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-3">
              <Image
                src="/images/kokoro-logo.webp"
                alt="Logo Phòng Khám Y Học Cổ Truyền Kokoro"
                width={48}
                height={48}
                priority
                className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
              />
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="font-serif text-[18px] font-bold text-[#06231B] sm:text-[20px]">
                  Phòng Khám Y Học Cổ Truyền Kokoro
                </span>
                <span className="text-[15px] font-semibold text-[#0D3B2E]">
                  • {settings.motto}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <span className="inline-flex items-center gap-1.5 border border-[#0D3B2E] bg-[#0D3B2E] px-3 py-1 text-[14px] font-bold text-[#FFFFFF]">
                <span className="h-2 w-2 rounded-full bg-[#B88219]" />
                CHUYÊN KHOA YHCT
              </span>
              <span className="text-[15px] font-semibold text-[#06231B]">
                {primarySchedule
                  ? `${primarySchedule.opens} – ${primarySchedule.closes} (Cả tuần & lễ)`
                  : '08:00 – 20:00'}
              </span>
            </div>
          </div>

          {/* TIER 2: Main Hero Centerpiece (60/40 Horizontal Split) */}
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            {/* Left Content Column (7 cols = ~58%) */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
              <div>
                <span className="inline-block border border-[#0D3B2E] bg-[#FAFAF7] px-3.5 py-1 text-[14px] font-bold tracking-wider text-[#0D3B2E]">
                  ĐÔNG Y TẬN TÂM • KHOA HỌC • AN TOÀN
                </span>

                <h1
                  id="hero-heading"
                  className="mt-4 font-serif text-3xl font-bold leading-[1.2] text-[#06231B] sm:text-4xl lg:text-[40px] xl:text-[44px]"
                >
                  Phòng Khám Y Học Cổ Truyền Kokoro – Châm Cứu, Bấm Huyệt &amp; Điều Trị Đông Y Tận Tâm
                </h1>

                <p className="mt-4 text-[19px] leading-relaxed text-[#06231B] sm:text-[20px]">
                  Đồng hành chăm sóc sức khỏe cơ xương khớp, thần kinh cột sống, mất ngủ và
                  phục hồi vận động cho cô chú trung niên, cao tuổi cùng gia đình tại Khu Tên
                  Lửa, Phường An Lạc. Mỗi liệu trình đều do Bác sĩ chuyên khoa trực tiếp thăm
                  khám, kết hợp tinh hoa Y Học Cổ Truyền và chuẩn mực y học hiện đại an toàn.
                </p>

                {/* 4 Trust Reassurance Badges */}
                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-[16px] font-bold text-[#06231B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#0D3B2E] text-[13px] text-[#FFFFFF]">✓</span>
                    <span>Bác sĩ Chuyên Khoa trực tiếp khám</span>
                  </div>
                  <div className="flex items-center gap-2 text-[16px] font-bold text-[#06231B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#0D3B2E] text-[13px] text-[#FFFFFF]">✓</span>
                    <span>100% Kim vô trùng dùng 1 lần</span>
                  </div>
                  <div className="flex items-center gap-2 text-[16px] font-bold text-[#06231B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#0D3B2E] text-[13px] text-[#FFFFFF]">✓</span>
                    <span>Dược liệu sạch nguồn gốc rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-2 text-[16px] font-bold text-[#06231B]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#0D3B2E] text-[13px] text-[#FFFFFF]">✓</span>
                    <span>Đậu xe ô tô tận cửa (Khu Tên Lửa)</span>
                  </div>
                </div>
              </div>

              {/* Dual Action CTAs Single Row */}
              <div className="mt-8">
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
                <p className="mt-2.5 text-center text-[15px] font-semibold text-[#0D3B2E] sm:text-left">
                  ✦ Bác sĩ chuyên khoa trực tiếp tư vấn • Không phải chờ đợi khi hẹn trước
                </p>
              </div>
            </div>

            {/* Right Visual Column (5 cols = ~42%) */}
            <div className="relative min-h-[360px] border-t-2 border-[#0D3B2E] bg-[#06231B] sm:min-h-[420px] lg:col-span-5 lg:min-h-full lg:border-l-2 lg:border-t-0">
              <Image
                src="/images/gallery/interior-1.webp"
                alt="Không gian phòng điều trị y học cổ truyền tại Phòng Khám Kokoro"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06231B]/90 via-[#06231B]/20 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <span className="inline-block border border-[#FAFAF7] bg-[#0D3B2E]/95 px-3.5 py-1.5 text-[14px] font-bold text-[#FFFFFF] backdrop-blur-sm">
                  Hình ảnh thực tế • Phòng điều trị Kokoro
                </span>
              </div>

              {/* Floating Bottom Reassurance Card */}
              <div className="absolute bottom-4 left-4 right-4 border border-[#FFFFFF]/30 bg-[#0D3B2E]/90 p-4 text-[#FFFFFF] backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
                <p className="font-serif text-[18px] font-bold text-[#FFFFFF]">
                  Không Gian Thanh Tịnh &amp; Vô Trùng
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-[#FAFAF7]">
                  Giường nệm y khoa êm ái, rèm ngăn riêng tư, thoang thoảng hương thảo dược thư giãn, an toàn cho người cao tuổi.
                </p>
              </div>
            </div>
          </div>

          {/* TIER 3: Bottom Horizontal 3-Column Commitments Strip */}
          <div className="border-t-2 border-[#0D3B2E] bg-[#FAFAF7]">
            <div className="grid grid-cols-1 divide-y-2 divide-[#0D3B2E] sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
              {SENIOR_CARE_COMMITMENTS.map((item, idx) => (
                <div key={item.title} className="flex items-start gap-3.5 p-5 sm:p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0D3B2E] text-[16px] font-bold text-[#FFFFFF]"
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-[18px] font-bold leading-snug text-[#06231B]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#06231B]/90">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
