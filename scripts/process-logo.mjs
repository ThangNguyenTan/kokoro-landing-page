import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SOURCE_LOGO = path.join(ROOT_DIR, 'assets', 'kokoro-logo-source.jpg');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const APP_DIR = path.join(ROOT_DIR, 'src', 'app');

function clampByte(val) {
  return Math.max(0, Math.min(255, Math.round(val)));
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

async function main() {
  await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true });
  await fs.mkdir(APP_DIR, { recursive: true });

  const { data, info } = await sharp(SOURCE_LOGO)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`[1/4] Loaded source JPG: ${width}x${height} (${channels} channels)`);

  // 1. Sample 4 corners (16x16 patches) to measure exact flat warm-grey background (~#EFECE8)
  const patch = 16;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let countBg = 0;

  const cornerOffsets = [
    [0, 0],
    [width - patch, 0],
    [0, height - patch],
    [width - patch, height - patch],
  ];

  for (const [ox, oy] of cornerOffsets) {
    for (let y = oy; y < oy + patch; y++) {
      for (let x = ox; x < ox + patch; x++) {
        const idx = (y * width + x) * channels;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        countBg++;
      }
    }
  }

  const bgR = sumR / countBg;
  const bgG = sumG / countBg;
  const bgB = sumB / countBg;
  console.log(
    `      Measured JPG background RGB: (${bgR.toFixed(1)}, ${bgG.toFixed(1)}, ${bgB.toFixed(1)})`
  );

  // 2. Sample solid core Green & Gold strokes to get exact ink reference vectors from background
  let gSumR = 0, gSumG = 0, gSumB = 0, gCount = 0;
  let ySumR = 0, ySumG = 0, ySumB = 0, yCount = 0;

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Deep forest green core pixels
    if (luma < 55 && g >= r) {
      gSumR += r;
      gSumG += g;
      gSumB += b;
      gCount++;
    }
    // Warm gold core pixels
    if (r > 165 && g > 110 && b < 70 && r - b > 125) {
      ySumR += r;
      ySumG += g;
      ySumB += b;
      yCount++;
    }
  }

  const greenRef = gCount > 0
    ? [gSumR / gCount, gSumG / gCount, gSumB / gCount]
    : [6, 35, 27];
  const goldRef = yCount > 0
    ? [ySumR / yCount, ySumG / yCount, ySumB / yCount]
    : [198, 144, 36];

  const vGreen = [bgR - greenRef[0], bgG - greenRef[1], bgB - greenRef[2]];
  const vGold = [bgR - goldRef[0], bgG - goldRef[1], bgB - goldRef[2]];
  const lenGreen = Math.hypot(vGreen[0], vGreen[1], vGreen[2]);
  const lenGold = Math.hypot(vGold[0], vGold[1], vGold[2]);

  console.log(
    `      Detected core Green RGB: (${greenRef.map((n) => Math.round(n)).join(', ')}) [dist=${lenGreen.toFixed(1)}]`
  );
  console.log(
    `      Detected core Gold  RGB: (${goldRef.map((n) => Math.round(n)).join(', ')}) [dist=${lenGold.toFixed(1)}]`
  );

  // 3. Extract RGBA with hue-aware distance alpha feathering + linear foreground color unmixing
  const rgba = Buffer.alloc(width * height * 4);
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const dr = bgR - r;
      const dg = bgG - g;
      const db = bgB - b;
      const dist = Math.hypot(dr, dg, db);

      // Noise floor (~18 RGB units clears 100% of JPEG 8x8 ringing around serif letters)
      if (dist <= 18) {
        rgba[dstIdx] = 0;
        rgba[dstIdx + 1] = 0;
        rgba[dstIdx + 2] = 0;
        rgba[dstIdx + 3] = 0;
        continue;
      }

      // Determine whether this pixel lies closer to the Gold ray or Green ray from background
      const cosGreen = (dr * vGreen[0] + dg * vGreen[1] + db * vGreen[2]) / (dist * lenGreen);
      const cosGold = (dr * vGold[0] + dg * vGold[1] + db * vGold[2]) / (dist * lenGold);

      // Smooth weight toward gold vs green reference full-opacity distance
      const goldWeight = smoothstep(-0.04, 0.08, cosGold - cosGreen);
      const fullDist = (lenGreen * (1 - goldWeight) + lenGold * goldWeight) * 0.90;

      // Compute smooth anti-aliased alpha in [0, 1]
      const rawAlpha = (dist - 18) / Math.max(1, fullDist - 18);
      const alpha = Math.max(0, Math.min(1, rawAlpha));

      // Unmix background color from semi-transparent edge pixels to eliminate warm-grey halo
      const unmixFactor = Math.max(alpha, 0.24);
      const fgR = clampByte(bgR - dr / unmixFactor);
      const fgG = clampByte(bgG - dg / unmixFactor);
      const fgB = clampByte(bgB - db / unmixFactor);
      const alphaByte = clampByte(alpha * 255);

      rgba[dstIdx] = fgR;
      rgba[dstIdx + 1] = fgG;
      rgba[dstIdx + 2] = fgB;
      rgba[dstIdx + 3] = alphaByte;

      if (alphaByte > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 4. Crop tightly around non-zero emblem and pad symmetrically to 460x460 square
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const TARGET_SIZE = 460;

  const croppedEmblem = await sharp(rgba, {
    raw: { width, height, channels: 4 },
  })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .resize({
      width: TARGET_SIZE - 24,
      height: TARGET_SIZE - 24,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const logoPngPath = path.join(PUBLIC_IMAGES_DIR, 'kokoro-logo.png');
  const logoWebpPath = path.join(PUBLIC_IMAGES_DIR, 'kokoro-logo.webp');

  await sharp(croppedEmblem)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(logoPngPath);

  await sharp(croppedEmblem)
    .webp({ quality: 96, alphaQuality: 100, smartSubsample: true })
    .toFile(logoWebpPath);

  console.log(`[2/4] Generated transparent Kokoro emblems (${TARGET_SIZE}x${TARGET_SIZE}):`);
  console.log(`      -> ${logoPngPath}`);
  console.log(`      -> ${logoWebpPath}`);

  // 5. Generate src/app/icon.png (64x64) and src/app/apple-icon.png (180x180 on #FAFAF7)
  const iconBadgeSvg = Buffer.from(
    `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="31" fill="#FAFAF7" stroke="#0D3B2E" stroke-width="1.5"/>
    </svg>`,
    'utf8'
  );
  const iconEmblem56 = await sharp(croppedEmblem)
    .resize(56, 56, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const iconPngPath = path.join(APP_DIR, 'icon.png');
  await sharp(iconBadgeSvg)
    .composite([{ input: iconEmblem56, left: 4, top: 4 }])
    .png({ compressionLevel: 9 })
    .toFile(iconPngPath);

  const appleEmblem152 = await sharp(croppedEmblem)
    .resize(152, 152, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const appleIconPath = path.join(APP_DIR, 'apple-icon.png');
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 250, g: 250, b: 247, alpha: 1 }, // #FAFAF7
    },
  })
    .composite([{ input: appleEmblem152, left: 14, top: 14 }])
    .png({ compressionLevel: 9 })
    .toFile(appleIconPath);

  console.log('[3/4] Generated Next.js App Icons:');
  console.log(`      -> ${iconPngPath} (64x64)`);
  console.log(`      -> ${appleIconPath} (180x180 on #FAFAF7)`);

  // 6. Generate 1200x630 OpenGraph Card (public/images/og-kokoro-clinic.png)
  const ogLogo356 = await sharp(croppedEmblem)
    .resize(356, 356, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const ogSvg = Buffer.from(
    `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <!-- Soft Cream Canvas -->
      <rect width="1200" height="630" fill="#FAFAF7" />

      <!-- Double Border Architectural Frame (#0D3B2E + #B88219) -->
      <rect x="22" y="22" width="1156" height="586" rx="16" fill="none" stroke="#0D3B2E" stroke-width="3.5" />
      <rect x="34" y="34" width="1132" height="562" rx="10" fill="none" stroke="#0D3B2E" stroke-width="1.2" stroke-opacity="0.55" />

      <!-- Subtle Corner Gold Accents -->
      <circle cx="34" cy="34" r="4.5" fill="#B88219" />
      <circle cx="1166" cy="34" r="4.5" fill="#B88219" />
      <circle cx="34" cy="596" r="4.5" fill="#B88219" />
      <circle cx="1166" cy="596" r="4.5" fill="#B88219" />

      <!-- Vertical Divider Between Emblem and Editorial Copy -->
      <line x1="448" y1="96" x2="448" y2="534" stroke="#0D3B2E" stroke-width="1.5" stroke-opacity="0.22" />

      <!-- Top Badge -->
      <rect x="484" y="122" width="352" height="40" rx="20" fill="#0D3B2E" />
      <text
        x="660"
        y="148"
        text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="16"
        font-weight="700"
        letter-spacing="1.5"
        fill="#FAFAF7"
      >Y HỌC CỔ TRUYỀN CHÍNH THỐNG</text>

      <!-- Main Clinic Heading -->
      <text
        x="484"
        y="220"
        font-family="Georgia, Times New Roman, serif"
        font-size="37"
        font-weight="700"
        fill="#06231B"
      >PHÒNG KHÁM YHCT KOKORO</text>

      <!-- Motto -->
      <text
        x="484"
        y="278"
        font-family="Georgia, Times New Roman, serif"
        font-size="29"
        font-style="italic"
        font-weight="700"
        fill="#0D3B2E"
      >Từ Tâm – Khoa Học – Hiệu Quả</text>

      <!-- Gold Accent Divider -->
      <rect x="484" y="305" width="136" height="4" rx="2" fill="#B88219" />

      <!-- Core Specialties -->
      <text
        x="484"
        y="362"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="24"
        font-weight="600"
        fill="#06231B"
      >Châm Cứu • Bấm Huyệt • Điều Trị Đông Y Toàn Diện</text>

      <text
        x="484"
        y="404"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="20"
        font-weight="400"
        fill="#0D3B2E"
      >Cơ Xương Khớp • Đau Vai Gáy • Mất Ngủ • Phục Hồi Thể Trạng</text>

      <!-- Address & Phone Gold Bar (#B88219 fill + #06231B bold text) -->
      <rect
        x="484"
        y="446"
        width="636"
        height="64"
        rx="12"
        fill="#B88219"
        stroke="#0D3B2E"
        stroke-width="2"
      />
      <text
        x="802"
        y="486"
        text-anchor="middle"
        font-family="Segoe UI, Arial, sans-serif"
        font-size="22"
        font-weight="700"
        fill="#06231B"
      >13 Đường số 15A, P. An Lạc, TP.HCM  |  092 263 32 66</text>
    </svg>`,
    'utf8'
  );

  const ogPath = path.join(PUBLIC_IMAGES_DIR, 'og-kokoro-clinic.png');
  await sharp(ogSvg)
    .composite([{ input: ogLogo356, left: 60, top: 137 }])
    .png({ compressionLevel: 9 })
    .toFile(ogPath);

  console.log(`[4/4] Generated OpenGraph social card (1200x630):`);
  console.log(`      -> ${ogPath}`);
}

main().catch((err) => {
  console.error('Logo processing failed:', err);
  process.exit(1);
});
