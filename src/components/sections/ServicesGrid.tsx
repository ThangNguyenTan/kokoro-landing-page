'use client';

import { useState, useEffect, useRef } from 'react';
import type { ClinicService } from '@/types/clinic';

export interface ServicesGridProps {
  services: ClinicService[];
}

function ServiceTherapyIcon({ iconName }: { iconName: string }) {
  switch (iconName) {
    case 'acupuncture':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          {/* Kim châm cứu y tế với chuôi kim xoắn (Acupuncture needle with coiled handle) */}
          <path d="M12 2v5" strokeWidth="2.5" />
          <path d="M10 3.5h4" strokeWidth="1.5" />
          <path d="M10 5.5h4" strokeWidth="1.5" />
          <path d="M12 7v14" strokeWidth="1.5" />
          {/* Sóng xung điện tần số sinh học giảm đau (Electro-acupuncture frequency pulse) */}
          <path d="M3 15h4l2-4 3 8 2-5 2 2h5" strokeWidth="1.8" />
        </svg>
      );
    case 'acupressure':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
          <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
          <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      );
    case 'cupping':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M6 19h12" />
          <path d="M7 19c0-6 1.5-11 5-11s5 5 5 11" />
          <path d="M12 3v3" />
          <path d="M9 5l1.5 1.5" />
          <path d="M15 5l-1.5 1.5" />
        </svg>
      );
    case 'herbal':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case 'sleep':
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <path d="M19 3v4" />
          <path d="M21 5h-4" />
        </svg>
      );
    case 'rehab':
    default:
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 7v6" />
          <path d="M9 10h6" />
        </svg>
      );
  }
}

export function ServicesGrid({ services }: ServicesGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Responsive visible count: 2 items on desktop & tablet for extra width, 1 on mobile
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Detect when customer scrolls to the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxIndex = Math.max(0, services.length - visibleCount);

  // Step exactly 1 item at a time
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

  // Auto-slide stepping 1 item at a time every 20 seconds, ONLY when customer has scrolled to this section
  useEffect(() => {
    if (maxIndex <= 0 || isPaused || !isInView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 20000);

    return () => clearInterval(interval);
  }, [maxIndex, isPaused, isInView]);

  return (
    <section
      ref={sectionRef}
      id="dich-vu"
      aria-labelledby="services-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FAFAF7] py-14 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
              DANH MỤC ĐIỀU TRỊ CHUYÊN KHOA
            </span>
            <h2
              id="services-heading"
              className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
            >
              Phương Pháp Điều Trị Y Học Cổ Truyền Chuyên Sâu
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
              Mỗi phác đồ tại Kokoro đều được cá nhân hóa dựa trên tứ chẩn (Vọng – Văn – Vấn
              – Thiết), tác động đúng căn nguyên bệnh lý và phù hợp thể trạng người Việt lớn
              tuổi.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Xem dịch vụ trước"
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
              aria-label="Xem dịch vụ tiếp theo"
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
            {services.map((service) => (
              <div
                key={service._id}
                className="shrink-0 px-3 sm:px-4"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article className="flex h-full flex-col justify-between border border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 transition-all hover:border-[#06231B]">
                  <div>
                    {/* Top Category Badge & Apothecary Icon Box */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-block bg-[#0D3B2E] px-3.5 py-1.5 text-[16px] font-semibold text-[#FFFFFF]">
                        {service.categoryBadge}
                      </span>
                      <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center border border-[#0D3B2E] bg-[#FAFAF7] text-[#0D3B2E]">
                        <ServiceTherapyIcon iconName={service.iconName} />
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-bold leading-snug text-[#06231B]">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-[18px] leading-relaxed text-[#06231B]">
                      {service.shortDescription}
                    </p>

                    {service.benefits.length > 0 && (
                      <ul className="mt-5 space-y-2.5 border-t border-[#0D3B2E] pt-4 text-[18px] leading-relaxed text-[#06231B]">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2.5">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mt-1.5 h-5 w-5 shrink-0 text-[#0D3B2E]"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Metadata Box & Action Anchor */}
                  <div className="mt-6">
                    <div className="border border-[#0D3B2E] bg-[#FAFAF7] p-4 text-[18px] leading-relaxed text-[#06231B]">
                      <p>
                        <strong className="font-bold text-[#0D3B2E]">Thời lượng:</strong>{' '}
                        {service.durationNote}
                      </p>
                      <p className="mt-1.5">
                        <strong className="font-bold text-[#0D3B2E]">Đối tượng phù hợp:</strong>{' '}
                        {service.targetAudience}
                      </p>
                    </div>

                    <a
                      href="#dat-lich"
                      className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-5 py-3 text-[18px] font-bold text-[#FFFFFF] transition-colors hover:bg-[#06231B]"
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
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <span>Đặt lịch tư vấn liệu trình này</span>
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Chuyển đến dịch vụ ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
                className={`h-3 rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-8 bg-[#0D3B2E]'
                    : 'w-3 bg-[#0D3B2E]/30 hover:bg-[#0D3B2E]/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesGrid;
