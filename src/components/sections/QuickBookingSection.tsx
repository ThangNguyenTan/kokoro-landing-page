import type { ClinicService, ClinicSettings } from '@/types/clinic';
import { BookingForm } from './BookingForm';

export interface QuickBookingSectionProps {
  settings: ClinicSettings;
  services: ClinicService[];
}

export function QuickBookingSection({
  settings,
  services,
}: QuickBookingSectionProps) {
  const serviceOptions = services.map((s) => s.title);

  return (
    <section
      id="dat-lich"
      aria-labelledby="quick-booking-heading"
      className="scroll-mt-28 border-b-2 border-[#0D3B2E] bg-[#FFFFFF] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
            TIẾP NHẬN ĐẶT LỊCH HẸN TRỰC TUYẾN
          </span>
          <h2
            id="quick-booking-heading"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
          >
            Phiếu Đăng Ký Đặt Lịch Hẹn Khám Trực Tiếp Với Bác Sĩ
          </h2>
          <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
            Điền nhanh thông tin bên dưới hoặc bấm gọi trực tiếp. Bộ phận lễ tân Phòng
            Khám YHCT Kokoro sẽ liên hệ xác nhận khung giờ thăm khám trong vòng 15 phút.
          </p>
        </div>

        {/* Row 1: Horizontal Benefits (First Row) */}
        <div className="mt-10 border-2 border-[#0D3B2E] bg-[#FAFAF7] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#0D3B2E] pb-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#06231B]">
                Quyền Lợi Khi Đặt Lịch Hẹn Trước
              </h3>
              <p className="mt-1 text-[16px] text-[#0D3B2E]">
                Cam kết đón tiếp chu đáo, ưu tiên thời gian thăm khám chất lượng cho từng bệnh nhân
              </p>
            </div>

            {/* Quick Hotline Badge */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-4 py-2 text-[17px] font-bold text-[#06231B] transition-colors hover:bg-[#C99224]"
            >
              <span>Hỗ trợ đặt hẹn nhanh: {settings.phoneDisplay}</span>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Benefit 1 */}
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-[#0D3B2E] text-sm font-bold text-[#FFFFFF]"
              >
                ✓
              </span>
              <div>
                <strong className="font-bold text-[18px] text-[#06231B]">
                  Ưu tiên vào phòng khám đúng giờ:
                </strong>
                <p className="mt-1 text-[17px] leading-relaxed text-[#06231B]">
                  Không phải ngồi chờ đợi lâu, Bác sĩ chuẩn bị trước hồ sơ và thời gian
                  thăm khám chu đáo cho từng cô chú.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-3.5 border-t border-[#0D3B2E]/20 pt-4 sm:border-l sm:border-t-0 sm:border-[#0D3B2E]/20 sm:pl-6 sm:pt-0">
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-[#0D3B2E] text-sm font-bold text-[#FFFFFF]"
              >
                ✓
              </span>
              <div>
                <strong className="font-bold text-[18px] text-[#06231B]">
                  Bác sĩ chuyên khoa trực tiếp bắt mạch:
                </strong>
                <p className="mt-1 text-[17px] leading-relaxed text-[#06231B]">
                  Tứ chẩn cặn kẽ, lắng nghe tỉ mỉ bệnh sử và giải thích nguyên nhân bằng
                  ngôn ngữ bình dân, dễ hiểu.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-3.5 border-t border-[#0D3B2E]/20 pt-4 lg:border-l lg:border-t-0 lg:border-[#0D3B2E]/20 lg:pl-6 lg:pt-0">
              <span
                aria-hidden="true"
                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-[#0D3B2E] text-sm font-bold text-[#FFFFFF]"
              >
                ✓
              </span>
              <div>
                <strong className="font-bold text-[18px] text-[#06231B]">
                  An tâm chi phí, minh bạch 100%:
                </strong>
                <p className="mt-1 text-[17px] leading-relaxed text-[#06231B]">
                  Tư vấn phác đồ phù hợp với thể trạng và điều kiện kinh tế, tuyệt đối
                  không lạm dụng kỹ thuật hay ép mua thuốc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Horizontal Booking Form Card (Second Row) */}
        <div className="mt-8 border-2 border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8">
          <div className="border-b border-[#0D3B2E] pb-4">
            <h3 className="font-serif text-2xl font-bold text-[#06231B]">
              Thông Tin Đăng Ký Khám
            </h3>
            <p className="mt-1 text-[16px] text-[#0D3B2E]">
              Điền nhanh thông tin trong 30 giây — Lễ tân gọi xác nhận sau 15 phút.
            </p>
          </div>

          <div className="mt-6">
            <BookingForm
              phoneDisplay={settings.phoneDisplay}
              phoneRaw={settings.phoneRaw}
              zaloUrl={settings.zaloUrl}
              serviceOptions={serviceOptions}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickBookingSection;
