import { defineField, defineType } from 'sanity';

const FAQ_CATEGORY_OPTIONS = [
  { title: 'An Toàn Điều Trị', value: 'An Toàn Điều Trị' },
  { title: 'Chi Phí & Quy Trình', value: 'Chi Phí & Quy Trình' },
  { title: 'Chuẩn Bị Khám', value: 'Chuẩn Bị Khám' },
  { title: 'Giờ Làm Việc & Đi Lại', value: 'Giờ Làm Việc & Đi Lại' },
];

export const faq = defineType({
  name: 'faqs',
  title: 'Câu Hỏi Thường Gặp (FAQ)',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Câu Hỏi Của Bệnh Nhân / Người Nhà',
      description:
        'Câu hỏi thường gặp trước khi đến khám (VD: Châm cứu tại Phòng khám Kokoro có đau không, kim châm có đảm bảo vô khuẩn không?).',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(10).error('Vui lòng nhập nội dung câu hỏi.'),
    }),
    defineField({
      name: 'answer',
      title: 'Câu Trả Lời Giải Đáp Chi Tiết',
      description:
        'Giải đáp rõ ràng, ấm áp, chuẩn y khoa để cô chú lớn tuổi và con cháu yên tâm chuẩn bị trước khi đến khám.',
      type: 'text',
      rows: 4,
      validation: (Rule) =>
        Rule.required().min(30).error('Vui lòng nhập câu trả lời giải đáp chi tiết.'),
    }),
    defineField({
      name: 'category',
      title: 'Nhóm Chủ Đề Hướng Dẫn',
      description: 'Chọn nhóm chủ đề hiển thị phía trên câu hỏi.',
      type: 'string',
      initialValue: 'Chi Phí & Quy Trình',
      options: {
        list: FAQ_CATEGORY_OPTIONS,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderRank',
      title: 'Thứ Tự Hiển Thị (Số Nhỏ Đứng Trước)',
      description: 'Nhập 1, 2, 3... để sắp xếp thứ tự câu hỏi trên trang chủ.',
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
      question: 'question',
      category: 'category',
      rank: 'orderRank',
    },
    prepare({ question, category, rank }) {
      const prefix = rank ? `${rank}. ` : '';
      return {
        title: `${prefix}${question || 'Câu hỏi thường gặp'}`,
        subtitle: category || 'Hướng dẫn trước khi khám',
      };
    },
  },
});
