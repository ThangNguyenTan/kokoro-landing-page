import { defineArrayMember, defineField, defineType } from 'sanity';

export const doctor = defineType({
  name: 'doctors',
  title: 'Đội Ngũ Bác Sĩ & Lương Y',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Họ và Tên Bác Sĩ / Y Sĩ',
      description: 'Họ tên đầy đủ của bác sĩ điều trị (VD: BS.CKI Nguyễn Minh Tâm).',
      type: 'string',
      validation: (Rule) => Rule.required().error('Vui lòng nhập họ và tên bác sĩ.'),
    }),
    defineField({
      name: 'title',
      title: 'Chức Danh Chuyên Môn Tại Phòng Khám',
      description: 'Vai trò phụ trách tại Kokoro (VD: Bác Sĩ Phụ Trách Chuyên Môn Kỹ Thuật).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Học Vị / Bằng Cấp Y Khoa',
      description: 'Bằng cấp đào tạo chính quy (VD: Bác sĩ Chuyên khoa I Y Học Cổ Truyền).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialty',
      title: 'Chuyên Khoa Mũi Nhọn',
      description: 'Lĩnh vực điều trị chuyên sâu (VD: Cơ xương khớp, Thần kinh cột sống & Nội khoa Đông y).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'licenseNumber',
      title: 'Số Chứng Chỉ Hành Nghề Y',
      description: 'Số Chứng chỉ hành nghề khám bệnh, chữa bệnh do Sở Y Tế / Bộ Y Tế cấp (tăng độ tin cậy pháp lý cho bệnh nhân).',
      type: 'string',
      validation: (Rule) => Rule.required().error('Vui lòng nhập thông tin Số Chứng Chỉ Hành Nghề Y.'),
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Số Năm Kinh Nghiệm Lâm Sàng',
      description: 'Tổng số năm trực tiếp khám và điều trị Y Học Cổ Truyền (VD: 15).',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.required().integer().min(1).max(60),
    }),
    defineField({
      name: 'bio',
      title: 'Tiểu Sử & Phong Cách Điều Trị',
      description: 'Đoạn giới thiệu ngắn (2–4 câu) về quá trình công tác và sự tận tâm với người bệnh.',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(30),
    }),
    defineField({
      name: 'highlights',
      title: 'Thế Mạnh Chuyên Môn & Quá Trình Đào Tạo',
      description: 'Các điểm nổi bật về chứng chỉ chuyên sâu, đơn vị từng công tác hoặc phương pháp sở trường (2–5 ý).',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(2).max(6),
    }),
    defineField({
      name: 'photo',
      title: 'Ảnh Chân Dung Bác Sĩ',
      description: 'Ảnh chân dung mặc áo blouse trắng lịch sự, rõ mặt, tạo cảm giác gần gũi và tin cậy.',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Mô Tả Ảnh Chân Dung (Alt Text)',
          description: 'VD: Chân dung Bác sĩ Chuyên khoa I Y Học Cổ Truyền tại Phòng khám Kokoro',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'Thứ Tự Hiển Thị (Số Nhỏ Đứng Trước)',
      description: 'Nhập 1 cho Bác sĩ phụ trách chuyên môn chính, tiếp theo là 2, 3...',
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
      name: 'name',
      title: 'title',
      years: 'yearsOfExperience',
      rank: 'orderRank',
      media: 'photo',
    },
    prepare({ name, title, years, rank, media }) {
      const prefix = rank ? `${rank}. ` : '';
      const expLabel = years ? ` • ${years} năm kinh nghiệm` : '';
      return {
        title: `${prefix}${name || 'Bác sĩ YHCT'}`,
        subtitle: `${title || 'Chuyên khoa YHCT'}${expLabel}`,
        media,
      };
    },
  },
});
