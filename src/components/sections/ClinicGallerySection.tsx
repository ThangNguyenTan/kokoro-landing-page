'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'all' | 'treatment' | 'pharmacy' | 'exterior';
  categoryLabel: string;
  description: string;
  src: string;
  alt: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'exterior-main',
    title: 'Mặt Tiền Phòng Khám YHCT Kokoro',
    category: 'exterior',
    categoryLabel: 'Mặt Tiền & Lối Vào',
    description:
      'Số 13 Đường số 15A, P. An Lạc (Khu Tên Lửa). Đường rộng rãi, bằng phẳng, ô tô và taxi đậu ngay trước cửa phòng khám.',
    src: '/images/gallery/exterior-2.webp',
    alt: 'Mặt tiền thực tế Phòng Khám Y Học Cổ Truyền Kokoro Bình Tân',
  },
  {
    id: 'treatment-acupuncture-room',
    title: 'Phòng Trị Liệu Châm Cứu & Bấm Huyệt',
    category: 'treatment',
    categoryLabel: 'Phòng Trị Liệu',
    description:
      'Giường trị liệu y khoa êm ái, rèm che ngăn cách riêng tư, ga trải sạch sẽ vô trùng được thay mới cho từng bệnh nhân.',
    src: '/images/gallery/interior-2.webp',
    alt: 'Phòng trị liệu châm cứu bấm huyệt tại Kokoro',
  },
  {
    id: 'reception-lobby',
    title: 'Không Gian Tiếp Đón & Chờ Khám Ấm Cúng',
    category: 'treatment',
    categoryLabel: 'Khu Vực Tiếp Đón',
    description:
      'Không gian thoáng mát, thanh tịnh với tông màu gỗ ấm cúng, phục vụ trà thảo mộc ấm giúp cô chú thư thái tinh thần.',
    src: '/images/gallery/interior-1.webp',
    alt: 'Khu vực tiếp đón bệnh nhân tại Phòng Khám YHCT Kokoro',
  },
  {
    id: 'doctor-consultation',
    title: 'Khu Bắt Mạch Tứ Chẩn & Thăm Khám Chuyên Khoa',
    category: 'treatment',
    categoryLabel: 'Phòng Bác Sĩ',
    description:
      'Nơi Bác sĩ chuyên khoa trực tiếp lắng nghe cặn kẽ, bắt mạch tứ chẩn và giải thích nguyên nhân bệnh lý bằng ngôn ngữ gần gũi.',
    src: '/images/gallery/interior-3.webp',
    alt: 'Bàn bắt mạch chẩn đoán y học cổ truyền tại Kokoro',
  },
  {
    id: 'herbal-pharmacy-cabinet',
    title: 'Tủ Dược Liệu Thuốc Thang Đông Y Chuẩn Sạch',
    category: 'pharmacy',
    categoryLabel: 'Nhà Thuốc Đông Y',
    description:
      'Dược liệu sạch đạt chuẩn chất lượng, được bảo quản cẩn thận trong các ô tủ gỗ truyền thống đúng quy chuẩn y tế.',
    src: '/images/gallery/interior-4.webp',
    alt: 'Tủ dược liệu thuốc thang y học cổ truyền Kokoro',
  },
  {
    id: 'herbal-dispensing',
    title: 'Khu Vực Cân Chia Dược Liệu Chính Xác',
    category: 'pharmacy',
    categoryLabel: 'Nhà Thuốc Đông Y',
    description:
      'Mỗi thang thuốc đều được cân định lượng tỉ mỉ theo đúng phác đồ gia giảm riêng biệt cho cơ địa từng người bệnh.',
    src: '/images/gallery/interior-5.webp',
    alt: 'Khu vực cân chia thuốc thang Đông y chuẩn xác',
  },
  {
    id: 'physio-rehab-station',
    title: 'Giường Điện Châm & Phục Hồi Vận Động',
    category: 'treatment',
    categoryLabel: 'Phòng Trị Liệu',
    description:
      'Trang bị máy điện châm tần số sinh học, đèn hồng ngoại ôn thông kinh lạc an toàn cho người cao tuổi đau nhức cột sống.',
    src: '/images/gallery/interior-6.webp',
    alt: 'Trang thiết bị điện châm và đèn hồng ngoại y khoa',
  },
  {
    id: 'waiting-lounge',
    title: 'Góc Nghỉ Ngơi Yên Tĩnh Cho Thân Nhân',
    category: 'treatment',
    categoryLabel: 'Khu Vực Tiếp Đón',
    description:
      'Ghế ngồi êm ái, không gian nhẹ nhàng không tiếng ồn bệnh viện, tạo cảm giác an tâm cho con cháu đưa cha mẹ đến khám.',
    src: '/images/gallery/interior-7.webp',
    alt: 'Góc nghỉ ngơi yên tĩnh cho người nhà và bệnh nhân',
  },
  {
    id: 'clean-supplies',
    title: 'Dụng Cụ Vô Trùng Chuẩn Y Khoa',
    category: 'treatment',
    categoryLabel: 'Phòng Trị Liệu',
    description:
      '100% kim châm cứu dùng một lần đóng vỉ vô trùng, cồn sát khuẩn chuẩn Bộ Y Tế, tuyệt đối bảo đảm an toàn chống lây nhiễm.',
    src: '/images/gallery/interior-8.webp',
    alt: 'Kim châm cứu vô trùng dùng một lần chuẩn Sở Y Tế',
  },
  {
    id: 'tranquil-atmosphere',
    title: 'Không Gian Thanh Tịnh Hương Thảo Mộc',
    category: 'treatment',
    categoryLabel: 'Không Gian Trị Liệu',
    description:
      'Không khí phòng khám phảng phất hương ngải diệp và thảo dược dịu nhẹ, giúp xoa dịu thần kinh và giấc ngủ.',
    src: '/images/gallery/interior-9.webp',
    alt: 'Không gian phòng khám thanh tịnh thoáng mát',
  },
  {
    id: 'exterior-entrance',
    title: 'Biển Hiệu & Lối Vào An Toàn Cho Người Cao Tuổi',
    category: 'exterior',
    categoryLabel: 'Mặt Tiền & Lối Vào',
    description:
      'Biển hiệu nhận diện rõ ràng, lối vào không bậc tam cấp nguy hiểm, nhân viên tận tâm hỗ trợ cô chú di chuyển.',
    src: '/images/gallery/exterior-1.webp',
    alt: 'Lối vào an toàn cho người cao tuổi tại Kokoro Clinic',
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'Tất Cả (11)' },
  { key: 'treatment', label: 'Phòng Trị Liệu & Khám (7)' },
  { key: 'pharmacy', label: 'Nhà Thuốc Đông Y (2)' },
  { key: 'exterior', label: 'Mặt Tiền & Lối Vào (2)' },
] as const;

