'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ClinicTestimonial } from '@/types/clinic';

export interface TestimonialsSectionProps {
  testimonials: ClinicTestimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Responsive visible count: 2 on desktop/tablet, 1 on mobile
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

  // Detect when customer scrolls to the testimonials section
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

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

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

  // Auto-slide stepping 1 item at a time every 20 seconds, ONLY when in view and not paused
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
      id="cam-nhan"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FAFAF7] py-14 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
              NIỀM TIN TỪ NGƯỜI BỆNH
            </span>
            <h2
              id="testimonials-heading"
              className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
            >
              Cảm Nhận Từ Cô Chú Bệnh Nhân &amp; Gia Đình
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
              Những chia sẻ chân thực từ các cô chú lớn tuổi và gia đình đã trực tiếp trải
              nghiệm liệu trình khám chữa bệnh tại Phòng Khám YHCT Kokoro.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Xem cảm nhận trước"
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
              aria-label="Xem cảm nhận tiếp theo"
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
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="shrink-0 px-3 sm:px-4"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article className="flex h-full flex-col justify-between border border-[#0D3B2E] bg-[#FFFFFF] p-6 sm:p-8 transition-all hover:border-[#06231B]">
                  <div>
                    {/* Patient Profile Header with Image */}
                    <div className="flex items-center gap-4 border-b border-[#0D3B2E]/20 pb-4">
                      {item.photoUrl ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#0D3B2E]">
                          <Image
                            src={item.photoUrl}
                            alt={`Chân dung ${item.patientName}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#0D3B2E] bg-[#0D3B2E] text-xl font-bold text-[#FFFFFF]">
                          {item.patientName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <h3 className="font-serif text-[22px] font-bold leading-tight text-[#06231B]">
                          {item.patientName}
                        </h3>
                        <p className="mt-0.5 text-[16px] font-semibold text-[#0D3B2E]">
                          {item.patientAge ? `${item.patientAge} tuổi • ` : ''}
                          {item.location}
                        </p>
                      </div>
                    </div>

                    {/* Condition badge */}
                    <div className="mt-4">
                      <span className="inline-block bg-[#FAFAF7] border border-[#0D3B2E] px-3 py-1 text-[15px] font-bold text-[#0D3B2E]">
                        Tình trạng: {item.conditionTreated}
                      </span>
                    </div>

                    {/* Quote text */}
                    <p className="mt-4 font-serif text-[18px] sm:text-[19px] italic leading-relaxed text-[#06231B]">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Outcome / duration pill */}
                  <div className="mt-6 border-t border-[#0D3B2E]/20 pt-4">
                    <p className="text-[16px] font-bold text-[#0D3B2E]">
                      ✓ {item.treatmentDuration ? `Thời gian điều trị: ${item.treatmentDuration}` : 'Đã cải thiện tích cực sau liệu trình'}
                    </p>
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
                aria-label={`Chuyển đến cảm nhận ${index + 1}`}
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

export default TestimonialsSection;
