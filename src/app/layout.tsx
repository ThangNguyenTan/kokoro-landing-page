import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import { buildClinicMetadata } from '@/lib/metadata';
import { getClinicPageData } from '@/sanity/queries';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
});

const lora = Lora({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '700'],
  variable: '--font-lora',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: '#FAFAF7',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getClinicPageData();
  return buildClinicMetadata(settings);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${lora.variable}`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-screen bg-kokoro-canvas font-sans text-kokoro-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:min-h-[48px] focus:items-center focus:rounded-xl focus:border-2 focus:border-kokoro-border focus:bg-kokoro-canvas focus:px-6 focus:py-3 focus:text-base focus:font-bold focus:text-kokoro-ink focus:shadow-lg"
        >
          Chuyển đến nội dung chính
        </a>
        {children}
      </body>
    </html>
  );
}
