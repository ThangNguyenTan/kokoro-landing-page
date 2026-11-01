import Image from 'next/image';
import Link from 'next/link';
import { dataset, isSanityConfigured } from '@/sanity/env';
import StudioClient from './StudioClient';

export const dynamic = 'force-static';

const CMS_COLLECTIONS = [
  {
    id: 'clinicSettings',
    viTitle: '1. Thông Tin Phòng Khám (Singleton)',
    enTitle: 'Clinic Settings & Operating License',
    desc: 'Quản lý tên phòng khám, số điện thoại Hotline, link Zalo, địa chỉ Phường An Lạc, giờ mở cửa, số giấy phép Sở Y Tế và cấu hình SEO.',
  },
  {
    id: 'services',
    viTitle: '2. Dịch Vụ Y Học Cổ Truyền',
    enTitle: 'Traditional Medicine Services',
    desc: 'Thêm/sửa các phương pháp Châm cứu, Bấm huyệt, Giác hơi cứu ngải, Phục hồi vận động, Điều trị mất ngủ và Thuốc thang Đông y.',
  },
  {
    id: 'doctors',
    viTitle: '3. Đội Ngũ Bác Sĩ & Lương Y',
    enTitle: 'Licensed Physicians & Practitioners',
    desc: 'Cập nhật hồ sơ bác sĩ YHCT, học vị chuyên khoa, số chứng chỉ hành nghề, số năm kinh nghiệm và thế mạnh chuyên môn.',
  },
  {
    id: 'testimonials',
    viTitle: '4. Cảm Nhận Bệnh Nhân',
    enTitle: 'Verified Patient Stories',
    desc: 'Đăng tải câu chuyện hồi phục thực tế của các cô chú, anh chị bệnh nhân sau liệu trình điều trị tại Kokoro.',
  },
  {
    id: 'faqs',
    viTitle: '5. Câu Hỏi Thường Gặp (FAQ)',
    enTitle: 'Pre-Visit Guidance & FAQs',
    desc: 'Giải đáp minh bạch về quy trình châm cứu vô khuẩn, chi phí khám, chuẩn bị hồ sơ y tế, phối hợp Đông – Tây y và chỗ đậu ô tô.',
  },
];

