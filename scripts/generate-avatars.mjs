import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const docDir = 'public/images/doctors';
const patDir = 'public/images/patients';

fs.mkdirSync(docDir, { recursive: true });
fs.mkdirSync(patDir, { recursive: true });

async function createDoctorImage(filename, name, degree, specialty, initials, badgeColor = '#0D3B2E') {
  const width = 600;
  const height = 450;
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F4F2EC"/>
        <stop offset="100%" stop-color="#E5E0D8"/>
      </linearGradient>
      <linearGradient id="coat" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#EFEFEF"/>
      </linearGradient>
    </defs>
    <!-- Background: Calm Clinic Interior Warm Neutral -->
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    
    <!-- Architectural grid lines in background -->
    <line x1="0" y1="80" x2="${width}" y2="80" stroke="#0D3B2E" stroke-opacity="0.08" stroke-width="1.5"/>
    <line x1="0" y1="200" x2="${width}" y2="200" stroke="#0D3B2E" stroke-opacity="0.08" stroke-width="1.5"/>
    <line x1="150" y1="0" x2="150" y2="${height}" stroke="#0D3B2E" stroke-opacity="0.08" stroke-width="1.5"/>
    <line x1="450" y1="0" x2="450" y2="${height}" stroke="#0D3B2E" stroke-opacity="0.08" stroke-width="1.5"/>

    <!-- Subtle Clinic Medical Seal / Stethoscope Outline in BG -->
    <circle cx="300" cy="180" r="130" fill="#0D3B2E" fill-opacity="0.04"/>

    <!-- Doctor Silhouette / Portrait Representation -->
    <!-- Shoulders & White Coat -->
    <path d="M 120 450 L 170 330 Q 230 300 300 300 Q 370 300 430 330 L 480 450 Z" fill="url(#coat)" stroke="#0D3B2E" stroke-width="2"/>
    <!-- Coat Lapels -->
    <path d="M 250 305 L 285 410 L 300 450 L 315 410 L 350 305" fill="none" stroke="#0D3B2E" stroke-width="2.5"/>
    <!-- Blue Tie / Inner Shirt -->
    <polygon points="288,330 312,330 307,410 300,425 293,410" fill="#0D3B2E"/>
    <!-- Medical Stethoscope on shoulders -->
    <path d="M 230 325 Q 300 410 370 325" fill="none" stroke="#B88219" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="300" cy="385" r="14" fill="#B88219" stroke="#06231B" stroke-width="2"/>
    <circle cx="300" cy="385" r="7" fill="#FFFFFF"/>

    <!-- Neck & Head Base -->
    <rect x="270" y="240" width="60" height="70" rx="8" fill="#E8D7C3"/>
    
    <!-- Doctor Dignified Portrait Badge Circle -->
    <circle cx="300" cy="170" r="80" fill="#FFFFFF" stroke="#0D3B2E" stroke-width="4"/>
    <!-- Warm Inner Circle -->
    <circle cx="300" cy="170" r="72" fill="#0D3B2E"/>
    
    <!-- Doctor Monogram / Emblem -->
    <text x="300" y="185" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      ${initials}
    </text>

    <!-- Clinic Badge on Lapel -->
    <rect x="360" y="360" width="75" height="28" rx="4" fill="#0D3B2E" stroke="#B88219" stroke-width="1.5"/>
    <text x="397" y="379" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      KOKORO
    </text>

    <!-- Top Corner Seal Badge -->
    <rect x="24" y="24" width="170" height="34" rx="4" fill="#0D3B2E"/>
    <text x="109" y="46" font-family="'Segoe UI', sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      BÁC SĨ CHUYÊN KHOA
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(path.join(docDir, filename));
  console.log(`Generated doctor image: ${filename}`);
}

async function createPatientImage(filename, initials, gender = 'female', bgHue = '#F0EBE1') {
  const size = 200;
  const avatarBg = gender === 'female' ? '#0D3B2E' : '#144637';
  const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="12" fill="${bgHue}"/>
    <circle cx="100" cy="90" r="65" fill="${avatarBg}" stroke="#B88219" stroke-width="2.5"/>
    <text x="100" y="103" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      ${initials}
    </text>
    <rect x="25" y="166" width="150" height="24" rx="12" fill="#0D3B2E"/>
    <text x="100" y="182" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="bold" fill="#FAFAF7" text-anchor="middle">
      BỆNH NHÂN KOKORO
    </text>
  </svg>
  `;
  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(path.join(patDir, filename));
  console.log(`Generated patient image: ${filename}`);
}

await createDoctorImage('dr-tran-minh-hoa.webp', 'BS.CKI Trần Minh Hòa', 'Bác sĩ CKI YHCT', 'Cơ Xương Khớp & Cột Sống', 'MH');
await createDoctorImage('dr-nguyen-thanh-thao.webp', 'BS. Nguyễn Thanh Thảo', 'Bác sĩ YHCT', 'Châm Cứu & Phục Hồi', 'TT');
await createDoctorImage('dr-le-quoc-bao.webp', 'Lương Y Lê Quốc Bảo', 'Y sĩ YHCT', 'Xoa Bóp Bấm Huyệt', 'QB');

await createPatientImage('patient-co-lan.webp', 'NL', 'female');
await createPatientImage('patient-chu-hung.webp', 'TH', 'male');
await createPatientImage('patient-chi-mai.webp', 'LM', 'female');
await createPatientImage('patient-anh-tuan.webp', 'PT', 'male');
await createPatientImage('patient-bac-quang.webp', 'VQ', 'male');
await createPatientImage('patient-co-ngoc.webp', 'BN', 'female');
