import Image from 'next/image';
import type { ClinicSettings } from '@/types/clinic';

export interface FooterProps {
  settings: ClinicSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[#0D3B2E] bg-[#FFFFFF] pb-32 pt-14 text-[#06231B] md:pb-14">
      <div
        itemScope
        itemType="https://schema.org/MedicalClinic"
        className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8"
      >
        <h2 className="sr-only">Thông tin liên hệ Phòng Khám YHCT Kokoro</h2>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Column 1: Brand, Address & Hours (Equal Height Card with Vertically Centered Address) */}
          <div className="flex h-full flex-col justify-between border-2 border-[#0D3B2E] bg-[#FAFAF7] p-6 sm:p-8 lg:col-span-7">
            {/* Top: Brand Header */}
            <div className="flex items-center gap-4 border-b border-[#0D3B2E]/20 pb-5">
              <Image
                src="/images/kokoro-logo.webp"
                alt="Biểu trưng Phòng Khám Y Học Cổ Truyền Kokoro"
                width={72}
                height={72}
                className="h-[72px] w-[72px] shrink-0 object-contain"
              />
              <div>
                <h3
                  itemProp="name"
                  className="font-serif text-2xl font-bold leading-snug text-[#06231B]"
                >
                  {settings.clinicName}
                </h3>
                <p
                  itemProp="alternateName"
                  className="mt-0.5 text-[18px] font-semibold text-[#0D3B2E]"
                >
                  {settings.subtitle} • {settings.motto}
                </p>
              </div>
            </div>

            {/* Middle: Vertically Centered Address & Landmark */}
            <div
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
              className="my-auto py-6 space-y-2.5 border-l-4 border-[#0D3B2E] pl-5 text-[18px] leading-relaxed text-[#06231B]"
            >
              <p className="font-bold">
                Địa chỉ thăm khám trực tiếp:{' '}
                <span itemProp="streetAddress">{settings.streetAddress}</span>,{' '}
                <span itemProp="addressLocality">{settings.ward}</span>,{' '}
                <span itemProp="addressRegion">{settings.city}</span>
                <meta itemProp="postalCode" content={settings.postalCode} />
                <meta itemProp="addressCountry" content={settings.countryCode} />
              </p>
              <p className="font-medium text-[#0D3B2E]">{settings.landmarkNote}</p>
            </div>

            {/* Bottom: Operating Hours */}
            <div className="border border-[#0D3B2E] bg-[#FFFFFF] p-4">
              <h4 className="text-[19px] font-bold text-[#06231B]">
                Giờ Làm Việc Trong Tuần
              </h4>
              <ul className="mt-2 space-y-1.5 text-[18px] text-[#06231B]">
                {settings.operatingHours.map((spec) => (
                  <li key={`${spec.daysLabel}-${spec.opens}`}>
                    <span className="font-semibold">{spec.daysLabel}:</span>{' '}
                    <span className="font-bold text-[#0D3B2E]">
                      {spec.opens} – {spec.closes}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Direct Contact Channels (Equal Height Card) */}
          <div className="flex h-full flex-col justify-between border-2 border-[#0D3B2E] bg-[#FAFAF7] p-6 sm:p-8 lg:col-span-5">
            <div>
              <h3 className="font-serif text-[22px] font-bold text-[#06231B]">
                Kênh Liên Hệ Chính Thức
              </h3>
              <p className="mt-1 text-[16px] text-[#0D3B2E]">
                Đội ngũ chuyên môn luôn sẵn sàng hỗ trợ và giải đáp thắc mắc
              </p>

              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={`tel:${settings.phoneRaw}`}
                    itemProp="telephone"
                    className="inline-flex min-h-[54px] w-full items-center gap-3 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-4 py-3 text-[19px] font-bold text-[#06231B] transition-colors hover:bg-[#C99224]"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>GỌI NGAY: {settings.phoneDisplay}</span>
                  </a>
                </li>

                <li>
                  <a
                    href={settings.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[54px] w-full items-center gap-3 rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-4 py-3 text-[18px] font-bold text-[#FFFFFF] transition-colors hover:bg-[#06231B]"
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
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>NHẮN ZALO PHÒNG KHÁM</span>
                  </a>
                </li>

                {settings.facebookUrl && (
                  <li>
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[52px] w-full items-center gap-3 rounded-lg border border-[#0D3B2E] bg-[#FFFFFF] px-4 py-2.5 text-[18px] font-semibold text-[#06231B] transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 shrink-0"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span>Trang Facebook Chính Thức</span>
                    </a>
                  </li>
                )}

                {settings.email && (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      itemProp="email"
                      className="inline-flex min-h-[52px] w-full items-center gap-3 rounded-lg border border-[#0D3B2E] bg-[#FFFFFF] px-4 py-2.5 text-[18px] font-semibold text-[#06231B] break-all transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 shrink-0"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span>Email: {settings.email}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Navigation Shortcut at bottom */}
            <div className="mt-6 border-t border-[#0D3B2E] pt-4">
              <a
                href={settings.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-[#0D3B2E] bg-[#FFFFFF] px-4 py-2 text-[17px] font-bold text-[#0D3B2E] transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
              >
                <span>Chỉ đường trên Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Medical Guidance Note & Bottom Copyright */}
        <div className="mt-10 border-t border-[#0D3B2E] pt-6">
          <p className="rounded-lg border border-[#0D3B2E] bg-[#FAFAF7] p-4 text-[18px] leading-relaxed text-[#06231B]">
            <strong className="font-bold">Lưu ý chuyên môn y khoa:</strong> Các thông
            tin trên trang web phục vụ mục đích cung cấp kiến thức và giới thiệu dịch vụ
            khám chữa bệnh Y Học Cổ Truyền; không thay thế cho chẩn đoán trực tiếp của Bác
            sĩ. Hiệu quả điều trị phụ thuộc vào cơ địa, thể trạng và sự tuân thủ phác đồ
            của từng người bệnh.
          </p>

          <div className="mt-6 text-center">
            <p className="text-[18px] font-medium text-[#06231B]">
              © {currentYear} {settings.clinicName}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
