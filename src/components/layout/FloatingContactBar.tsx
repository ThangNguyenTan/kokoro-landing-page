import type { ClinicSettings } from '@/types/clinic';

export interface FloatingContactBarProps {
  settings: ClinicSettings;
}

export function FloatingContactBar({ settings }: FloatingContactBarProps) {
  return (
    <aside
      aria-label="Thanh liên hệ nhanh trên điện thoại"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#0D3B2E] bg-[#FFFFFF] px-3 py-2.5 shadow-[0_-6px_20px_rgba(6,35,27,0.14)] md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5">
        <a
          href={`tel:${settings.phoneRaw}`}
          className="inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-2.5 py-2 text-center text-[19px] font-bold leading-snug text-[#06231B] transition-colors hover:bg-[#C99224]"
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

        <a
          href={settings.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-2.5 py-2 text-center text-[19px] font-bold leading-snug text-[#FFFFFF] transition-colors hover:bg-[#06231B]"
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
          <span>NHẮN ZALO</span>
        </a>
      </div>
    </aside>
  );
}

export default FloatingContactBar;
