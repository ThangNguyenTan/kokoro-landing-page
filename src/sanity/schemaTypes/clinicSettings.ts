import { defineArrayMember, defineField, defineType } from 'sanity';

const DAYS_OF_WEEK_OPTIONS = [
  { title: 'Thứ Hai (Monday)', value: 'Monday' },
  { title: 'Thứ Ba (Tuesday)', value: 'Tuesday' },
  { title: 'Thứ Tư (Wednesday)', value: 'Wednesday' },
  { title: 'Thứ Năm (Thursday)', value: 'Thursday' },
  { title: 'Thứ Sáu (Friday)', value: 'Friday' },
  { title: 'Thứ Bảy (Saturday)', value: 'Saturday' },
  { title: 'Chủ Nhật (Sunday)', value: 'Sunday' },
];

export const clinicSettings = defineType({
  name: 'clinicSettings',
  title: 'Cài Đặt Phòng Khám & Pháp Lý',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Thương Hiệu & Liên Hệ', default: true },
    { name: 'location', title: 'Địa Chỉ & Bản Đồ' },
    { name: 'compliance', title: 'Pháp Lý Y Tế' },
    { name: 'hours', title: 'Giờ Làm Việc' },
    { name: 'seo', title: 'SEO & Tìm Kiếm' },
  ],
  fields: [
    // --- 1. Brand & Contact ---
    defineField({
      name: 'clinicName',
      title: 'Tên Hiển Thị Phòng Khám',
      description: 'Tên chính thức hiển thị trên đầu trang và chân trang (VD: Phòng Khám Y Học Cổ Truyền Kokoro).',
      type: 'string',
      group: 'brand',
      initialValue: 'Phòng Khám Y Học Cổ Truyền Kokoro',
      validation: (Rule) => Rule.required().error('Vui lòng nhập tên hiển thị của phòng khám.'),
    }),
    defineField({
      name: 'legalName',
      title: 'Tên Pháp Nhân Đăng Ký',
      description: 'Tên đầy đủ theo Giấy phép hoạt động khám chữa bệnh (VD: Phòng Khám Chuyên Khoa Y Học Cổ Truyền Kokoro).',
      type: 'string',
      group: 'brand',
      initialValue: 'Phòng Khám Chuyên Khoa Y Học Cổ Truyền Kokoro',
      validation: (Rule) => Rule.required().error('Vui lòng nhập tên pháp nhân của phòng khám.'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Tên Phụ / Thương Hiệu Quốc Tế',
      description: 'Dòng phụ đề thương hiệu (VD: Kokoro Wellness Clinic).',
      type: 'string',
      group: 'brand',
      initialValue: 'Kokoro Wellness Clinic',
    }),
    defineField({
      name: 'motto',
      title: 'Phương Châm Hoạt Động',
      description: 'Triết lý điều trị cốt lõi hiển thị ở phần giới thiệu (VD: Từ Tâm – Khoa Học – Hiệu Quả).',
      type: 'string',
      group: 'brand',
      initialValue: 'Từ Tâm – Khoa Học – Hiệu Quả',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Số Điện Thoại Hiển Thị (Dễ Đọc)',
      description: 'Định dạng tách nhóm số rõ ràng để cô chú lớn tuổi dễ đọc (VD: 092 263 32 66).',
      type: 'string',
      group: 'brand',
      initialValue: '092 263 32 66',
      validation: (Rule) => Rule.required().error('Vui lòng nhập số điện thoại hiển thị.'),
    }),
    defineField({
      name: 'phoneRaw',
      title: 'Số Điện Thoại Gọi Nhanh (Viết Liền Không Dấu Cách)',
      description: 'Dãy số viết liền dùng cho nút bấm gọi trực tiếp trên điện thoại (VD: 0922633266).',
      type: 'string',
      group: 'brand',
      initialValue: '0922633266',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+?[0-9]{9,15}$/, {
            name: 'phone',
            invert: false,
          })
          .error('Chỉ nhập chữ số viết liền không khoảng trắng (VD: 0922633266).'),
    }),
    defineField({
      name: 'zaloUrl',
      title: 'Đường Dẫn Tư Vấn Zalo',
      description: 'Liên kết mở khung chat Zalo trực tiếp của phòng khám (VD: https://zalo.me/0922633266).',
      type: 'url',
      group: 'brand',
      initialValue: 'https://zalo.me/0922633266',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'email',
      title: 'Địa Chỉ Email Liên Hệ',
      description: 'Hộp thư điện tử chính thức tiếp nhận góp ý và hồ sơ bệnh nhân.',
      type: 'string',
      group: 'brand',
      initialValue: 'kokorowellnessclinic@gmail.com',
      validation: (Rule) => Rule.required().email().error('Vui lòng nhập định dạng email hợp lệ.'),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Trang Facebook Fanpage Chính Thức',
      description: 'Đường dẫn đến trang Fanpage Facebook của phòng khám.',
      type: 'url',
      group: 'brand',
      initialValue: 'https://www.facebook.com/p/Ph%C3%B2ng-Kh%C3%A1m-YHCT-Kokoro-61590124988186/',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),

    // --- 2. Location & Map ---
    defineField({
      name: 'streetAddress',
      title: 'Số Nhà & Tên Đường',
      description: 'Địa chỉ số nhà và đường (VD: Số 13, Đường số 15A).',
      type: 'string',
      group: 'location',
      initialValue: 'Số 13, Đường số 15A',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ward',
      title: 'Phường / Xã',
      description: 'Tên Phường theo địa giới hành chính (VD: Phường An Lạc).',
      type: 'string',
      group: 'location',
      initialValue: 'Phường An Lạc',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Tỉnh / Thành Phố',
      description: 'Tên Thành phố hoặc Tỉnh (VD: TP. Hồ Chí Minh).',
      type: 'string',
      group: 'location',
      initialValue: 'TP. Hồ Chí Minh',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Mã Bưu Chính (Postal Code)',
      description: 'Mã bưu chính khu vực phục vụ định vị Google Maps & SEO (VD: 71906 hoặc 700000).',
      type: 'string',
      group: 'location',
      initialValue: '71906',
    }),
    defineField({
      name: 'countryCode',
      title: 'Mã Quốc Gia (ISO)',
      description: 'Mặc định là VN (Việt Nam).',
      type: 'string',
      group: 'location',
      initialValue: 'VN',
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({
      name: 'landmarkNote',
      title: 'Chỉ Dẫn Đường Đi & Chỗ Đậu Xe',
      description: 'Ghi chú mốc nhận biết dễ tìm cho bệnh nhân đi taxi/ô tô (VD: Khu Tên Lửa, gần AEON Mall Bình Tân, có chỗ đậu ô tô).',
      type: 'text',
      rows: 3,
      group: 'location',
    }),
    defineField({
      name: 'latitude',
      title: 'Vĩ Độ Địa Lý (Latitude)',
      description: 'Tọa độ vĩ độ trên bản đồ Google Maps (VD: 10.7429).',
      type: 'number',
      group: 'location',
      initialValue: 10.7429,
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Kinh Độ Địa Lý (Longitude)',
      description: 'Tọa độ kinh độ trên bản đồ Google Maps (VD: 106.6122).',
      type: 'number',
      group: 'location',
      initialValue: 106.6122,
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: 'googleMapsDirectionsUrl',
      title: 'Liên Kết Chỉ Đường Google Maps',
      description: 'Đường dẫn mở ứng dụng Google Maps dẫn đường tận nơi khi bệnh nhân bấm nút "Chỉ Đường".',
      type: 'url',
      group: 'location',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Đường Dẫn Nhúng Bản Đồ (Google Maps Embed URL)',
      description: 'Đường dẫn iframe src từ Google Maps (có chứa output=embed hoặc google.com/maps/embed) để hiển thị khung bản đồ trên trang web.',
      type: 'url',
      group: 'location',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),

    // --- 3. Healthcare Compliance ---
    defineField({
      name: 'operatingLicenseNumber',
      title: 'Số Giấy Phép Hoạt Động YHCT',
      description: 'Số Giấy phép hoạt động khám bệnh, chữa bệnh do Sở Y Tế cấp (hiển thị minh bạch ở chân trang theo quy định y tế).',
      type: 'string',
      group: 'compliance',
      validation: (Rule) => Rule.required().error('Vui lòng nhập thông tin Giấy phép hoạt động YHCT.'),
    }),
    defineField({
      name: 'operatingLicenseIssuer',
      title: 'Cơ Quan Cấp Phép — VD: Sở Y Tế TP. Hồ Chí Minh',
      description: 'Tên cơ quan quản lý nhà nước cấp giấy phép hoạt động chuyên môn.',
      type: 'string',
      group: 'compliance',
      initialValue: 'Sở Y Tế Thành Phố Hồ Chí Minh',
      validation: (Rule) => Rule.required(),
    }),

    // --- 4. Operating Hours ---
    defineField({
      name: 'operatingHours',
      title: 'Khung Giờ Mở Cửa Khám Bệnh',
      description: 'Cập nhật lịch làm việc hàng tuần để hiển thị trên trang chủ và đồng bộ với Google tìm kiếm.',
      type: 'array',
      group: 'hours',
      validation: (Rule) => Rule.required().min(1).error('Vui lòng thêm ít nhất 1 khung giờ làm việc.'),
      of: [
        defineArrayMember({
          name: 'openingHourItem',
          title: 'Khung Giờ Làm Việc',
          type: 'object',
          fields: [
            defineField({
              name: 'daysLabel',
              title: 'Nhãn Ngày Làm Việc (Tiếng Việt)',
              description: 'VD: Thứ Hai – Chủ Nhật (Kể cả ngày lễ)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'schemaDays',
              title: 'Các Ngày Tương Ứng (Chuẩn Google Schema)',
              description: 'Chọn các thứ trong tuần áp dụng khung giờ này.',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              options: {
                list: DAYS_OF_WEEK_OPTIONS,
              },
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'opens',
              title: 'Giờ Mở Cửa (Định dạng 24h HH:mm)',
              description: 'VD: 08:00',
              type: 'string',
              initialValue: '08:00',
              validation: (Rule) =>
                Rule.required()
                  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
                  .error('Nhập đúng định dạng giờ 24h, ví dụ: 08:00'),
            }),
            defineField({
              name: 'closes',
              title: 'Giờ Đóng Cửa (Định dạng 24h HH:mm)',
              description: 'VD: 20:00',
              type: 'string',
              initialValue: '20:00',
              validation: (Rule) =>
                Rule.required()
                  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
                  .error('Nhập đúng định dạng giờ 24h, ví dụ: 20:00'),
            }),
          ],
          preview: {
            select: {
              title: 'daysLabel',
              opens: 'opens',
              closes: 'closes',
            },
            prepare({ title, opens, closes }) {
              return {
                title: title || 'Lịch làm việc',
                subtitle: `${opens || '08:00'} – ${closes || '20:00'}`,
              };
            },
          },
        }),
      ],
    }),

    // --- 5. SEO Meta Defaults ---
    defineField({
      name: 'seoTitle',
      title: 'Tiêu Đề Trang Chủ Trên Google (SEO Title)',
      description: 'Tiêu đề hiển thị trên kết quả tìm kiếm Google và khi chia sẻ qua Zalo/Facebook (nên dài 50–65 ký tự).',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Mô Tả Tóm Tắt Trên Google (SEO Description)',
      description: 'Đoạn giới thiệu ngắn thu hút bệnh nhân trên Google (nên dài 120–165 ký tự, có kèm địa chỉ và số điện thoại).',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.required().max(260),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Bộ Từ Khóa Tìm Kiếm Địa Phương (SEO Keywords)',
      description: 'Nhấn Enter sau mỗi cụm từ khóa (VD: phòng khám y học cổ truyền bình tân, châm cứu bấm huyệt an lạc...).',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'clinicName',
      subtitle: 'phoneDisplay',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Cài Đặt Phòng Khám & Pháp Lý',
        subtitle: subtitle ? `Hotline/Zalo: ${subtitle}` : 'Cấu hình chung toàn trang',
      };
    },
  },
});
