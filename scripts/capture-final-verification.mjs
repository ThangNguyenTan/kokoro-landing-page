import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3125';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-cli/brain/4b7732c6-41c3-4770-b917-12696d2a901c';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

function findBrowserExecutable() {
  for (const candidate of CHROME_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error('No local Chromium browser found');
}

async function run() {
  const executablePath = findBrowserExecutable();
  console.log('Launching browser with:', executablePath);

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();
  console.log('Navigating to', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // 1. Capture Swapped Hero (Equal Height columns, logo on left, Dual CTA on 1 row on right)
  const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
  if (await heroSection.count() > 0) {
    await heroSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-hero-equal-height.png'),
    });
    console.log('Captured Equal Height Hero');
  }

  // 2. Capture Gallery Section (Authentic Interior & Exterior Photos Carousel)
  const gallerySection = page.locator('#khong-gian');
  if (await gallerySection.count() > 0) {
    await gallerySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await gallerySection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-clinic-gallery.png'),
    });
    console.log('Captured Clinic Gallery Carousel');
  }

  // 3. Capture Services Section (2 items per view with slide carousel)
  const servicesSection = page.locator('#dich-vu');
  if (await servicesSection.count() > 0) {
    await servicesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await servicesSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-services-2-per-view.png'),
    });
    console.log('Captured Services Carousel (2 items per view)');
  }

  // 3. Capture Testimonials Section (2 items per view with slide track)
  const testimonialsSection = page.locator('#cam-nhan');
  if (await testimonialsSection.count() > 0) {
    await testimonialsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await testimonialsSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-testimonials-slide-track.png'),
    });
    console.log('Captured Testimonials Slide Track');
  }

  // 4. Capture Doctors Section
  const doctorsSection = page.locator('#bac-si');
  if (await doctorsSection.count() > 0) {
    await doctorsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await doctorsSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-doctors-slide-track.png'),
    });
    console.log('Captured Doctors Slide Track');
  }

  // 5. Capture Location Section with Real Facade Image
  const locationSection = page.locator('#chi-duong');
  if (await locationSection.count() > 0) {
    await locationSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await locationSection.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-location-with-facade.png'),
    });
    console.log('Captured Location Section with Real Facade');
  }

  // 6. Capture Footer (Centered Copyright & Address)
  const footer = page.locator('footer');
  if (await footer.count() > 0) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await footer.screenshot({
      path: path.join(ARTIFACTS_DIR, 'verified-footer-centered-copyright.png'),
    });
    console.log('Captured Footer with Centered Copyright');
  }

  await browser.close();
  console.log('Finished visual capture successfully!');
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
