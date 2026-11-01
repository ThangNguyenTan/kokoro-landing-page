import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản Trị Nội Dung (CMS) | Phòng Khám YHCT Kokoro',
  description: 'Hệ thống quản trị nội dung Sanity Studio dành cho Phòng Khám Y Học Cổ Truyền Kokoro.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-kokoro-canvas text-kokoro-ink">
      {children}
    </div>
  );
}
