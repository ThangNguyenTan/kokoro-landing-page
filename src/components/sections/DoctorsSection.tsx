'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ClinicDoctor } from '@/types/clinic';

export interface DoctorsSectionProps {
  doctors: ClinicDoctor[];
}

export function DoctorsSection({ doctors }: DoctorsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive visible count
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1200) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, doctors.length - visibleCount);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Keep index valid when visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Auto-slide stepping 1 doctor at a time every 12 seconds, pausing on hover
  useEffect(() => {
    if (maxIndex <= 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 12000);

    return () => clearInterval(interval);
  }, [maxIndex, isPaused]);

  return (
    <section
      id="bac-si"
      aria-labelledby="doctors-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FAFAF7] py-14 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
              ĐỘI NGŨ THẦY THUỐC TỪ TÂM
            </span>
            <h2
              id="doctors-heading"
              className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
            >
              Đội Ngũ Bác Sĩ &amp; Chuyên Gia Y Học Cổ Truyền
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
              Mỗi liệu trình tại Kokoro đều do các Bác sĩ chuyên khoa giàu kinh nghiệm trực
              tiếp bắt mạch, chẩn đoán và theo sát từng buổi trị liệu, tận tình lắng nghe và
              đồng hành cùng cô chú bệnh nhân.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Xem bác sĩ trước"
              className="inline-flex min-h-[50px] min-w-[50px] items-center justify-center border-2 border-[#0D3B2E] bg-[#FFFFFF] text-[18px] font-bold text-[#0D3B2E] transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <span className="min-w-[70px] text-center text-[17px] font-bold text-[#0D3B2E]">
              {currentIndex + 1} / {maxIndex + 1}
            </span>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Xem bác sĩ tiếp theo"
              className="inline-flex min-h-[50px] min-w-[50px] items-center justify-center border-2 border-[#0D3B2E] bg-[#FFFFFF] text-[18px] font-bold text-[#0D3B2E] transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Sliding Viewport */}
        <div className="mt-10 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="shrink-0 px-3 sm:px-4"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article className="flex h-full flex-col overflow-hidden border border-[#0D3B2E] bg-[#FFFFFF] transition-all hover:border-[#06231B]">
                  {/* Doctor Portrait Image on Top - Full bleed portrait */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-[#0D3B2E] bg-[#FAFAF7]">
                    {doctor.photoUrl ? (
                      <Image
                        src={doctor.photoUrl}
                        alt={`Chân dung ${doctor.name} - ${doctor.degree}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0D3B2E] text-[#FFFFFF]">
                        <span className="font-serif text-3xl font-bold">{doctor.name}</span>
                      </div>
                    )}

                    {/* Experience Badge */}
                    <div className="absolute bottom-3 left-3 bg-[#0D3B2E] px-3.5 py-1.5 text-[15px] font-bold text-[#FFFFFF]">
                      {doctor.yearsOfExperience} năm kinh nghiệm
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      {/* Học vị / Academic Title */}
                      <div className="flex items-center gap-2 text-[16px] font-bold text-[#0D3B2E]">
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
                          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <span>{doctor.degree}</span>
                      </div>

                      {/* Doctor Name */}
                      <h3 className="mt-2.5 font-serif text-[24px] font-bold leading-snug text-[#06231B]">
                        {doctor.name}
                      </h3>

                      {/* Chuyên môn sâu */}
                      <div className="mt-3 flex items-start gap-2.5 border-t border-[#0D3B2E]/20 pt-3 text-[17px] leading-relaxed text-[#06231B]">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[#0D3B2E] text-xs font-bold text-[#FFFFFF]"
                        >
                          ✚
                        </span>
                        <div>
                          <strong className="font-bold text-[#0D3B2E]">Chuyên môn sâu:</strong>{' '}
                          <span>{doctor.specialty}</span>
                        </div>
                      </div>

                      {/* Short Bio */}
                      <p className="mt-3 text-[17px] leading-relaxed text-[#06231B]">
                        {doctor.bio}
                      </p>
                    </div>

                    {/* Direct Action Link */}
                    <a
                      href="#dat-lich"
                      className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 border-2 border-[#0D3B2E] bg-[#FAFAF7] px-4 py-2.5 text-[17px] font-bold text-[#0D3B2E] transition-colors hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
                    >
                      <span>Đặt lịch khám với Bác sĩ</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Chuyển đến bác sĩ ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
                className={`h-3.5 transition-all ${
                  currentIndex === index
                    ? 'w-10 bg-[#0D3B2E]'
                    : 'w-3.5 border-2 border-[#0D3B2E] bg-[#FFFFFF] hover:bg-[#0D3B2E]/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DoctorsSection;
