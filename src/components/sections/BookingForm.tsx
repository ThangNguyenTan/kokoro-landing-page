'use client';

import { useState, useTransition, useRef, useEffect, type FormEvent } from 'react';

export interface BookingFormProps {
  phoneDisplay: string;
  phoneRaw: string;
  zaloUrl: string;
  serviceOptions: string[];
}

interface CustomSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" id={id} name={name} value={value} />
      <button
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false);
          if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="flex min-h-[56px] w-full items-center justify-between rounded-lg border-2 border-[#0D3B2E] bg-[#FFFFFF] px-4 py-3 text-left text-[19px] font-medium text-[#06231B] transition-colors hover:border-[#06231B] focus:outline-none focus:ring-2 focus:ring-[#0D3B2E]"
      >
        <span className="truncate pr-2">{value}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 shrink-0 text-[#0D3B2E] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-button`}
          className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-lg border-2 border-[#0D3B2E] bg-[#FFFFFF] py-1.5 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-[18px] sm:text-[19px] transition-colors ${
                  isSelected
                    ? 'bg-[#0D3B2E] font-bold text-[#FFFFFF]'
                    : 'text-[#06231B] hover:bg-[#FAFAF7] hover:text-[#0D3B2E]'
                }`}
              >
                <span>{option}</span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="ml-3 shrink-0 font-bold text-[#B88219]"
                  >
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface BookingSuccessData {
  referenceCode: string;
  receivedAt: string;
  message: string;
}

const PREFERRED_TIME_OPTIONS = [
  'Buổi sáng (08:00 – 11:30)',
  'Buổi chiều (13:30 – 17:00)',
  'Buổi tối (17:00 – 20:00)',
  'Cần khám sớm nhất hôm nay',
] as const;

export function BookingForm({
  phoneDisplay,
  phoneRaw,
  zaloUrl,
  serviceOptions,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState(
    serviceOptions[0] || 'Khám mạch tổng quát & tư vấn cùng Bác sĩ',
  );
  const [preferredTime, setPreferredTime] = useState<string>(
    PREFERRED_TIME_OPTIONS[0],
  );
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<BookingSuccessData | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedName = patientName.trim();
    const digitsOnly = phone.replace(/[^\d]/g, '');

    if (trimmedName.length < 2) {
      setErrorMessage(
        'Cô chú / anh chị vui lòng nhập Họ và Tên để phòng khám tiện xưng hô.',
      );
      return;
    }

    if (digitsOnly.length < 9 || digitsOnly.length > 12) {
      setErrorMessage(
        'Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0909 123 456) để lễ tân gọi xác nhận.',
      );
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientName: trimmedName,
              phone: phone.trim(),
              concern,
              preferredTime,
              notes: notes.trim(),
            }),
          });

          const data = (await response.json()) as {
            ok?: boolean;
            referenceCode?: string;
            receivedAt?: string;
            message?: string;
            error?: string;
          };

          if (!response.ok || !data.ok || !data.referenceCode) {
            setErrorMessage(
              data.error ||
                `Chưa thể gửi biểu mẫu lúc này. Vui lòng gọi trực tiếp ${phoneDisplay} để đặt lịch ngay.`,
            );
            return;
          }

          setSuccessData({
            referenceCode: data.referenceCode,
            receivedAt: data.receivedAt || new Date().toISOString(),
            message:
              data.message ||
              'Phòng khám đã tiếp nhận thông tin đặt lịch và sẽ gọi lại xác nhận sớm nhất.',
          });
        } catch {
          setErrorMessage(
            `Kết nối mạng gián đoạn. Cô chú / anh chị vui lòng gọi trực tiếp ${phoneDisplay} hoặc nhắn Zalo để được hỗ trợ ngay.`,
          );
        }
      })();
    });
  }

  function handleReset() {
    setSuccessData(null);
    setErrorMessage(null);
    setPatientName('');
    setPhone('');
    setNotes('');
  }

  if (successData) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-2 border-[#0D3B2E] bg-[#FAFAF7] p-6 sm:p-7"
      >
        <div className="inline-flex items-center gap-2 bg-[#0D3B2E] px-4 py-1.5 text-[16px] font-bold text-[#FFFFFF]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>ĐĂNG KÝ LỊCH HẸN THÀNH CÔNG</span>
        </div>

        <h4 className="mt-4 font-serif text-2xl font-bold text-[#06231B]">
          Mã phiếu hẹn của quý khách: {successData.referenceCode}
        </h4>

        <p className="mt-3 text-[19px] leading-relaxed text-[#06231B]">
          {successData.message}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={`tel:${phoneRaw}`}
            className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-5 py-3 text-[19px] font-bold text-[#06231B] transition-colors hover:bg-[#C99224]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>GỌI XÁC NHẬN NGAY: {phoneDisplay}</span>
          </a>

          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-lg border-2 border-[#0D3B2E] bg-[#0D3B2E] px-5 py-3 text-[19px] font-bold text-[#FFFFFF] transition-colors hover:bg-[#06231B]"
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
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>NHẮN MÃ HẸN QUA ZALO</span>
          </a>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-4 inline-flex min-h-[54px] items-center gap-2 rounded-lg border border-[#0D3B2E] bg-[#FFFFFF] px-4 py-2.5 text-[18px] font-bold text-[#06231B] hover:bg-[#0D3B2E] hover:text-[#FFFFFF]"
        >
          <span>Đặt thêm lịch hẹn khác cho người thân</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Live Status / Validation Feedback */}
      <div role="status" aria-live="polite">
        {errorMessage && (
          <div className="mb-4 border-2 border-[#06231B] bg-[#FAFAF7] p-4 text-[18px] font-bold leading-relaxed text-[#06231B]">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Row A: Patient Name & Phone Number */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="booking-patient-name"
            className="mb-2 block text-[19px] font-bold text-[#06231B]"
          >
            1. Họ và tên người khám <span aria-hidden="true">(Bắt buộc)</span>
          </label>
          <input
            id="booking-patient-name"
            name="patientName"
            type="text"
            required
            autoComplete="name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Ví dụ: Cô Nguyễn Thị Lan"
            className="min-h-[56px] w-full rounded-lg border-2 border-[#0D3B2E] bg-[#FFFFFF] px-4 py-3 text-[19px] text-[#06231B] placeholder:text-[#0D3B2E] placeholder:opacity-100"
          />
        </div>

        <div>
          <label
            htmlFor="booking-phone"
            className="mb-2 block text-[19px] font-bold text-[#06231B]"
          >
            2. Số điện thoại liên hệ <span aria-hidden="true">(Bắt buộc)</span>
          </label>
          <input
            id="booking-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ví dụ: 0909 123 456"
            className="min-h-[56px] w-full rounded-lg border-2 border-[#0D3B2E] bg-[#FFFFFF] px-4 py-3 text-[19px] text-[#06231B] placeholder:text-[#0D3B2E] placeholder:opacity-100"
          />
        </div>
      </div>

      {/* Row B: Service / Concern & Preferred Time */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="booking-concern-button"
            className="mb-2 block text-[19px] font-bold text-[#06231B]"
          >
            3. Liệu trình hoặc triệu chứng cần tư vấn
          </label>
          <CustomSelect
            id="booking-concern"
            name="concern"
            value={concern}
            onChange={setConcern}
            label="Chọn liệu trình hoặc triệu chứng cần tư vấn"
            options={[
              'Khám mạch tổng quát & tư vấn cùng Bác sĩ',
              ...serviceOptions,
              'Vấn đề sức khỏe khác (ghi rõ bên dưới)',
            ]}
          />
        </div>

        <div>
          <label
            htmlFor="booking-preferred-time-button"
            className="mb-2 block text-[19px] font-bold text-[#06231B]"
          >
            4. Khung giờ mong muốn đến khám
          </label>
          <CustomSelect
            id="booking-preferred-time"
            name="preferredTime"
            value={preferredTime}
            onChange={setPreferredTime}
            label="Chọn khung giờ mong muốn đến khám"
            options={[...PREFERRED_TIME_OPTIONS]}
          />
        </div>
      </div>

      {/* Row C: Notes for Doctor */}
      <div>
        <label
          htmlFor="booking-notes"
          className="mb-2 block text-[19px] font-bold text-[#06231B]"
        >
          5. Ghi chú triệu chứng hoặc nhu cầu hỗ trợ đón tiếp (Không bắt buộc)
        </label>
        <textarea
          id="booking-notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ví dụ: Đau lưng mỏi gối, đi xe ô tô cần chỗ đậu trước cửa và người đỡ cụ vào khám..."
          className="min-h-[96px] w-full rounded-lg border-2 border-[#0D3B2E] bg-[#FFFFFF] px-4 py-3 text-[19px] text-[#06231B] placeholder:text-[#0D3B2E] placeholder:opacity-100"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-[58px] w-full items-center justify-center gap-3 rounded-lg border-2 border-[#06231B] bg-[#B88219] px-6 py-3.5 text-[20px] font-bold text-[#06231B] transition-colors hover:bg-[#C99224] disabled:cursor-wait"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 shrink-0"
        >
          <path d="M22 2 11 13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span>
          {isPending
            ? 'ĐANG GỬI YÊU CẦU ĐẶT LỊCH...'
            : 'GỬI YÊU CẦU ĐẶT LỊCH KHÁM'}
        </span>
      </button>

      <p className="text-[17px] font-medium leading-relaxed text-[#0D3B2E]">
        Đặt lịch trước hoàn toàn miễn phí, giúp cô chú bệnh nhân được Bác sĩ đón tiếp
        đúng giờ mà không phải ngồi chờ lâu.
      </p>
    </form>
  );
}

export default BookingForm;
