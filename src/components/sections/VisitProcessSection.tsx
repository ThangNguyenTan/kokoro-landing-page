const ESSENTIAL_INFO_CARDS = [
  {
    id: 'transparent-pricing',
    title: 'Chi Phí Minh Bạch Báo Trước',
    description:
      'Tư vấn rõ phác đồ và báo mức phí cụ thể từng buổi trước khi trị liệu; không phát sinh chi phí ẩn hay ép mua gói dài ngày.',
    icon: 'pricing',
  },
  {
    id: 'weekend-hours',
    title: 'Khám Cả Thứ Bảy & Chủ Nhật',
    description:
      'Mở cửa xuyên suốt 08:00 – 20:00 tất cả các ngày trong tuần, thuận tiện con cháu đưa ông bà đến khám ngoài giờ hành chính.',
    icon: 'calendar',
  },
  {
    id: 'medical-records',
    title: 'Hồ Sơ Y Tế Nên Mang Theo',
    description:
      'Cô chú mang theo phim X-quang, MRI, kết quả xét nghiệm cũ hoặc đơn thuốc Tây đang dùng (nếu có) để Bác sĩ phối hợp an toàn.',
    icon: 'records',
  },
  {
    id: 'ground-floor-parking',
    title: 'Đậu Xe Ô Tô Rộng Rãi & Đón Tiếp Tận Nơi',
    description:
      'Đường số 15A nội khu rộng rãi có chỗ đậu xe ô tô ngay trước cửa phòng khám, không gian thoáng mát và nhân viên hỗ trợ cô chú chu đáo.',
    icon: 'accessibility',
  },
] as const;

const VISIT_STEPS = [
  {
    step: 'BƯỚC 01',
    title: 'Đặt Hẹn Trước – Đón Tiếp Ngay',
    description:
      'Gọi Hotline hoặc nhắn Zalo giữ giờ trước; khi đến nơi cô chú được mời vào phòng khám ngay, không phải xếp hàng bốc số.',
  },
  {
    step: 'BƯỚC 02',
    title: 'Bác Sĩ Chẩn Đoán & Bắt Mạch',
    description:
      'Bác sĩ chuyên khoa trực tiếp chẩn đoán, bắt mạch, kiểm tra tầm vận động cơ xương khớp và rà soát kỹ bệnh nền huyết áp, tiểu đường.',
  },
  {
    step: 'BƯỚC 03',
    title: 'Thống Nhất Phác Đồ Cá Nhân Hóa',
    description:
      'Giải thích cặn kẽ nguyên nhân bệnh bằng ngôn ngữ đời thường dễ hiểu, thống nhất phương pháp và chi phí rõ ràng.',
  },
  {
    step: 'BƯỚC 04',
    title: 'Trị Liệu 1 Kèm 1 & Dưỡng Sinh Tại Nhà',
    description:
      'Thực hiện châm cứu, bấm huyệt êm ái với kim vô khuẩn dùng 1 lần; hướng dẫn bài tập dưỡng sinh và đồng hành theo dõi sau khám.',
  },
] as const;

function EssentialCardIcon({ name }: { name: (typeof ESSENTIAL_INFO_CARDS)[number]['icon'] }) {
  switch (name) {
    case 'pricing':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
          <path d="M6 15h4" />
        </svg>
      );
    case 'calendar':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case 'records':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="18" y2="12" />
          <line x1="9" x2="15" y1="15" y2="15" />
        </svg>
      );
    case 'accessibility':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
  }
}

export function VisitProcessSection() {
  return (
    <section
      id="quy-trinh"
      aria-labelledby="visit-process-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FAFAF7] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
            HƯỚNG DẪN ĐÓN TIẾP BỆNH NHÂN
          </span>
          <h2
            id="visit-process-heading"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
          >
            Cần Biết Khi Đến Khám &amp; Quy Trình 4 Bước Không Chờ Đợi
          </h2>
          <p className="mt-4 text-[19px] leading-relaxed text-[#06231B] sm:text-[20px]">
            Khác với cảnh chen chúc xếp hàng tại các cơ sở đông đúc, Phòng Khám YHCT
            Kokoro sắp xếp khung giờ thăm khám riêng biệt 1 kèm 1 trong không gian thoáng
            mát, yên tĩnh, giúp cô chú lớn tuổi luôn thong thả và thoải mái.
          </p>
        </div>

        {/* Part A: 4 "Cần Biết Trước Khi Đến Khám" Practical Utility Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ESSENTIAL_INFO_CARDS.map((card) => (
            <article
              key={card.id}
              className="relative flex flex-col justify-between overflow-hidden border border-[#0D3B2E] bg-[#FFFFFF] p-6"
            >
              {/* Decorative Gold Architectural Corner Ribbon */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[38px] border-t-[38px] border-l-transparent border-t-[#B88219]"
              />

              <div>
                <span className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0D3B2E] text-[#FFFFFF]">
                  <EssentialCardIcon name={card.icon} />
                </span>

                <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-[#06231B]">
                  {card.title}
                </h3>

                <p className="mt-3 text-[18px] leading-relaxed text-[#06231B]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Part B: 4-Step Outpatient Visit Flow */}
        <div className="mt-14 border-t border-[#0D3B2E] pt-12">
          <div className="max-w-3xl">
            <h3 className="font-serif text-2xl font-bold leading-snug text-[#06231B] sm:text-3xl">
              Quy Trình Thăm Khám 4 Bước Nhẹ Nhàng Cho Người Cao Tuổi
            </h3>
            <p className="mt-2 text-[18px] leading-relaxed text-[#06231B] sm:text-[19px]">
              Mọi khâu từ lúc bước xuống xe đến khi hoàn tất buổi trị liệu đều có nhân
              viên y tế hướng dẫn ân cần, rõ ràng từng bước.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VISIT_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex flex-col justify-between border border-[#0D3B2E] bg-[#FFFFFF] p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block bg-[#0D3B2E] px-3.5 py-1.5 text-[16px] font-bold tracking-wide text-[#FFFFFF]">
                      {item.step}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-0.5 flex-1 bg-[#0D3B2E]"
                    />
                  </div>

                  <h4 className="mt-5 font-serif text-[21px] font-bold leading-snug text-[#06231B]">
                    {item.title}
                  </h4>

                  <p className="mt-3 text-[18px] leading-relaxed text-[#06231B]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisitProcessSection;
