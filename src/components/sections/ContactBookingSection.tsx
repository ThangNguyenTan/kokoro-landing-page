import type { ClinicSettings } from '@/types/clinic';
import { MapFacade } from './MapFacade';

export interface ContactBookingSectionProps {
  settings: ClinicSettings;
}

export function ContactBookingSection({
  settings,
}: ContactBookingSectionProps) {
  const primarySchedule = settings.operatingHours[0];

  return (
    <section
      id="chi-duong"
      aria-labelledby="location-heading"
      className="scroll-mt-28 bg-[#FAFAF7] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
            VỊ TRÍ &amp; HƯỚNG DẪN DI CHUYỂN
          </span>
          <h2
            id="location-heading"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
          >
            Vị Trí Phòng Khám YHCT Kokoro &amp; Hướng Dẫn Đến Thăm Khám
          </h2>
          <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
            Tọa lạc tại trung tâm Khu Tên Lửa, Phường An Lạc — cách TTTM AEON Mall Bình Tân
            chỉ khoảng 100m. Mặt tiền đường nội khu rộng thoáng, thuận tiện cho xe ô tô
            và taxi đưa đón người lớn tuổi tận cửa.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Clinic Direct Contact, Parking & Navigation Guidance (Matches Right Card Height) */}
          <div className="flex h-full flex-col justify-between border-2 border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-5">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#06231B]">
                Thông Tin Đến Thăm Khám Trực Tiếp
              </h3>

              <div className="mt-5 space-y-4 text-[18px] leading-relaxed text-[#06231B]">
                <div className="border-l-4 border-[#0D3B2E] pl-4">
                  <p className="font-bold text-[#06231B]">Địa chỉ phòng khám:</p>
                  <p className="mt-0.5 text-[#06231B]">
                    {settings.streetAddress}, {settings.ward}, {settings.city}
                  </p>
                  <p className="mt-1 text-[16px] font-semibold text-[#0D3B2E]">
                    {settings.landmarkNote}
                  </p>
                </div>

                <div className="border-l-4 border-[#0D3B2E] pl-4">
                  <p className="font-bold text-[#06231B]">Giờ tiếp đón bệnh nhân:</p>
                  {primarySchedule ? (
                    <p className="mt-0.5 text-[#06231B]">
                      {primarySchedule.daysLabel}: {primarySchedule.opens} – {primarySchedule.closes} (kể cả Thứ 7 &amp; Chủ Nhật)
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[#06231B]">
                      Thứ Hai – Chủ Nhật: 08:00 – 20:00 (kể cả ngày lễ)
                    </p>
                  )}
                </div>

                <div className="border-l-4 border-[#0D3B2E] pl-4">
                  <p className="font-bold text-[#06231B]">Chỗ đậu xe ô tô &amp; xe máy:</p>
                  <p className="mt-0.5 text-[#06231B]">
                    Mặt tiền rộng rãi, đậu được xe ô tô ngay trước cửa phòng khám. Nhân viên hỗ trợ mở cửa và đón cô chú vào phòng khám.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Booking Link Card anchored to the bottom */}
            <div className="mt-6 border-t border-[#0D3B2E] pt-6">
              <div className="border border-[#0D3B2E] bg-[#FAFAF7] p-5">
                <p className="text-[17px] font-bold text-[#06231B]">
                  Quý cô chú muốn đăng ký khám trước?
                </p>
                <p className="mt-1 text-[16px] leading-relaxed text-[#06231B]">
                  Điền nhanh phiếu thông tin trên đầu trang để được Bác sĩ ưu tiên tiếp đón đúng hẹn mà không phải chờ đợi.
                </p>
                <a
                  href="#dat-lich"
                  className="mt-4 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-4 py-2.5 text-[18px] font-bold text-[#06231B] transition-colors hover:bg-[#C99224]"
                >
                  <span>LÊN ĐẦU TRANG ĐIỀN PHIẾU ĐẶT LỊCH</span>
                  <span aria-hidden="true">↑</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Full Interactive Google Map Embed (Matches Left Card Height) */}
          <div className="flex h-full flex-col justify-between border-2 border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-7">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#06231B]">
                Bản Đồ Chỉ Đường Trực Tiếp (Google Maps)
              </h3>
              <p className="mt-1.5 text-[17px] text-[#0D3B2E]">
                Bấm vào bản đồ để phóng to, thu nhỏ hoặc bấm nút bên dưới để mở ứng dụng Google Maps chỉ đường
              </p>
            </div>

            <div className="mt-5 flex flex-1 flex-col">
              <MapFacade
                googleMapsEmbedUrl={settings.googleMapsEmbedUrl}
                googleMapsDirectionsUrl={settings.googleMapsDirectionsUrl}
                streetAddress={settings.streetAddress}
                ward={settings.ward}
                city={settings.city}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactBookingSection;