export default function StudioPage() {
  if (isSanityConfigured) {
    return <StudioClient />;
  }

  return (
    <main className="min-h-screen bg-kokoro-canvas px-4 py-12 text-kokoro-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="rounded-2xl border-2 border-kokoro-border bg-kokoro-surface p-6 shadow-kokoro-card sm:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/kokoro-logo.png"
                alt="Biểu trưng Phòng Khám Y Học Cổ Truyền Kokoro"
                width={84}
                height={84}
                className="h-20 w-20 shrink-0 object-contain"
                priority
              />
              <div>
                <span className="inline-block rounded-full bg-kokoro-forest px-3.5 py-1 text-sm font-semibold tracking-wide text-[#FAFAF7]">
                  Sanity Studio CMS • Gói Miễn Phí $0 Trọn Đời
                </span>
                <h1 className="mt-2 font-serif text-2xl font-bold text-kokoro-ink sm:text-3xl">
                  Kích Hoạt Trang Quản Trị Kokoro (/admin)
                </h1>
                <p className="mt-1 text-base text-kokoro-ink/85">
                  Connect Your Free Forever ($0/mo) Sanity Project ID in 60 Seconds
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl border-2 border-kokoro-border bg-kokoro-gold px-6 py-3 text-base font-bold text-kokoro-ink transition-colors hover:bg-kokoro-gold-hover"
            >
              ← Về Trang Chủ Phòng Khám
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-kokoro-border/30 bg-kokoro-canvas p-5">
            <p className="text-base leading-relaxed text-kokoro-ink">
              <strong>Trạng thái hiện tại:</strong> Biến môi trường{' '}
              <code className="rounded border border-kokoro-border/30 bg-kokoro-surface px-2 py-0.5 font-mono text-sm font-semibold">
                NEXT_PUBLIC_SANITY_PROJECT_ID
              </code>{' '}
              chưa được cấu hình (Dataset mặc định:{' '}
              <code className="rounded border border-kokoro-border/30 bg-kokoro-surface px-2 py-0.5 font-mono text-sm font-semibold">
                {dataset}
              </code>
              ). Trang chủ hiện đang hiển thị đầy đủ dữ liệu chuẩn mặc định của{' '}
              <strong>Phòng Khám Y Học Cổ Truyền Kokoro</strong>.
            </p>
          </div>

          {/* 60-Second Setup Steps (VI + EN) */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-xl border-2 border-kokoro-border bg-kokoro-surface p-6">
              <span className="inline-block rounded-md bg-kokoro-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FAFAF7]">
                Cách 1 • Nhanh Nhất (CLI)
              </span>
              <h2 className="mt-3 text-xl font-bold text-kokoro-ink">
                Khởi tạo tự động trong 60 giây
              </h2>
              <p className="mt-2 text-base text-kokoro-ink/90">
                Mở cửa sổ dòng lệnh tại thư mục dự án và chạy lệnh sau để tạo Project miễn phí ($0/tháng):
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-kokoro-border bg-kokoro-canvas p-3.5 font-mono text-sm font-semibold text-kokoro-ink">
                npx sanity@latest init --env .env.local
              </pre>
              <p className="mt-3 text-sm text-kokoro-ink/80">
                <em>English:</em> Run the command above, sign in with Google, create a Free Forever project (dataset{' '}
                <code>production</code>), then restart <code>npm run dev</code>.
              </p>
            </section>

            <section className="rounded-xl border-2 border-kokoro-border bg-kokoro-surface p-6">
              <span className="inline-block rounded-md bg-kokoro-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#FAFAF7]">
                Cách 2 • Qua Trình Duyệt (Web)
              </span>
              <h2 className="mt-3 text-xl font-bold text-kokoro-ink">
                Lấy Project ID tại sanity.io/manage
              </h2>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-base text-kokoro-ink/90">
                <li>
                  Truy cập{' '}
                  <a
                    href="https://www.sanity.io/manage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-kokoro-border underline-offset-4"
                  >
                    sanity.io/manage
                  </a>{' '}
                  và tạo Project mới (Free Plan).
                </li>
                <li>
                  Sao chép <strong>Project ID</strong> dán vào tệp <code>.env.local</code> (hoặc Vercel Environment Variables):
                </li>
              </ol>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-kokoro-border bg-kokoro-canvas p-3 font-mono text-xs font-semibold text-kokoro-ink">
{`NEXT_PUBLIC_SANITY_PROJECT_ID="your_id"
NEXT_PUBLIC_SANITY_DATASET="production"`}
              </pre>
              <p className="mt-2 text-sm text-kokoro-ink/80">
                Nhớ thêm <code>http://localhost:3000</code> và tên miền chính thức vào mục{' '}
                <strong>API → CORS Origins (Allow credentials)</strong>.
              </p>
            </section>
          </div>

          {/* 5 CMS Collections */}
          <div className="mt-10">
            <h2 className="font-serif text-xl font-bold text-kokoro-ink sm:text-2xl">
              5 Danh Mục Nội Dung Được Tích Hợp Sẵn (5 Built-In CMS Collections)
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {CMS_COLLECTIONS.map((col) => (
                <div
                  key={col.id}
                  className="rounded-xl border border-kokoro-border/40 bg-kokoro-canvas p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-kokoro-ink">{col.viTitle}</h3>
                    <code className="rounded bg-kokoro-surface px-2 py-0.5 font-mono text-xs font-semibold text-kokoro-border">
                      {col.id}
                    </code>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-kokoro-border">
                    {col.enTitle}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-kokoro-ink/90">{col.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
