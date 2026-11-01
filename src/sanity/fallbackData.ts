import type {
  ClinicDoctor,
  ClinicFaq,
  ClinicPageData,
  ClinicService,
  ClinicSettings,
  ClinicTestimonial,
} from '@/types/clinic';

export const FALLBACK_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: 'Phòng Khám Y Học Cổ Truyền Kokoro',
  legalName: 'Phòng Khám Chuyên Khoa Y Học Cổ Truyền Kokoro',
  subtitle: 'Kokoro Wellness Clinic',
  motto: 'Từ Tâm – Khoa Học – Hiệu Quả',
  phoneDisplay: '092 263 32 66',
  phoneRaw: '0922633266',
  zaloUrl: 'https://zalo.me/0922633266',
  email: 'kokorowellnessclinic@gmail.com',
  facebookUrl:
    'https://www.facebook.com/p/Ph%C3%B2ng-Kh%C3%A1m-YHCT-Kokoro-61590124988186/',
  streetAddress: 'Số 13, Đường số 15A',
  ward: 'Phường An Lạc',
  city: 'TP. Hồ Chí Minh',
  postalCode: '71906',
  countryCode: 'VN',
  landmarkNote:
    'Khu dân cư Tên Lửa (Bình Tân), cách AEON Mall Bình Tân khoảng 100m — đường nội khu rộng rãi, có chỗ đậu xe hơi ngay trước cửa phòng khám.',
  latitude: 10.744845,
  longitude: 106.614035,
  googleMapsDirectionsUrl: 'https://maps.app.goo.gl/Zq3JYiJnn3aKJgrP8',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=Ph%C3%B2ng+kh%C3%A1m+Y+h%E1%BB%8Dc+c%E1%BB%95+truy%E1%BB%81n+Kokoro&t=&z=17&ie=UTF8&iwloc=&output=embed',
  operatingLicenseNumber:
    'Chuyên khoa YHCT – Sở Y Tế TP.HCM cấp phép (Cập nhật số GPHĐ tại /admin)',
  operatingLicenseIssuer: 'Sở Y Tế Thành Phố Hồ Chí Minh',
  operatingHours: [
    {
      daysLabel: 'Thứ Hai – Chủ Nhật (Kể cả ngày lễ)',
      schemaDays: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  seoTitle:
    'Phòng Khám Y Học Cổ Truyền Kokoro | Khám Đông Y, Châm Cứu & Bấm Huyệt Phường An Lạc, Bình Tân',
  seoDescription:
    'Phòng Khám Y Học Cổ Truyền Kokoro (Số 13 Đường số 15A, P. An Lạc, Khu Tên Lửa, TP.HCM). Bác sĩ chuyên khoa YHCT trực tiếp thăm khám, châm cứu, bấm huyệt, thuốc thang Đông y điều trị cơ xương khớp, mất ngủ, thần kinh tọa. Đặt lịch: 092 263 32 66.',
  seoKeywords: [
    'phòng khám y học cổ truyền',
    'phòng khám yhct bình tân',
    'phòng khám đông y phường an lạc',
    'châm cứu bấm huyệt an lạc tên lửa',
    'điều trị đông y tp hcm',
    'phòng khám kokoro',
    'kokoro wellness clinic',
    'châm cứu đau thần kinh tọa bình tân',
    'trị đau cổ vai gáy khu tên lửa',
    'khám đông y gần aeon bình tân',
    'điều trị mất ngủ bằng đông y',
    'phục hồi chức năng người cao tuổi tphcm',
  ],
};

export const FALLBACK_SERVICES: ClinicService[] = [
  {
    _id: 'service-cham-cuu-dien-cham',
    title: 'Châm Cứu & Điện Châm Giảm Đau Chuyên Sâu',
    slug: 'cham-cuu-dien-cham-giam-dau-chuyen-sau',
    categoryBadge: 'Giảm Đau & Thần Kinh',
    shortDescription:
      'Ứng dụng kim châm vô trùng dùng một lần kết hợp xung điện tần số sinh học chuẩn y khoa, tác động chính xác vào hệ thống huyệt vị giúp giải phóng chèn ép rễ thần kinh, hành khí hoạt huyết và giảm đau tự nhiên an toàn.',
    benefits: [
      'Hỗ trợ giảm đau thần kinh tọa, thoát vị đĩa đệm và gai cột sống thắt lưng',
      'Cải thiện tê bì tay chân, hội chứng ống cổ tay và liệt dây thần kinh VII ngoại biên',
      'Giảm co cứng cơ sâu, điều hòa dẫn truyền thần kinh mà không lạm dụng thuốc giảm đau',
      'Quy trình kiểm soát nhiễm khuẩn nghiêm ngặt, thao tác nhẹ nhàng cho người lớn tuổi',
    ],
    durationNote: '30 – 45 phút / buổi',
    targetAudience:
      'Người bệnh đau nhức thần kinh – cột sống cấp và mạn tính, tê bì tứ chi hoặc phục hồi sau tai biến.',
    iconName: 'acupuncture',
    seoTitle: 'Châm Cứu & Điện Châm Giảm Đau Tại Bình Tân | Phòng Khám YHCT Kokoro',
    seoDescription:
      'Liệu pháp châm cứu và điện châm vô trùng chuẩn Sở Y Tế tại Phường An Lạc, giúp giảm đau thần kinh tọa, tê bì chân tay an toàn.',
  },
  {
    _id: 'service-xoa-bop-bam-huyet-cot-song',
    title: 'Xoa Bóp Bấm Huyệt Trị Liệu Cổ Vai Gáy & Cột Sống',
    slug: 'xoa-bop-bam-huyet-tri-lieu-co-vai-gay-cot-song',
    categoryBadge: 'Cơ Xương Khớp',
    shortDescription:
      'Thủ thuật day, ấn, bấm huyệt và giải cơ chuyên sâu theo giải phẫu học kết hợp đường kinh lạc Đông y, giúp làm mềm các dải cơ co thắt, tăng cường tuần hoàn máu lên não và khôi phục biên độ vận động khớp.',
    benefits: [
      'Giải tỏa nhanh tình trạng căng cứng cổ vai gáy, đau đầu do thiếu máu não cục bộ',
      'Hỗ trợ điều trị thoái hóa đốt sống cổ, thoái hóa khớp gối và viêm quanh khớp vai',
      'Giảm đau mỏi lưng dưới ở người ngồi lâu hoặc cô chú lớn tuổi đi lại khó khăn',
      'Lực tay được bác sĩ và kỹ thuật viên điều chỉnh vừa vặn theo thể trạng từng người bệnh',
    ],
    durationNote: '45 – 60 phút / buổi',
    targetAudience:
      'Cô chú trung niên, cao tuổi bị thoái hóa xương khớp và người làm việc văn phòng đau mỏi cổ vai gáy.',
    iconName: 'acupressure',
    seoTitle: 'Xoa Bóp Bấm Huyệt Cổ Vai Gáy & Cột Sống | Phòng Khám YHCT Kokoro',
    seoDescription:
      'Trị liệu xoa bóp bấm huyệt y học cổ truyền chuyên sâu vùng cổ vai gáy, cột sống lưng và khớp gối tại Khu Tên Lửa, Bình Tân.',
  },
  {
    _id: 'service-giac-hoi-cuu-ngai-on-thong',
    title: 'Giác Hơi & Cứu Ngải Ôn Thông Kinh Lạc',
    slug: 'giac-hoi-cuu-ngai-on-thong-kinh-lac',
    categoryBadge: 'Khu Phong Tán Hàn',
    shortDescription:
      'Kết hợp nhiệt ấm tự nhiên từ điếu ngải nhung lâu năm cùng kỹ thuật giác hơi kiểm soát áp suất chuẩn xác, giúp khu phong tán hàn, trừ thấp, làm ấm tạng phủ và đẩy lùi các chứng đau nhức tăng nặng khi trời lạnh.',
    benefits: [
      'Làm ấm kinh mạch, giảm rõ rệt chứng đau nhức xương khớp khi thay đổi thời tiết',
      'Hỗ trợ giải cảm phong hàn, giảm lạnh bàn tay bàn chân và đau bụng do hàn thấp',
      'Thúc đẩy tuần hoàn vi mạch dưới da, giải phóng ứ trệ khí huyết vùng lưng – vai',
      'Sử dụng ngải cứu sạch ít khói, mang lại cảm giác thư thái, ấm áp dễ chịu',
    ],
    durationNote: '30 – 40 phút / buổi',
    targetAudience:
      'Người có cơ địa hàn lạnh, hay đau mỏi mình mẩy khi trở trời, suy giảm sức đề kháng hoặc nhiễm phong hàn.',
    iconName: 'cupping',
    seoTitle: 'Giác Hơi & Cứu Ngải Ôn Thông Kinh Lạc | Phòng Khám YHCT Kokoro',
    seoDescription:
      'Phương pháp cứu ngải và giác hơi Đông y chuẩn y khoa giúp khu phong tán hàn, giảm đau nhức xương khớp do lạnh tại TP.HCM.',
  },
  {
    _id: 'service-thuoc-thang-duoc-lieu-dong-y',
    title: 'Thuốc Thang & Dược Liệu Đông Y Cá Nhân Hóa',
    slug: 'thuoc-thang-duoc-lieu-dong-y-ca-nhan-hoa',
    categoryBadge: 'Nội Khoa Đông Y',
    shortDescription:
      'Bác sĩ bắt mạch, tứ chẩn kỹ lưỡng để kê đơn thuốc thang gia giảm riêng biệt theo đúng thể bệnh và cơ địa từng người. Nguồn dược liệu sạch có xuất xứ rõ ràng, bào chế đúng chuẩn cổ truyền, không chất bảo quản.',
    benefits: [
      'Bồi bổ can thận, mạnh gân cốt từ gốc, ngăn ngừa tái phát đau nhức mạn tính',
      'Điều hòa khí huyết, kiện tỳ vị, cải thiện ăn uống kém và suy nhược cơ thể',
      'Hỗ trợ ổn định nội tiết, thanh nhiệt giải độc gan và nâng cao thể trạng người lớn tuổi',
      'Hỗ trợ sắc thuốc đóng túi chân không tiện lợi cho bệnh nhân bận rộn hoặc ngại sắc thuốc',
    ],
    durationNote: 'Khám mạch & kê đơn 20 – 30 phút',
    targetAudience:
      'Bệnh nhân cần điều trị chuyên sâu từ căn nguyên tạng phủ, bồi bổ sức khỏe lâu dài và an toàn cho dạ dày.',
    iconName: 'herbal',
    seoTitle: 'Bắt Mạch Kê Đơn Thuốc Thang Đông Y Sạch | Phòng Khám YHCT Kokoro',
    seoDescription:
      'Khám tứ chẩn bắt mạch và bốc thuốc thang Đông y cá nhân hóa từ dược liệu sạch đạt chuẩn tại Phòng Khám YHCT Kokoro.',
  },
  {
    _id: 'service-dieu-tri-mat-ngu-tien-dinh',
    title: 'Điều Trị Mất Ngủ, Rối Loạn Tiền Đình & Dưỡng Tâm',
    slug: 'dieu-tri-mat-ngu-roi-loan-tien-dinh-duong-tam',
    categoryBadge: 'Thần Kinh & Giấc Ngủ',
    shortDescription:
      'Phác đồ phối hợp bấm huyệt vùng đầu – mặt – cổ, châm cứu an thần và thảo dược dưỡng tâm định chí, giúp điều hòa hệ thần kinh thực vật, cải thiện tuần hoàn máu não và khôi phục giấc ngủ sinh lý tự nhiên.',
    benefits: [
      'Giúp dễ đi vào giấc ngủ, ngủ sâu giấc hơn, thức dậy tỉnh táo không mệt mỏi uể oải',
      'Giảm hoa mắt, chóng mặt, ù tai, đau nửa đầu do thiểu năng tuần hoàn não và tiền đình',
      'Làm dịu căng thẳng thần kinh, hồi hộp đánh trống ngực ở người trung niên và cao tuổi',
      'Hướng tới giấc ngủ tự nhiên bền vững, hạn chế sự phụ thuộc vào thuốc an thần Tây y',
    ],
    durationNote: '45 – 60 phút / buổi',
    targetAudience:
      'Cô chú mất ngủ kinh niên, ngủ chập chờn hay thức giấc nửa đêm, người bị rối loạn tiền đình và căng thẳng kéo dài.',
    iconName: 'sleep',
    seoTitle: 'Điều Trị Mất Ngủ & Rối Loạn Tiền Đình Bằng Đông Y | Kokoro',
    seoDescription:
      'Chữa mất ngủ mạn tính, thiếu máu não và rối loạn tiền đình không phụ thuộc thuốc ngủ tại Phòng Khám YHCT Kokoro Bình Tân.',
  },
  {
    _id: 'service-phuc-hoi-chuc-nang-nguoi-cao-tuoi',
    title: 'Phục Hồi Chức Năng Vận Động Người Cao Tuổi',
    slug: 'phuc-hoi-chuc-nang-van-dong-nguoi-cao-tuoi',
    categoryBadge: 'Phục Hồi Vận Động',
    shortDescription:
      'Chương trình trị liệu kết hợp tinh hoa Y Học Cổ Truyền và bài tập vận động trị liệu có trợ giúp 1 kèm 1, đồng hành kiên nhẫn cùng các bậc cao niên trong quá trình lấy lại sức cơ, sự dẻo dai và khả năng tự chủ sinh hoạt.',
    benefits: [
      'Hỗ trợ phục hồi vận động sau tai biến mạch máu não (đột quỵ) giai đoạn ổn định',
      'Tăng cường sức mạnh cơ – khớp chân tay, cải thiện thăng bằng giúp phòng ngừa té ngã',
      'Hạn chế cứng khớp, teo cơ ở người cao tuổi ít vận động hoặc sau phẫu thuật chấn thương',
      'Hướng dẫn bài tập dưỡng sinh nhẹ nhàng để bệnh nhân và người nhà duy trì tại gia',
    ],
    durationNote: '60 phút / buổi (1 kèm 1)',
    targetAudience:
      'Người cao tuổi suy giảm vận động, cứng khớp gối – khớp háng, hoặc đang phục hồi di chứng sau tai biến.',
    iconName: 'rehab',
    seoTitle: 'Phục Hồi Chức Năng Vận Động Người Cao Tuổi | Phòng Khám YHCT Kokoro',
    seoDescription:
      'Phục hồi chức năng vận động 1 kèm 1 kết hợp châm cứu, bấm huyệt cho người cao tuổi và sau tai biến tại Phường An Lạc, TP.HCM.',
  },
];

export const FALLBACK_DOCTORS: ClinicDoctor[] = [
  {
    _id: 'doctor-bs-cki-phu-trach-chuyen-mon',
    name: 'BS.CKI Trần Minh Hòa',
    title: 'Bác Sĩ Phụ Trách Chuyên Môn Kỹ Thuật',
    degree: 'Bác sĩ Chuyên khoa I Y Học Cổ Truyền',
    specialty: 'Bệnh lý Cơ Xương Khớp, Thần Kinh Cột Sống & Nội Khoa Đông Y',
    licenseNumber: 'Bác sĩ Chuyên khoa YHCT – Sở Y Tế cấp (Cập nhật mã số tại /admin)',
    yearsOfExperience: 18,
    bio: 'Với gần hai thập kỷ gắn bó cùng nền Y Học Cổ Truyền kết hợp Y Học Hiện Đại, bác sĩ luôn tâm niệm mỗi người bệnh là một thể trạng riêng biệt cần được lắng nghe thấu đáo. Bác sĩ trực tiếp chẩn đoán, bắt mạch và lập phác đồ điều trị cụ thể theo từng giai đoạn.',
    highlights: [
      'Tốt nghiệp Chuyên khoa I Y Học Cổ Truyền, đào tạo bài bản về kết hợp Đông – Tây y',
      '18 năm kinh nghiệm lâm sàng điều trị thoát vị đĩa đệm, đau thần kinh tọa và thoái hóa đa khớp',
      'Chuyên sâu bắt mạch kê đơn thuốc thang cá nhân hóa cho bệnh lý mạn tính người cao tuổi',
      'Phong cách thăm khám điềm đạm, giải thích cặn kẽ dễ hiểu cho bệnh nhân và gia đình',
    ],
    photoUrl: '/images/doctors/dr-tran-minh-hoa.webp',
  },
  {
    _id: 'doctor-bs-cham-cuu-phuc-hoi',
    name: 'BS. Nguyễn Thanh Thảo',
    title: 'Bác Sĩ Điều Trị Châm Cứu & Phục Hồi Chức Năng',
    degree: 'Bác sĩ Y Học Cổ Truyền',
    specialty: 'Châm Cứu Giảm Đau, Điều Trị Mất Ngủ & Phục Hồi Vận Động',
    licenseNumber: 'Bác sĩ Chuyên khoa YHCT – Sở Y Tế cấp (Cập nhật mã số tại /admin)',
    yearsOfExperience: 11,
    bio: 'Tận tâm và nhẹ nhàng trong từng thủ thuật châm cứu – dưỡng sinh, bác sĩ đặc biệt mát tay trong việc chăm sóc các cô chú lớn tuổi sợ đau hoặc mất ngủ lâu năm, điều chỉnh lực tác động êm ái đạt hiệu quả thư giãn tối ưu.',
    highlights: [
      'Chứng chỉ chuyên sâu về Điện châm, Cứu ngải và Phục hồi chức năng vận động sau tai biến',
      '11 năm kinh nghiệm điều trị hội chứng cổ vai gáy, rối loạn tiền đình và mất ngủ mạn tính',
      'Thao tác châm kim chuẩn xác, êm nhẹ, tạo tâm lý thoải mái cho người bệnh lớn tuổi',
      'Tư vấn chế độ dinh dưỡng thực dưỡng và bài tập dưỡng sinh tại nhà dễ thực hiện',
    ],
    photoUrl: '/images/doctors/dr-nguyen-thanh-thao.webp',
  },
  {
    _id: 'doctor-ys-yhct-duoc-lieu-tri-lieu',
    name: 'Lương Y Lê Quốc Bảo',
    title: 'Chuyên Viên Trị Liệu Xoa Bóp Bấm Huyệt & Dược Liệu',
    degree: 'Y sĩ Y Học Cổ Truyền • Chứng chỉ Xoa bóp bấm huyệt Y khoa',
    specialty: 'Xoa Bóp Bấm Huyệt Trị Liệu Cột Sống & Dược Liệu Đông Y',
    licenseNumber: 'Bác sĩ Y Học Cổ Truyền – Sở Y Tế cấp (Cập nhật mã số tại /admin)',
    yearsOfExperience: 14,
    bio: 'Am hiểu sâu sắc hệ thống kinh cân – huyệt vị cùng quy trình bào chế dược liệu truyền thống, thầy thuốc Lê Quốc Bảo trực tiếp thực hiện các kỹ thuật xoa bóp bấm huyệt giải cơ chuyên sâu và giám sát chất lượng từng thang thuốc sạch.',
    highlights: [
      '14 năm kinh nghiệm thực hành xoa bóp bấm huyệt trị liệu đau lưng, cứng khớp gối và vai gáy',
      'Phụ trách kiểm định nguồn gốc, độ tinh khiết và quy trình bảo quản dược liệu Đông y tại Kokoro',
      'Phối hợp chặt chẽ cùng Bác sĩ chuyên khoa trong các ca phục hồi vận động 1 kèm 1',
    ],
    photoUrl: '/images/doctors/dr-le-quoc-bao.webp',
  },
];

export const FALLBACK_TESTIMONIALS: ClinicTestimonial[] = [
  {
    _id: 'testimonial-co-lan-an-lac',
    patientName: 'Cô Nguyễn Thị Ngọc L.',
    patientAge: 66,
    location: 'Phường An Lạc, Bình Tân',
    conditionTreated: 'Đau thần kinh tọa & thoái hóa cột sống thắt lưng',
    quote:
      'Trước khi qua Kokoro cô đau lưng lan xuống chân trái, đứng nấu cơm chừng 15 phút là tê buốt phải ngồi nghỉ. Bác sĩ khám kỹ, nói rõ tình trạng chứ không hứa hẹn quá lời, châm cứu rất êm. Hết liệu trình thứ hai cô đã đi bộ tập thể dục buổi sáng quanh khu Tên Lửa nhẹ nhàng hơn hẳn.',
    rating: 5,
    treatmentDuration: 'Sau 2 liệu trình (12 buổi điện châm & bấm huyệt)',
    photoUrl: '/images/patients/patient-co-lan.webp',
  },
  {
    _id: 'testimonial-chu-hung-khu-ten-lua',
    patientName: 'Chú Trần Văn H.',
    patientAge: 71,
    location: 'Khu dân cư Tên Lửa, Bình Tân',
    conditionTreated: 'Mất ngủ mạn tính & rối loạn tiền đình',
    quote:
      'Chú bị khó ngủ hơn 4 năm nay, đêm thức giấc 3–4 lần làm sáng dậy đầu óc quay cuồng. Qua phòng khám Kokoro ấn tượng nhất là không gian yên tĩnh, sạch sẽ thơm mùi thảo dược nhẹ chứ không ồn ào. Uống thuốc thang kết hợp bấm huyệt đầu cổ được 3 tuần thì giấc ngủ sâu hơn nhiều, tinh thần khoan khoái hẳn.',
    rating: 5,
    treatmentDuration: 'Sau 3 tuần dùng thuốc thang & bấm huyệt dưỡng tâm',
    photoUrl: '/images/patients/patient-chu-hung.webp',
  },
  {
    _id: 'testimonial-chi-mai-dua-me-di-kham',
    patientName: 'Chị Lê Hoàng M. (đưa mẹ đi khám)',
    patientAge: 42,
    location: 'Quận 6, TP. Hồ Chí Minh',
    conditionTreated: 'Thoái hóa khớp gối hai bên ở người cao tuổi (Mẹ 74 tuổi)',
    quote:
      'Mình tìm chỗ khám Đông y uy tín gần AEON Bình Tân để tiện lái xe chở mẹ 74 tuổi đi trị khớp gối. Đường trước cửa phòng khám rộng rãi đậu xe hơi rất tiện cho cụ bước xuống. Các bác sĩ và kỹ thuật viên nói chuyện lễ phép, ân cần đỡ mẹ từng bước, cứu ngải ấm nên mẹ mình rất thích và chịu khó đi đều đặn.',
    rating: 5,
    treatmentDuration: 'Sau 10 buổi cứu ngải & trị liệu vận động khớp gối',
    photoUrl: '/images/patients/patient-chi-mai.webp',
  },
  {
    _id: 'testimonial-anh-tuan-tan-phu',
    patientName: 'Anh Phạm Minh T.',
    patientAge: 49,
    location: 'Quận Tân Phú, TP. Hồ Chí Minh',
    conditionTreated: 'Hội chứng cổ vai gáy & tê mỏi cánh tay',
    quote:
      'Ngồi làm việc máy tính nhiều năm khiến cổ vai gáy tôi cứng đờ, quay đầu rất khó và tê xuống hai ngón tay. Đặt lịch trước qua Zalo nên tới nơi được bác sĩ khám ngay không phải chờ lâu. Bấm huyệt giải cơ trúng điểm đau kết hợp châm cứu vài buổi đầu đã thấy vùng vai nhẹ nhõm, ngủ ngon giấc hơn.',
    rating: 5,
    treatmentDuration: 'Sau 1 liệu trình (6 buổi châm cứu & giải cơ cổ vai gáy)',
    photoUrl: '/images/patients/patient-anh-tuan.webp',
  },
  {
    _id: 'testimonial-bac-quang-ten-lua',
    patientName: 'Bác Đỗ Văn Q.',
    patientAge: 72,
    location: 'Khu Tên Lửa, Phường An Lạc',
    conditionTreated: 'Thoát vị đĩa đệm thắt lưng & tê buốt bắp chân',
    quote:
      'Bác từng chữa nhiều nơi Tây y uống thuốc đau dạ dày. Về Kokoro được bác sĩ bắt mạch chẩn đoán, châm cứu vô khuẩn nhẹ nhàng. Sau 8 buổi các cơn tê giật giảm hẳn 70%, đi lại trong nhà tự chủ không cần gậy chống.',
    rating: 5,
    treatmentDuration: 'Sau 8 buổi châm cứu & cứu ngải ôn kinh',
    photoUrl: '/images/patients/patient-bac-quang.webp',
  },
  {
    _id: 'testimonial-co-ngoc-an-lac',
    patientName: 'Cô Bùi Bích N.',
    patientAge: 64,
    location: 'Đường số 7, Phường An Lạc',
    conditionTreated: 'Viêm quanh khớp vai (đông cứng vai) & khó ngủ',
    quote:
      'Tay cô trước đây không với tay cài cúc áo hay chải tóc được. Đến Kokoro được châm cứu giải cơ và đắp thuốc y học cổ truyền. Bác sĩ rất ân cần, giải thích cặn kẽ. Đến nay tay cô đã giơ cao bình thường và đêm ngủ tròn giấc.',
    rating: 5,
    treatmentDuration: 'Sau 2 liệu trình phục hồi khớp vai',
    photoUrl: '/images/patients/patient-co-ngoc.webp',
  },
];

export const FALLBACK_FAQS: ClinicFaq[] = [
  {
    _id: 'faq-cham-cuu-vo-khuan-khong-dau',
    question:
      'Châm cứu tại Phòng khám Kokoro có đau không, kim châm có đảm bảo vô khuẩn không?',
    answer:
      'Cô chú hoàn toàn yên tâm: Phòng khám Kokoro sử dụng 100% kim châm cứu y tế vô trùng dùng một lần theo đúng quy chuẩn kiểm soát nhiễm khuẩn của Bộ Y Tế, tuyệt đối không tái sử dụng. Bác sĩ thực hiện thao tác tiến kim nhanh, chuẩn xác và rất êm nhẹ, kết hợp theo dõi sát cảm giác đắc khí để cô chú lớn tuổi luôn thấy thư giãn, dễ chịu suốt buổi trị liệu.',
    category: 'An Toàn Điều Trị',
  },
  {
    _id: 'faq-chi-phi-minh-bach',
    question:
      'Chi phí khám và mỗi buổi trị liệu được tính như thế nào, có phát sinh thêm không?',
    answer:
      'Mọi chi phí tại Kokoro đều được niêm yết rõ ràng và thông báo minh bạch trước khi thực hiện. Sau khi bác sĩ thăm khám tứ chẩn, giải thích tình trạng và đề xuất phác đồ phù hợp, nhân viên y tế sẽ báo cụ thể chi phí từng hạng mục để bệnh nhân và gia đình chủ động quyết định. Phòng khám cam kết không phát sinh phụ phí ẩn và không chèo kéo mua các gói liệu trình dài hạn bắt buộc.',
    category: 'Chi Phí & Quy Trình',
  },
  {
    _id: 'faq-thoi-gian-kham-khong-cho-doi',
    question:
      'Một buổi khám và châm cứu – bấm huyệt mất bao lâu, cô chú có phải xếp hàng chờ đợi như ở bệnh viện không?',
    answer:
      'Trung bình một buổi thăm khám kết hợp trị liệu (châm cứu, bấm huyệt, cứu ngải) kéo dài khoảng 45 – 60 phút. Khi đặt lịch hẹn trước qua Hotline hoặc Zalo 092 263 32 66, cô chú sẽ được tiếp đón ngay tại không gian tầng trệt yên tĩnh, thoáng đãng mà không phải bốc số xếp hàng chờ đợi đông đúc hay di chuyển cầu thang mệt nhọc.',
    category: 'Chi Phí & Quy Trình',
  },
  {
    _id: 'faq-chuan-bi-ho-so-kham-lan-dau',
    question:
      'Khi đưa ông bà đến khám lần đầu, gia đình cần chuẩn bị giấy tờ hay hồ sơ gì?',
    answer:
      'Gia đình nên mang theo các kết quả cận lâm sàng sẵn có trong vòng 6 – 12 tháng gần đây (như phim chụp X-quang, MRI cột sống – khớp, kết quả xét nghiệm máu) cùng đơn thuốc hoặc vỏ hộp thuốc đang sử dụng. Những thông tin này giúp Bác sĩ Chuyên khoa YHCT đánh giá toàn diện Đông – Tây y kết hợp, từ đó xây dựng phác đồ an toàn và sát với thể trạng của ông bà nhất.',
    category: 'Chuẩn Bị Khám',
  },
  {
    _id: 'faq-phoi-hop-thuoc-tay-huyet-ap-tieu-duong',
    question:
      'Cô chú đang uống thuốc Tây điều trị huyết áp, tiểu đường, tim mạch có châm cứu và dùng thuốc Đông y được không?',
    answer:
      'Hoàn toàn được và rất phổ biến ở người cao tuổi. Trong buổi khám đầu tiên, bác sĩ sẽ rà soát kỹ toàn bộ danh mục thuốc Tây cô chú đang dùng hàng ngày. Các phương pháp không dùng thuốc (châm cứu, bấm huyệt, cứu ngải) hoàn toàn không gây tương tác thuốc; trường hợp kê thêm thuốc thang Đông y, bác sĩ sẽ gia giảm dược liệu phù hợp và hướng dẫn giãn cách giờ uống an toàn tuyệt đối.',
    category: 'An Toàn Điều Trị',
  },
  {
    _id: 'faq-gio-lam-viec-cuoi-tuan-dau-xe-oto',
    question:
      'Phòng khám có làm việc Thứ Bảy, Chủ Nhật hoặc ngoài giờ hành chính để con cháu tiện đưa đón không, có chỗ đậu ô tô không?',
    answer:
      'Phòng khám mở cửa xuyên suốt từ 08:00 đến 20:00 tất cả các ngày trong tuần, từ Thứ Hai đến Chủ Nhật (bao gồm cả ngoài giờ hành chính và cuối tuần) để anh chị đi làm vẫn thuận tiện đưa bố mẹ đi khám. Tọa lạc tại Số 13 Đường số 15A, Khu dân cư Tên Lửa (cách AEON Mall Bình Tân khoảng 100m), mặt đường nội khu rộng rãi có chỗ đậu xe hơi và đón trả khách ngay sát bậc thềm tầng trệt.',
    category: 'Giờ Làm Việc & Đi Lại',
  },
];

export const FALLBACK_CLINIC_DATA: ClinicPageData = {
  settings: FALLBACK_CLINIC_SETTINGS,
  services: FALLBACK_SERVICES,
  doctors: FALLBACK_DOCTORS,
  testimonials: FALLBACK_TESTIMONIALS,
  faqs: FALLBACK_FAQS,
  dataSource: 'fallback',
};
