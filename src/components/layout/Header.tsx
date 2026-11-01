import Image from 'next/image';
import type { ClinicSettings } from '@/types/clinic';

export interface HeaderProps {
  settings: ClinicSettings;
}

const NAV_ITEMS = [
  { href: '#dich-vu', label: 'Dịch Vụ' },
  { href: '#quy-trinh', label: 'Quy Trình' },
  { href: '#khong-gian', label: 'Không Gian' },
  { href: '#bac-si', label: 'Bác Sĩ' },
  { href: '#hoi-dap', label: 'Hỏi Đáp' },
  { href: '#dat-lich', label: 'Đặt Lịch' },
] as const;

export function Header({ settings }: HeaderProps) {
  return (
    <>
      {/* Tier 1: Top Medical Utility Bar (Scrolls naturally above sticky header) */}
      <div className="border-b border-[#06231B] bg-[#0D3B2E] text-[#FFFFFF]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-1.5 px-4 py-2 text-[16px] font-medium leading-snug sm:px-6 md:flex-row md:items-center md:justify-between">
          <span className="inline-flex items-center gap-2 text-[#FFFFFF]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              {settings.streetAddress}, {settings.ward}, {settings.city} (Khu Tên
              Lửa – Gần AEON Bình Tân 100m)
            </span>
          </span>

          <span className="inline-flex items-center gap-2 text-[#FFFFFF]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Giờ khám: 08:00 – 20:00 (Thứ 2 – Chủ Nhật, kể cả lễ)</span>
          </span>
        </div>
      </div>

      {/* Tier 2: Sticky Primary Navigation & Immediate Action Bar */}
      <header className="sticky top-0 z-40 border-b-2 border-[#0D3B2E] bg-[#FFFFFF]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 sm:px-6 sm:py-3 lg:flex-nowrap">
          {/* Brand Identity */}
          <a
            href="#"
            className="inline-flex min-h-[56px] shrink-0 items-center gap-2.5 rounded-lg pr-1 text-[#06231B] transition-colors"
          >
            <Image
              src="/images/kokoro-logo.webp"
              alt="Biểu trưng Phòng Khám Y Học Cổ Truyền Kokoro"
              width={56}
              height={56}
              sizes="56px"
              className="h-[50px] w-[50px] shrink-0 object-contain sm:h-[56px] sm:w-[56px]"
            />
            <span className="flex flex-col">
              <span className="font-serif text-[19px] font-bold leading-tight text-[#06231B] sm:text-[20px]">
                Phòng Khám YHCT Kokoro
              </span>
              <span className="mt-0.5 text-[15px] font-semibold leading-snug text-[#0D3B2E] sm:text-[16px]">
                {settings.motto}
              </span>
            </span>
          </a>

          {/* Primary Desktop Navigation */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden items-center gap-3 lg:flex xl:gap-5"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[54px] shrink-0 items-center whitespace-nowrap rounded-lg px-1 py-2 text-[17px] font-semibold text-[#06231B] underline-offset-8 transition-colors hover:bg-[#FAFAF7] hover:text-[#0D3B2E] hover:underline xl:text-[18px]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Sticky Immediate Action CTAs */}
          <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto sm:gap-2.5">
            <a
              href={settings.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-[54px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-3.5 py-2.5 text-[18px] font-bold text-[#FFFFFF] transition-colors hover:bg-[#06231B] xl:inline-flex"
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
              <span>ZALO TƯ VẤN</span>
            </a>

            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex min-h-[54px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-[#06231B] bg-[#B88219] px-3.5 py-2.5 text-[19px] font-bold leading-snug text-[#06231B] transition-colors hover:bg-[#C99224] sm:w-auto sm:px-4"
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
              <span>GỌI: {settings.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
