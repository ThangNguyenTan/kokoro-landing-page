import { NextResponse } from 'next/server';

interface BookingRequestBody {
  patientName?: unknown;
  phone?: unknown;
  concern?: unknown;
  preferredTime?: unknown;
  notes?: unknown;
}

function cleanField(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLen);
}

function generateReferenceCode(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `KKR-${yy}${mm}${dd}-${suffix}`;
}

export async function POST(request: Request) {
  let payload: BookingRequestBody;

  try {
    payload = (await request.json()) as BookingRequestBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Thông tin gửi lên chưa đúng định dạng. Cô chú / anh chị vui lòng kiểm tra lại hoặc gọi trực tiếp 092 263 32 66.',
      },
      { status: 400 },
    );
  }

  const patientName = cleanField(payload.patientName, 120);
  const phone = cleanField(payload.phone, 30);
  const concern = cleanField(payload.concern, 200);
  const preferredTime = cleanField(payload.preferredTime, 120);
  const notes = cleanField(payload.notes, 600);

  if (patientName.length < 2) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Cô chú / anh chị vui lòng nhập Họ và Tên (tối thiểu 2 ký tự) để lễ tân tiện xưng hô khi đón tiếp.',
      },
      { status: 400 },
    );
  }

  const digitsOnly = phone.replace(/[^\d]/g, '');
  if (digitsOnly.length < 9 || digitsOnly.length > 12) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Vui lòng nhập số điện thoại hợp lệ (9 – 11 chữ số) để phòng khám liên hệ xác nhận lịch hẹn.',
      },
      { status: 400 },
    );
  }

  const referenceCode = generateReferenceCode();
  const receivedAt = new Date().toISOString();

  // Structured server log for clinic reception integration / webhook forwarding
  console.info('[Kokoro Booking Received]', {
    referenceCode,
    receivedAt,
    patientName,
    phone,
    concern: concern || 'Khám mạch & tư vấn tổng quát',
    preferredTime: preferredTime || 'Linh hoạt trong giờ làm việc',
    hasNotes: Boolean(notes),
  });

  return NextResponse.json(
    {
      ok: true,
      referenceCode,
      receivedAt,
      message: `Phòng Khám YHCT Kokoro đã ghi nhận lịch hẹn của ${patientName}. Bộ phận lễ tân sẽ gọi xác nhận qua số ${phone} trong vòng 15 phút (khung giờ 08:00 – 20:00).`,
    },
    { status: 200 },
  );
}
