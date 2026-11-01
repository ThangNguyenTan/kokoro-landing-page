import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonials',
  title: 'Cảm Nhận Bệnh Nhân',
  type: 'document',
  fields: [
    defineField({
      name: 'patientName',
      title: 'Tên Hiển Thị Của Bệnh Nhân / Người Nhà',
      description: 'Nên viết lịch sự kèm danh xưng Cô/Chú/Bác/Anh/Chị và viết tắt tên đệm/tên nếu cần bảo mật (VD: Cô Nguyễn Thị Minh H.).',
      type: 'string',
      validation: (Rule) => Rule.required().error('Vui lòng nhập tên hiển thị của bệnh nhân.'),
    }),
    defineField({
      name: 'patientAge',
      title: 'Độ Tuổi Bệnh Nhân',
      description: 'Tuổi của người bệnh để cô chú đồng niên dễ đồng cảm (VD: 64).',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(18).max(105),
    }),
    defineField({
      name: 'location',
      title: 'Khu Vực Sinh Sống',
      description: 'Phường / Khu dân cư / Quận lân cận nơi bệnh nhân cư ngụ (VD: Khu Tên Lửa, P. An Lạc).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'conditionTreated',
      title: 'Tình Trạng Sức Khỏe Đã Điều Trị',
      description: 'Vấn đề sức khỏe hoặc chứng bệnh đã cải thiện tại phòng khám (VD: Đau thần kinh tọa & thoái hóa cột sống thắt lưng).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Lời Chia Sẻ Thực Tế',
      description: 'Chia sẻ chân thực, mộc mạc của bệnh nhân hoặc con cháu đưa bố mẹ đi khám (không phóng đại quá mức quy định y tế).',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(30).max(550),
    }),
    defineField({
      name: 'rating',
      title: 'Mức Độ Hài Lòng (1 – 5 Sao)',
      description: 'Điểm đánh giá từ 1 đến 5 sao (mặc định là 5 sao).',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'treatmentDuration',
      title: 'Thời Gian / Liệu Trình Theo Điều Trị',
      description: 'VD: Sau 2 liệu trình (10 buổi châm cứu & bấm huyệt).',
      type: 'string',
    }),
    defineField({
      name: 'orderRank',
      title: 'Thứ Tự Hiển Thị (Số Nhỏ Đứng Trước)',
      description: 'Nhập 1, 2, 3... để sắp xếp thứ tự hiển thị câu chuyện trên trang chủ.',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Thứ tự hiển thị (Tăng dần)',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      name: 'patientName',
      age: 'patientAge',
      condition: 'conditionTreated',
      location: 'location',
      rank: 'orderRank',
    },
    prepare({ name, age, condition, location, rank }) {
      const prefix = rank ? `${rank}. ` : '';
      const ageLabel = age ? ` (${age} tuổi)` : '';
      return {
        title: `${prefix}${name || 'Bệnh nhân'}${ageLabel}`,
        subtitle: [condition, location].filter(Boolean).join(' • '),
      };
    },
  },
});