export function ClinicGallerySection() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Filter items based on active tab
  const filteredPhotos =
    activeTab === 'all'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeTab);

  // Handle responsive visible card count
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, filteredPhotos.length - visibleCount);

  // Reset index when filter tab changes
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setCurrentIndex(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Gentle auto-slide stepping 1 at a time every 8 seconds, paused on hover
  useEffect(() => {
    if (maxIndex <= 0 || isPaused || selectedPhoto !== null) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [maxIndex, isPaused, selectedPhoto]);

  // Handle Escape key to close lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedPhoto) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto, handleKeyDown]);

  return (
    <section
      id="khong-gian"
      aria-labelledby="gallery-heading"
      className="scroll-mt-28 border-b border-[#0D3B2E] bg-[#FFFFFF] py-14 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-semibold tracking-wide text-[#FFFFFF]">
              KHÔNG GIAN &amp; CƠ SỞ VẬT CHẤT
            </span>
            <h2
              id="gallery-heading"
              className="mt-4 font-serif text-3xl font-bold leading-tight text-[#06231B] sm:text-4xl"
            >
              Hình Ảnh Thực Tế Phòng Khám Y Học Cổ Truyền Kokoro
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-[#06231B]">
              Không gian khám chữa bệnh thanh tịnh, kiểm soát nhiễm khuẩn nghiêm ngặt, kết
              hợp nét mộc mạc của Đông y truyền thống và tiện nghi y khoa hiện đại — mang
              lại trải nghiệm thư thái nhất cho người lớn tuổi.
            </p>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Xem hình trước"
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

            <span className="text-[17px] font-bold text-[#06231B]">
              {currentIndex + 1} / {maxIndex + 1}
            </span>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Xem hình kế tiếp"
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

        {/* Filter Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`min-h-[48px] px-4 py-2 text-[17px] font-bold transition-colors ${
                  isActive
                    ? 'border-2 border-[#0D3B2E] bg-[#0D3B2E] text-[#FFFFFF]'
                    : 'border-2 border-[#0D3B2E] bg-[#FAFAF7] text-[#06231B] hover:bg-[#FFFFFF]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sliding Viewport Container */}
        <div className="relative mt-8 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="shrink-0 px-3"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <article
                  onClick={() => setSelectedPhoto(photo)}
                  className="group flex h-full cursor-pointer flex-col justify-between border-2 border-[#0D3B2E] bg-[#FAFAF7] transition-all hover:bg-[#FFFFFF] hover:shadow-lg"
                >
                  {/* Photo Frame with Aspect Ratio */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-[#0D3B2E] bg-[#06231B]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="inline-block border border-[#0D3B2E] bg-[#0D3B2E]/90 px-3 py-1 text-[14px] font-bold text-[#FFFFFF] backdrop-blur-sm">
                        {photo.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1.5 border border-[#06231B] bg-[#B88219] px-3 py-1 text-[14px] font-bold text-[#06231B]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        Phóng to
                      </span>
                    </div>
                  </div>

                  {/* Caption & Description */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <h3 className="font-serif text-xl font-bold leading-snug text-[#06231B] group-hover:text-[#0D3B2E]">
                        {photo.title}
                      </h3>
                      <p className="mt-2 text-[17px] leading-relaxed text-[#06231B]/90">
                        {photo.description}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-[#0D3B2E]/20 pt-3">
                      <span className="inline-flex items-center gap-1.5 text-[16px] font-bold text-[#0D3B2E] underline underline-offset-4 group-hover:text-[#06231B]">
                        Xem hình ảnh lớn
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển đến ảnh số ${idx + 1}`}
                className={`h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-[#0D3B2E]'
                    : 'w-3 bg-[#0D3B2E]/30 hover:bg-[#0D3B2E]/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accessible Full-Screen Modal Lightbox */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-photo-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#06231B]/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden border-2 border-[#0D3B2E] bg-[#FAFAF7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-[#0D3B2E] bg-[#0D3B2E] px-6 py-4 text-[#FFFFFF]">
              <span className="inline-block bg-[#B88219] px-3 py-1 text-[14px] font-bold text-[#06231B]">
                {selectedPhoto.categoryLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Đóng cửa sổ ảnh"
                className="inline-flex h-10 w-10 items-center justify-center border border-[#FFFFFF] bg-transparent text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#06231B]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="relative aspect-[4/3] w-full bg-[#06231B]">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
                priority
              />
            </div>

            {/* Modal Footer Description */}
            <div className="p-6">
              <h3
                id="modal-photo-title"
                className="font-serif text-2xl font-bold text-[#06231B]"
              >
                {selectedPhoto.title}
              </h3>
              <p className="mt-2 text-[18px] leading-relaxed text-[#06231B]">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
