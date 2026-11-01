'use client';

import { useState } from 'react';
import type { ClinicFaq, ClinicSettings } from '@/types/clinic';

export interface SymptomFaqSectionProps {
  faqs: ClinicFaq[];
  settings: ClinicSettings;
}

const SYMPTOM_TRIAGE_GROUPS = [
  {
    badge: 'Cột Sống & Rễ Thần Kinh',
    title: 'Đau Lưng & Thần Kinh Tọa',
    symptoms: [
      'Đau âm ỉ hoặc đau buốt vùng thắt lưng khi cúi ngửa, mang vác nhẹ',
      'Thoát vị đĩa đệm, gai cột sống gây đau lan xuống mông và bắp chân',
      'Tê mỏi dọc chân khi đứng nấu ăn hoặc đi bộ quãng ngắn',
    ],
  },
  {
    badge: 'Vùng Cổ Vai & Tứ Chi',
    title: 'Cổ Vai Gáy & Tê Bì Tay Chân',
    symptoms: [
      'Cứng cổ mỗi sáng thức dậy, khó xoay đầu sang hai bên',
      'Đau mỏi nhức bả vai lan xuống cánh tay, hội chứng ống cổ tay',
      'Tê rần, châm chích đầu ngón tay – bàn chân ở người lớn tuổi',
    ],
  },
  {
    badge: 'Khớp Gối & Phục Hồi Cơ',
    title: 'Thoái Hóa Khớp Gối & Vận Động',
    symptoms: [
      'Khớp gối kêu lục khục, đau chói khi lên xuống cầu thang hoặc đứng dậy',
      'Cứng khớp buổi sáng, sưng mỏi khớp khi thời tiết chuyển lạnh',
      'Yếu cơ tay chân, đi lại kém vững hoặc phục hồi sau tai biến',
    ],
  },
  {
    badge: 'Dưỡng Tâm & Tuần Hoàn Não',
    title: 'Mất Ngủ Tuổi Già & Tiền Đình',
    symptoms: [
      'Trằn trọc khó vào giấc, ngủ nông hay giật mình thức giấc lúc 2–3 giờ sáng',
      'Hoa mắt, chóng mặt, ù tai, nặng đầu do thiếu máu lên não',
      'Mệt mỏi suy nhược kéo dài, ăn uống kém hấp thu',
    ],
  },
] as const;

export function SymptomFaqSection({ faqs }: SymptomFaqSectionProps) {
  // Single active accordion index so opening one collapses all others
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="hoi-dap"
      aria-labelledby="symptom-faq-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FAFAF7] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
            NHẬN BIẾT SỚM &amp; GIẢI ĐÁP THẮC MẮC
          </span>
          <h2
            id="symptom-faq-heading"
            className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
          >
            Triệu Chứng Nên Khám Sớm &amp; Câu Hỏi Thường Gặp
          </h2>
          <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
            Thăm khám Y Học Cổ Truyền ngay từ giai đoạn chớm đau mỏi giúp điều hòa khí
            huyết, phục hồi gân cốt tự nhiên và hạn chế phụ thuộc thuốc giảm đau dài ngày.
          </p>
        </div>

        {/* Part A: 4-Column Symptom Quick-Triage Grid */}
        <div className="mt-10 mb-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SYMPTOM_TRIAGE_GROUPS.map((group) => (
            <article
              key={group.title}
              className="flex flex-col justify-between border border-[#0D3B2E] bg-[#FFFFFF] p-6"
            >
              <div>
                <span className="inline-block bg-[#0D3B2E] px-3 py-1 text-[15px] font-semibold text-[#FFFFFF]">
                  {group.badge}
                </span>

                <h3 className="mt-4 font-serif text-[21px] font-bold leading-snug text-[#06231B]">
                  {group.title}
                </h3>

                <ul className="mt-4 space-y-2.5 border-t border-[#0D3B2E] pt-4 text-[18px] leading-relaxed text-[#06231B]">
                  {group.symptoms.map((symptom) => (
                    <li key={symptom} className="flex items-start gap-2.5">
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
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Part B: Single-Open FAQ Accordion (collapses other tabs to save space) */}
        <div>
          <h3 className="font-serif text-2xl font-bold leading-snug text-[#06231B] sm:text-3xl">
            Câu Hỏi Thường Gặp Từ Cô Chú Bệnh Nhân &amp; Gia Đình
          </h3>

          <div className="mt-6 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq._id}
                  className="border border-[#0D3B2E] bg-[#FFFFFF]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex min-h-[62px] w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-[19px] font-bold text-[#06231B] transition-colors hover:bg-[#FAFAF7] sm:text-[20px]"
                  >
                    <span className="leading-snug text-[#06231B]">
                      {faq.question}
                    </span>

                    <span
                      aria-hidden="true"
                      className="shrink-0 border border-[#0D3B2E] bg-[#FAFAF7] px-3 py-1 text-base font-bold text-[#06231B] transition-transform duration-200"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {/* Smooth Animated Tab Content */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#0D3B2E] bg-[#FAFAF7] px-6 py-5 text-[18px] leading-relaxed text-[#06231B] sm:text-[19px]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SymptomFaqSection;
