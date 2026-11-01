import { defineArrayMember, defineField, defineType } from 'sanity';

const SERVICE_ICON_OPTIONS = [
  { title: 'Châm Cứu & Điện Châm (acupuncture)', value: 'acupuncture' },
  { title: 'Xoa Bóp Bấm Huyệt & Cột Sống (acupressure)', value: 'acupressure' },
  { title: 'Giác Hơi & Cứu Ngải (cupping)', value: 'cupping' },
  { title: 'Thuốc Thang & Dược Liệu Đông Y (herbal)', value: 'herbal' },
  { title: 'Phục Hồi Chức Năng Vận Động (rehab)', value: 'rehab' },
  { title: 'An Thần, Trị Mất Ngủ & Tiền Đình (sleep)', value: 'sleep' },
];

export const service = defineType({
  name: 'services',
  title: 'Dịch Vụ Y Học Cổ Truyền',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tên Dịch Vụ / Liệu Pháp Điều Trị',
      description: 'Tên phương pháp điều trị rõ ràng, dễ hiểu cho bệnh nhân (VD: Châm Cứu & Điện Châm Giảm Đau Chuyên Sâu).',
      type: 'string',
      validation: (Rule) => Rule.required().error('Vui lòng nhập tên dịch vụ điều trị.'),
    }),
    defineField({
      name: 'slug',
      title: 'Đường Dẫn Tĩnh (Slug)',
      description: 'Bấm nút "Generate" để tự động tạo mã đường dẫn từ tên dịch vụ.',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Vui lòng bấm Generate để tạo đường dẫn tĩnh (slug).'),
    }),
    defineField({
      name: 'categoryBadge',
      title: 'Nhãn Chuyên Khoa Ngắn',
      description: 'Nhãn phân loại hiển thị phía trên thẻ dịch vụ (VD: Giảm Đau & Thần Kinh, Cơ Xương Khớp, Dược Liệu Đông Y).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Mô Tả Ngắn Gọn Dễ Hiểu',
      description: 'Giải thích cơ chế và giá trị cốt lõi của liệu pháp bằng ngôn ngữ ấm áp, chuẩn y khoa (2–3 câu).',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(30).error('Vui lòng nhập mô tả ngắn gọn cho dịch vụ.'),
    }),
    defineField({
      name: 'benefits',
      title: 'Hiệu Quả & Triệu Chứng Đáp Ứng Tốt',
      description: 'Danh sách các công dụng hoặc chứng bệnh đáp ứng tốt với phương pháp này (3–5 ý ngắn gọn).',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(2).max(6).error('Vui lòng liệt kê từ 2 đến 6 lợi ích điều trị.'),
    }),
    defineField({
      name: 'durationNote',
      title: 'Thời Lượng Buổi Điều Trị',
      description: 'Thời gian trung bình mỗi lần thực hiện để bệnh nhân chủ động sắp xếp (VD: 30 – 45 phút / buổi).',
      type: 'string',
      initialValue: '45 – 60 phút / buổi',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetAudience',
      title: 'Đối Tượng Bệnh Nhân Phù Hợp',
      description: 'Mô tả nhóm người bệnh nên áp dụng liệu pháp này (VD: Cô chú lớn tuổi thoái hóa khớp, nhân viên văn phòng đau mỏi vai gáy...).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconName',
      title: 'Biểu Tượng Minh Họa (Icon)',
      description: 'Chọn biểu tượng y học cổ truyền hiển thị trên thẻ dịch vụ.',
      type: 'string',
      initialValue: 'acupuncture',
      options: {
        list: SERVICE_ICON_OPTIONS,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Hình Ảnh Thực Tế Tại Phòng Khám (Tùy Chọn)',
      description: 'Ảnh chụp kỹ thuật điều trị tại Kokoro (ưu tiên ảnh ngang rõ nét, ánh sáng ấm áp).',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Mô Tả Ảnh Cho Người Khiếm Thị & Google (Alt Text)',
          description: 'VD: Bác sĩ thực hiện châm cứu giảm đau lưng tại Phòng Khám YHCT Kokoro',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Tiêu Đề SEO Riêng (Tùy Chọn)',
      description: 'Để trống nếu muốn dùng tự động theo tên dịch vụ.',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Mô Tả SEO Riêng (Tùy Chọn)',
      description: 'Mô tả tối ưu tìm kiếm riêng cho dịch vụ này.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'orderRank',
      title: 'Thứ Tự Hiển Thị (Số Nhỏ Đứng Trước)',
      description: 'Nhập số 1, 2, 3... để sắp xếp thứ tự ưu tiên xuất hiện trên trang chủ.',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Thứ tự ưu tiên (Tăng dần)',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'categoryBadge',
      rank: 'orderRank',
      media: 'image',
    },
    prepare({ title, category, rank, media }) {
      return {
        title: rank ? `${rank}. ${title}` : title,
        subtitle: category || 'Dịch vụ Y Học Cổ Truyền',
        media,
      };
    },
  },
});
