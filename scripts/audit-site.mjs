import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3123';
const ARTIFACTS_DIR = path.resolve(process.cwd(), 'audit-artifacts');

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
  throw new Error(
    `No local Chromium browser found in candidates: ${CHROME_CANDIDATES.join(', ')}`,
  );
}

/**
 * Injected into browser page to audit WCAG 2.2 AAA contrast across every visible text-bearing element,
 * SVG <text> nodes, and form placeholders, plus senior UX & card border checks.
 */
function browserDomAuditScript(viewportLabel) {
  function parseRgba(cssColor) {
    if (!cssColor || cssColor === 'transparent') {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    const match = cssColor.match(
      /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+%?))?\s*\)/i,
    );
    if (!match) {
      // Handle hex fallback (e.g., SVG attributes)
      const hex = cssColor.trim();
      if (/^#([0-9a-f]{6})$/i.test(hex)) {
        return {
          r: parseInt(hex.slice(1, 3), 16),
          g: parseInt(hex.slice(3, 5), 16),
          b: parseInt(hex.slice(5, 7), 16),
          a: 1,
        };
      }
      if (/^#([0-9a-f]{3})$/i.test(hex)) {
        return {
          r: parseInt(hex[1] + hex[1], 16),
          g: parseInt(hex[2] + hex[2], 16),
          b: parseInt(hex[3] + hex[3], 16),
          a: 1,
        };
      }
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    let alpha = 1;
    if (match[4] !== undefined) {
      alpha = match[4].endsWith('%')
        ? parseFloat(match[4]) / 100
        : parseFloat(match[4]);
    }
    return {
      r: Math.min(255, Math.max(0, parseFloat(match[1]))),
      g: Math.min(255, Math.max(0, parseFloat(match[2]))),
      b: Math.min(255, Math.max(0, parseFloat(match[3]))),
      a: Math.min(1, Math.max(0, alpha)),
    };
  }

  function compositeOver(fg, bg) {
    const a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 250, g: 250, b: 247, a: 1 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a,
    };
  }

  function srgbChannelLuminance(channel255) {
    const c = channel255 / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function relativeLuminance(rgb) {
    const r = srgbChannelLuminance(rgb.r);
    const g = srgbChannelLuminance(rgb.g);
    const b = srgbChannelLuminance(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrastRatio(rgb1, rgb2) {
    const l1 = relativeLuminance(rgb1);
    const l2 = relativeLuminance(rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function rgbToHex(rgb) {
    const toHex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  function isVisuallyHiddenOrClipped(el) {
    let cur = el;
    while (cur && cur.nodeType === 1) {
      const style = window.getComputedStyle(cur);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        parseFloat(style.opacity || '1') === 0
      ) {
        return true;
      }
      // Detect Tailwind .sr-only
      const rect = cur.getBoundingClientRect();
      if (
        rect.width <= 1 &&
        rect.height <= 1 &&
        (style.clip === 'rect(0px, 0px, 0px, 0px)' ||
          style.overflow === 'hidden' ||
          cur.classList.contains('sr-only'))
      ) {
        return true;
      }
      cur = cur.parentElement;
    }
    const selfRect = el.getBoundingClientRect();
    return selfRect.width === 0 || selfRect.height === 0;
  }

  function getEffectiveBackground(el) {
    const layers = [];
    let cur = el;
    while (cur && cur.nodeType === 1) {
      const style = window.getComputedStyle(cur);
      const bg = parseRgba(style.backgroundColor);
      const elOpacity = parseFloat(style.opacity || '1');
      if (bg.a > 0) {
        layers.push({ ...bg, a: bg.a * elOpacity });
      }
      cur = cur.parentElement;
    }
    // Root canvas fallback (#FAFAF7)
    let base = { r: 250, g: 250, b: 247, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) {
      base = compositeOver(layers[i], base);
    }
    return base;
  }

  function getCumulativeOpacity(el) {
    let opacity = 1;
    let cur = el;
    while (cur && cur.nodeType === 1) {
      const style = window.getComputedStyle(cur);
      opacity *= parseFloat(style.opacity || '1');
      cur = cur.parentElement;
    }
    return opacity;
  }

  const contrastViolations = [];
  const whiteOnGoldViolations = [];
  let auditedTextElementsCount = 0;
  let minNormalContrast = Infinity;
  let minLargeContrast = Infinity;
  const samplePairs = [];

  const allElements = Array.from(document.querySelectorAll('body *'));

  for (const el of allElements) {
    if (el instanceof SVGElement) continue;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'meta', 'link', 'option'].includes(tag)) {
      continue;
    }
    if (isVisuallyHiddenOrClipped(el)) continue;

    // Check direct non-whitespace text node OR form control value/placeholder
    let directText = '';
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim().length > 0) {
        directText += child.nodeValue.trim() + ' ';
      }
    }
    const isFormInput = ['input', 'select', 'textarea'].includes(tag);
    if (isFormInput && !directText) {
      directText =
        el.value ||
        el.getAttribute('placeholder') ||
        (tag === 'select' && el.options?.[el.selectedIndex]?.text) ||
        '';
    }

    directText = directText.trim();
    if (!directText) continue;

    auditedTextElementsCount++;
    const style = window.getComputedStyle(el);
    const rawFg = parseRgba(style.color);
    const totalOpacity = getCumulativeOpacity(el);
    const bg = getEffectiveBackground(el);
    const fg = compositeOver({ ...rawFg, a: rawFg.a * totalOpacity }, bg);

    const fontSizePx = parseFloat(style.fontSize || '16');
    const fontWeightNum = parseInt(style.fontWeight || '400', 10) || 400;
    const isLargeText =
      fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeightNum >= 700);
    const requiredRatio = isLargeText ? 4.5 : 7.0;

    const ratio = Number(contrastRatio(fg, bg).toFixed(2));
    const fgHex = rgbToHex(fg);
    const bgHex = rgbToHex(bg);

    if (isLargeText) {
      if (ratio < minLargeContrast) minLargeContrast = ratio;
    } else {
      if (ratio < minNormalContrast) minNormalContrast = ratio;
    }

    if (samplePairs.length < 25) {
      samplePairs.push({
        tag,
        textSnippet: directText.slice(0, 60),
        fgHex,
        bgHex,
        fontSizePx,
        fontWeightNum,
        isLargeText,
        ratio,
        requiredRatio,
      });
    }

    // White-on-gold check (#B88219 / #C99224)
    const isGoldSurface = bgHex === '#B88219' || bgHex === '#C99224';
    const isLightText = fg.r > 220 && fg.g > 220 && fg.b > 220;
    if (isGoldSurface && isLightText) {
      whiteOnGoldViolations.push({
        tag,
        textSnippet: directText.slice(0, 80),
        fgHex,
        bgHex,
        ratio,
      });
    }

    if (ratio < requiredRatio) {
      contrastViolations.push({
        tag,
        className: typeof el.className === 'string' ? el.className : '',
        textSnippet: directText.slice(0, 80),
        fgHex,
        bgHex,
        fontSizePx,
        fontWeightNum,
        isLargeText,
        ratio,
        requiredRatio,
      });
    }
  }

  // Senior UX & Compliance Checks
  const htmlStyle = window.getComputedStyle(document.documentElement);
  const bodyStyle = window.getComputedStyle(document.body);
  const htmlFontSizePx = parseFloat(htmlStyle.fontSize || '0');
  const bodyFontSizePx = parseFloat(bodyStyle.fontSize || '0');
  const htmlColorScheme = htmlStyle.colorScheme;
  const hasHorizontalOverflow =
    document.documentElement.scrollWidth > window.innerWidth;
  const visibleHeaderLinks = Array.from(
    document.querySelectorAll('header a'),
  ).filter((el) => !isVisuallyHiddenOrClipped(el));
  const headerLinksClipped = visibleHeaderLinks.some((el) => {
    const r = el.getBoundingClientRect();
    return r.left < 0 || r.right > window.innerWidth;
  });
  const navLinks = Array.from(
    document.querySelectorAll('header nav a'),
  ).filter((el) => !isVisuallyHiddenOrClipped(el));
  const navLabels = navLinks.map((a) => (a.innerText || '').trim());
  const headerSingleRow =
    visibleHeaderLinks.length > 0 &&
    Math.max(
      ...visibleHeaderLinks.map(
        (el) => el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2,
      ),
    ) -
      Math.min(
        ...visibleHeaderLinks.map(
          (el) => el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2,
        ),
      ) <=
      8;

  // Phase 6 section presence checks (#quy-trinh & #hoi-dap)
  const visitProcessSection = document.getElementById('quy-trinh');
  const symptomFaqSection = document.getElementById('hoi-dap');
  const visitProcessInfo = visitProcessSection
    ? {
        visible: !isVisuallyHiddenOrClipped(visitProcessSection),
        essentialCardsCount:
          visitProcessSection.querySelectorAll('article').length,
        hasFourSteps:
          /BƯỚC 01/.test(visitProcessSection.innerText || '') &&
          /BƯỚC 04/.test(visitProcessSection.innerText || ''),
      }
    : null;
  const symptomFaqInfo = symptomFaqSection
    ? {
        visible: !isVisuallyHiddenOrClipped(symptomFaqSection),
        triageCardsCount: symptomFaqSection.querySelectorAll('article').length,
        faqDetailsCount: symptomFaqSection.querySelectorAll('details').length,
        openDetailsCount:
          symptomFaqSection.querySelectorAll('details[open]').length,
      }
    : null;

  // Every visible <a> and <button> must have non-empty visible text
  const unlabeledInteractive = [];
  const interactiveElements = Array.from(
    document.querySelectorAll('a, button'),
  ).filter((el) => !isVisuallyHiddenOrClipped(el));

  for (const el of interactiveElements) {
    const visibleText = (el.innerText || el.textContent || '').trim();
    if (visibleText.length === 0) {
      unlabeledInteractive.push({
        tag: el.tagName.toLowerCase(),
        href: el.getAttribute('href') || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        outerHTML: el.outerHTML.slice(0, 160),
      });
    }
  }

  // Operating License check in body & footer
  const bodyText = document.body.innerText || '';
  const footerEl = document.querySelector('footer');
  const footerText = footerEl ? footerEl.innerText || '' : '';
  const hasLicenseInPage = /Giấy Phép Hoạt Động/i.test(bodyText);
  const hasLicenseInFooter =
    footerEl !== null &&
    !isVisuallyHiddenOrClipped(footerEl) &&
    /Giấy Phép Hoạt Động/i.test(footerText);

  // Card border check (#0D3B2E -> rgb(13, 59, 46))
  const articleCards = Array.from(document.querySelectorAll('main article'));
  const cardBorderChecks = articleCards.map((card) => {
    const cs = window.getComputedStyle(card);
    return {
      borderTopWidth: cs.borderTopWidth,
      borderTopColor: cs.borderTopColor,
      backgroundColor: cs.backgroundColor,
    };
  });
  const allCardsHaveForestBorder =
    cardBorderChecks.length > 0 &&
    cardBorderChecks.every(
      (c) =>
        parseFloat(c.borderTopWidth) >= 1 &&
        c.borderTopColor.replace(/\s+/g, '') === 'rgb(13,59,46)',
    );

  // Mobile Floating Contact Bar check
  const floatingBar = document.querySelector(
    'aside[aria-label*="Thanh liên hệ"]',
  );
  let floatingBarInfo = null;
  if (floatingBar) {
    const cs = window.getComputedStyle(floatingBar);
    const rect = floatingBar.getBoundingClientRect();
    const links = Array.from(floatingBar.querySelectorAll('a')).map((a) => ({
      href: a.getAttribute('href'),
      text: (a.innerText || '').trim(),
    }));
    floatingBarInfo = {
      visible: cs.display !== 'none' && rect.height > 0,
      position: cs.position,
      bottomCss: cs.bottom,
      rect: {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        width: Math.round(rect.width),
      },
      viewportHeight: window.innerHeight,
      hasTelLink: links.some((l) => l.href?.startsWith('tel:')),
      hasZaloLink: links.some((l) => /zalo/i.test(l.href || '')),
      links,
    };
  }

  return {
    viewportLabel,
    colorScheme: htmlColorScheme,
    htmlFontSizePx,
    bodyFontSizePx,
    hasHorizontalOverflow,
    headerLinksClipped,
    headerSingleRow,
    navLabels,
    visitProcessInfo,
    symptomFaqInfo,
    auditedTextElementsCount,
    minNormalContrast:
      minNormalContrast === Infinity ? null : minNormalContrast,
    minLargeContrast: minLargeContrast === Infinity ? null : minLargeContrast,
    contrastViolationsCount: contrastViolations.length,
    contrastViolations,
    whiteOnGoldViolationsCount: whiteOnGoldViolations.length,
    whiteOnGoldViolations,
    interactiveElementsCount: interactiveElements.length,
    unlabeledInteractiveCount: unlabeledInteractive.length,
    unlabeledInteractive,
    hasLicenseInPage,
    hasLicenseInFooter,
    articleCardsCount: articleCards.length,
    allCardsHaveForestBorder,
    cardBorderSample: cardBorderChecks[0] || null,
    floatingBarInfo,
    samplePairs,
  };
}

async function runViewportAudit(browser, viewportConfig) {
  const { label, width, height, isMobile } = viewportConfig;
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile,
    hasTouch: isMobile,
    locale: 'vi-VN',
    colorScheme: 'light',
  });

  // Inject CLS PerformanceObserver prior to any page script execution
  await context.addInitScript(() => {
    window.__kokoroClsEntries = [];
    window.__kokoroClsTotal = 0;
    window.__kokoroClsRawAll = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__kokoroClsRawAll += entry.value;
          if (!entry.hadRecentInput) {
            window.__kokoroClsTotal += entry.value;
          }
          window.__kokoroClsEntries.push({
            value: entry.value,
            hadRecentInput: entry.hadRecentInput,
            startTime: Math.round(entry.startTime),
          });
        }
      });
      po.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // ignore if unsupported
    }
  });

  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message || String(err));
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    // Ignore aborted navigations or external Google Maps embed telemetry when testing offline/headless
    if (url.startsWith(BASE_URL)) {
      failedRequests.push({
        url,
        method: req.method(),
        failure: req.failure()?.errorText || 'unknown',
      });
    }
  });
  page.on('response', (res) => {
    const url = res.url();
    if (url.startsWith(BASE_URL) && res.status() >= 400) {
      failedRequests.push({
        url,
        method: res.request().method(),
        status: res.status(),
      });
    }
  });

  const navResponse = await page.goto(BASE_URL, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);

  const clsAfterLoad = await page.evaluate(() => ({
    cls: Number((window.__kokoroClsTotal || 0).toFixed(6)),
    entriesCount: (window.__kokoroClsEntries || []).length,
  }));

  // Capture Hero screenshots at top of viewport
  if (!isMobile) {
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop-hero.png'),
      fullPage: false,
    });
  } else {
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'mobile-hero-floating-bar.png'),
      fullPage: false,
    });
  }

  // Run WCAG 2.2 AAA + Senior UX DOM audit
  const domAudit = await page.evaluate(browserDomAuditScript, label);

  // Desktop section screenshots (#quy-trinh, #dich-vu/#bac-si, #hoi-dap, #dat-lich BEFORE clicking map)
  if (!isMobile) {
    // 1. #quy-trinh (4 "Cần Biết" cards + 4-Step Visit Flow cleanly framed below sticky header)
    await page.evaluate(() => {
      const grid = document.querySelector('#quy-trinh .grid');
      if (grid) {
        const y = grid.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop-visit-process.png'),
      fullPage: false,
    });

    // 2. Services & Doctors
    await page.evaluate(() => {
      const doctorsSection = document.getElementById('bac-si');
      if (doctorsSection) {
        doctorsSection.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -340);
      }
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop-services-doctors.png'),
      fullPage: false,
    });

    // 3. #hoi-dap (Symptom Triage + <details> FAQ Accordion cleanly framed below sticky header)
    await page.evaluate(() => {
      const grid = document.querySelector('#hoi-dap .grid');
      if (grid) {
        const y = grid.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop-symptom-faq.png'),
      fullPage: false,
    });

    // 4. Scroll to Booking Form & Khu Tên Lửa / AEON Mall Map Facade cleanly below sticky header
    await page.evaluate(() => {
      const grid = document.querySelector('#dat-lich .grid');
      if (grid) {
        const y = grid.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop-booking-map.png'),
      fullPage: false,
    });
  }

  // Scroll through entire page to bottom and verify Mobile Floating Bar non-overlap with Footer
  await page.evaluate(async () => {
    const step = 400;
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    });
  });
  await page.waitForTimeout(300);

  let mobileFooterClearance = null;
  if (isMobile) {
    mobileFooterClearance = await page.evaluate(() => {
      const bar = document.querySelector('aside[aria-label*="Thanh liên hệ"]');
      const footer = document.querySelector('footer');
      if (!bar || !footer) return null;
      const barRect = bar.getBoundingClientRect();
      // Find lowest visible text/link child inside footer container
      const footerChildren = Array.from(
        footer.querySelectorAll('p, a, h3, li'),
      );
      let maxContentBottom = 0;
      for (const child of footerChildren) {
        const r = child.getBoundingClientRect();
        if (r.bottom > maxContentBottom) {
          maxContentBottom = r.bottom;
        }
      }
      return {
        barTop: Math.round(barRect.top),
        lowestFooterElementBottom: Math.round(maxContentBottom),
        clearancePx: Math.round(barRect.top - maxContentBottom),
        doesNotObscureFooterText: barRect.top >= maxContentBottom,
      };
    });
  }

  const clsAfterScroll = await page.evaluate(() => ({
    cls: Number((window.__kokoroClsTotal || 0).toFixed(6)),
    entriesCount: (window.__kokoroClsEntries || []).length,
  }));

  // Interactive E2E Flow 0: Toggle closed <details> FAQ item in #hoi-dap, verify CLS === 0 & WCAG AAA on expanded state
  const closedFaqSummary = page
    .locator('#hoi-dap details:not([open]) summary')
    .first();
  await closedFaqSummary.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const openCountBefore = await page.locator('#hoi-dap details[open]').count();
  await closedFaqSummary.click();
  await page.waitForTimeout(200);
  const openCountAfter = await page.locator('#hoi-dap details[open]').count();
  const postFaqToggleDomAudit = await page.evaluate(
    browserDomAuditScript,
    `${label}-faq-expanded`,
  );
  const clsAfterFaqToggle = await page.evaluate(() => ({
    cls: Number((window.__kokoroClsTotal || 0).toFixed(6)),
  }));

  // Interactive E2E Flow 1: Click Map Facade button and verify iframe mounts with CLS === 0
  const mapBtn = page.locator(
    'button:has-text("TẢI BẢN ĐỒ TƯƠNG TÁC GOOGLE MAPS")',
  );
  await mapBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const mapClickStart = performance.now();
  await mapBtn.click();
  await page
    .locator('iframe[title*="Bản đồ vị trí Phòng Khám"]')
    .waitFor({ state: 'attached', timeout: 5000 });
  const mapMountLatencyMs = Math.round(performance.now() - mapClickStart);
  await page.waitForTimeout(300);

  const clsAfterMapClick = await page.evaluate(() => ({
    cls: Number((window.__kokoroClsTotal || 0).toFixed(6)),
    rawAll: Number((window.__kokoroClsRawAll || 0).toFixed(6)),
    entriesCount: (window.__kokoroClsEntries || []).length,
  }));

  // Interactive E2E Flow 2: Fill out BookingForm & submit -> verify POST /api/booking 200 & KKR-... confirmation
  const nameInput = page.locator('#booking-patient-name');
  await nameInput.scrollIntoViewIfNeeded();
  await nameInput.fill('Bác Nguyễn Văn Hòa');
  await page.locator('#booking-phone').fill('0909 686 246');
  await page
    .locator('#booking-notes')
    .fill(
      'Đau mỏi thắt lưng và tê bì chân phải 2 tuần nay, đi ô tô cần chỗ đậu ngay trước cửa phòng khám.',
    );

  const bookingApiPromise = page.waitForResponse(
    (res) =>
      res.url().includes('/api/booking') && res.request().method() === 'POST',
    { timeout: 10000 },
  );

  const submitStart = performance.now();
  await page.locator('button[type="submit"]').click();
  const bookingRes = await bookingApiPromise;
  const bookingStatus = bookingRes.status();
  const bookingJson = await bookingRes.json();

  const confirmationCard = page.locator('[role="status"]', {
    hasText: 'KKR-',
  });
  await confirmationCard.waitFor({ state: 'visible', timeout: 5000 });
  const bookingRoundtripMs = Math.round(performance.now() - submitStart);
  const confirmationText = (await confirmationCard.innerText()).trim();
  await page.waitForTimeout(250);

  // Also run WCAG AAA contrast audit on the rendered Booking Confirmation state!
  const postBookingDomAudit = await page.evaluate(
    browserDomAuditScript,
    `${label}-booking-confirmed`,
  );

  const clsAfterBooking = await page.evaluate(() => ({
    cls: Number((window.__kokoroClsTotal || 0).toFixed(6)),
    rawAll: Number((window.__kokoroClsRawAll || 0).toFixed(6)),
    entries: window.__kokoroClsEntries || [],
  }));

  // Extract & validate JSON-LD on Desktop pass
  let jsonLdAudit = null;
  if (!isMobile) {
    jsonLdAudit = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      const parsedBlocks = [];
      const parseErrors = [];
      for (const [idx, s] of scripts.entries()) {
        try {
          parsedBlocks.push(JSON.parse(s.textContent || ''));
        } catch (err) {
          parseErrors.push({ index: idx, error: String(err) });
        }
      }

      const graph = parsedBlocks.flatMap((b) =>
        Array.isArray(b?.['@graph']) ? b['@graph'] : [b],
      );

      const hasType = (node, target) => {
        const t = node?.['@type'];
        return Array.isArray(t) ? t.includes(target) : t === target;
      };

      const clinicNode = graph.find(
        (n) => hasType(n, 'MedicalClinic') && hasType(n, 'LocalBusiness'),
      );
      const physicians = graph.filter((n) => hasType(n, 'Physician'));
      const faqPageNode = graph.find((n) => hasType(n, 'FAQPage'));
      const faqQuestions = Array.isArray(faqPageNode?.mainEntity)
        ? faqPageNode.mainEntity
        : [];
      const address = clinicNode?.address;
      const geo = clinicNode?.geo;
      const hours = clinicNode?.openingHoursSpecification;
      const clinicCred = clinicNode?.hasCredential;

      return {
        scriptCount: scripts.length,
        parseErrorsCount: parseErrors.length,
        parseErrors,
        graphNodeCount: graph.length,
        hasMedicalClinicAndLocalBusiness: Boolean(clinicNode),
        physicianCount: physicians.length,
        allPhysiciansHaveCredential:
          physicians.length > 0 &&
          physicians.every(
            (p) =>
              p.hasCredential?.['@type'] ===
                'EducationalOccupationalCredential' &&
              Boolean(p.hasCredential?.identifier),
          ),
        hasFaqPage: Boolean(faqPageNode),
        faqQuestionCount: faqQuestions.length,
        faqQuestionsValid:
          faqQuestions.length === 6 &&
          faqQuestions.every(
            (q) =>
              q?.['@type'] === 'Question' &&
              Boolean(q?.name) &&
              q?.acceptedAnswer?.['@type'] === 'Answer' &&
              Boolean(q?.acceptedAnswer?.text),
          ),
        postalAddressValid:
          address?.['@type'] === 'PostalAddress' &&
          /13/.test(address?.streetAddress || '') &&
          /15A/i.test(address?.streetAddress || '') &&
          /An Lạc/i.test(address?.addressLocality || ''),
        geoCoordinatesValid:
          geo?.['@type'] === 'GeoCoordinates' &&
          typeof geo?.latitude === 'number' &&
          typeof geo?.longitude === 'number',
        openingHoursValid: Array.isArray(hours) && hours.length > 0,
        clinicOperatingLicenseValid:
          clinicCred?.['@type'] === 'EducationalOccupationalCredential' &&
          /Giấy Phép Hoạt Động/i.test(clinicCred?.name || '') &&
          Boolean(clinicCred?.identifier),
      };
    });
  }

  await context.close();

  return {
    viewport: { label, width, height, isMobile },
    httpStatus: navResponse?.status() || 0,
    consoleErrorsCount: consoleErrors.length,
    consoleErrors,
    pageErrorsCount: pageErrors.length,
    pageErrors,
    failedRequestsCount: failedRequests.length,
    failedRequests,
    cls: {
      afterLoad: clsAfterLoad.cls,
      afterScroll: clsAfterScroll.cls,
      afterFaqToggle: clsAfterFaqToggle.cls,
      afterMapClick: clsAfterMapClick.cls,
      afterBooking: clsAfterBooking.cls,
      entries: clsAfterBooking.entries,
    },
    e2e: {
      faqOpenCountBefore: openCountBefore,
      faqOpenCountAfter: openCountAfter,
      faqToggleSucceeded: openCountAfter === openCountBefore + 1,
      postFaqToggleContrastViolationsCount:
        postFaqToggleDomAudit.contrastViolationsCount,
      mapFacadeMountLatencyMs: mapMountLatencyMs,
      bookingHttpStatus: bookingStatus,
      bookingReferenceCode: bookingJson?.referenceCode || null,
      bookingRoundtripMs,
      confirmationRendered: /KKR-\d{6}-\d{4}/.test(confirmationText),
      postBookingContrastViolationsCount:
        postBookingDomAudit.contrastViolationsCount,
    },
    mobileFooterClearance,
    domAudit,
    jsonLdAudit,
  };
}

async function auditTechnicalRoutes(browser) {
  // 1. GET /sitemap.xml
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const sitemapAudit = {
    status: sitemapRes.status,
    contentType: sitemapRes.headers.get('content-type') || '',
    isValidXml:
      sitemapText.includes('<?xml') &&
      sitemapText.includes('<urlset') &&
      sitemapText.includes('<loc>'),
    lengthBytes: sitemapText.length,
  };

  // 2. GET /robots.txt
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsText = await robotsRes.text();
  const robotsAudit = {
    status: robotsRes.status,
    contentType: robotsRes.headers.get('content-type') || '',
    disallowsAdmin: /Disallow:\s*\/admin/i.test(robotsText),
    disallowsStudio: /Disallow:\s*\/studio/i.test(robotsText),
    hasSitemapDirective: /Sitemap:\s*https?:\/\/.+\/sitemap\.xml/i.test(
      robotsText,
    ),
    raw: robotsText.trim(),
  };

  // 3. GET /admin in headless Desktop browser + screenshot + X-Robots-Tag check
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'vi-VN',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const adminConsoleErrors = [];
  const adminPageErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') adminConsoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => adminPageErrors.push(e.message || String(e)));

  const adminRes = await page.goto(`${BASE_URL}/admin`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'admin-cms-studio.png'),
    fullPage: false,
  });

  const xRobotsTag = adminRes?.headers()['x-robots-tag'] || '';
  const adminHeading = await page.locator('h1').first().innerText().catch(() => '');
  const adminDomAudit = await page.evaluate(browserDomAuditScript, 'admin-1440x900');

  await context.close();

  return {
    sitemap: sitemapAudit,
    robots: robotsAudit,
    admin: {
      status: adminRes?.status() || 0,
      xRobotsTag,
      hasNoindexNofollow:
        /noindex/i.test(xRobotsTag) && /nofollow/i.test(xRobotsTag),
      heading: adminHeading,
      consoleErrorsCount: adminConsoleErrors.length,
      consoleErrors: adminConsoleErrors,
      pageErrorsCount: adminPageErrors.length,
      pageErrors: adminPageErrors,
      contrastViolationsCount: adminDomAudit.contrastViolationsCount,
      contrastViolations: adminDomAudit.contrastViolations,
    },
  };
}

async function main() {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  const executablePath = findBrowserExecutable();
  console.log(`[INFO] Using local browser: ${executablePath}`);

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ['--disable-gpu', '--no-sandbox', '--font-render-hinting=none'],
  });

  try {
    const desktop = await runViewportAudit(browser, {
      label: 'desktop-1440x900',
      width: 1440,
      height: 900,
      isMobile: false,
    });

    const mobile = await runViewportAudit(browser, {
      label: 'mobile-390x844',
      width: 390,
      height: 844,
      isMobile: true,
    });

    const routes = await auditTechnicalRoutes(browser);

    const assertions = {
      desktopHttp200: desktop.httpStatus === 200,
      mobileHttp200: mobile.httpStatus === 200,
      zeroConsoleAndPageErrors:
        desktop.consoleErrorsCount === 0 &&
        desktop.pageErrorsCount === 0 &&
        desktop.failedRequestsCount === 0 &&
        mobile.consoleErrorsCount === 0 &&
        mobile.pageErrorsCount === 0 &&
        mobile.failedRequestsCount === 0,
      desktopWcagAaaPass:
        desktop.domAudit.contrastViolationsCount === 0 &&
        desktop.domAudit.whiteOnGoldViolationsCount === 0 &&
        desktop.e2e.postFaqToggleContrastViolationsCount === 0 &&
        desktop.e2e.postBookingContrastViolationsCount === 0,
      mobileWcagAaaPass:
        mobile.domAudit.contrastViolationsCount === 0 &&
        mobile.domAudit.whiteOnGoldViolationsCount === 0 &&
        mobile.e2e.postFaqToggleContrastViolationsCount === 0 &&
        mobile.e2e.postBookingContrastViolationsCount === 0,
      visitProcessAndSymptomFaqValid:
        Boolean(desktop.domAudit.visitProcessInfo?.visible) &&
        desktop.domAudit.visitProcessInfo?.essentialCardsCount === 4 &&
        Boolean(desktop.domAudit.visitProcessInfo?.hasFourSteps) &&
        Boolean(desktop.domAudit.symptomFaqInfo?.visible) &&
        desktop.domAudit.symptomFaqInfo?.triageCardsCount === 4 &&
        desktop.domAudit.symptomFaqInfo?.faqDetailsCount === 6 &&
        desktop.e2e.faqToggleSucceeded &&
        mobile.e2e.faqToggleSucceeded,
      desktopStickyHeaderFiveNavSingleRow:
        desktop.domAudit.headerSingleRow &&
        JSON.stringify(desktop.domAudit.navLabels) ===
          JSON.stringify(['Dịch Vụ', 'Quy Trình', 'Bác Sĩ', 'Hỏi Đáp', 'Đặt Lịch']),
      lightColorSchemeLocked:
        desktop.domAudit.colorScheme === 'light' &&
        mobile.domAudit.colorScheme === 'light',
      seniorBodyFontSizePass:
        desktop.domAudit.bodyFontSizePx >= 18 &&
        mobile.domAudit.bodyFontSizePx >= 18,
      noHorizontalOverflowOrHeaderClip:
        !desktop.domAudit.hasHorizontalOverflow &&
        !desktop.domAudit.headerLinksClipped &&
        !mobile.domAudit.hasHorizontalOverflow &&
        !mobile.domAudit.headerLinksClipped,
      allButtonsAndLinksHaveVisibleText:
        desktop.domAudit.unlabeledInteractiveCount === 0 &&
        mobile.domAudit.unlabeledInteractiveCount === 0,
      operatingLicenseVisibleInFooter:
        desktop.domAudit.hasLicenseInPage &&
        desktop.domAudit.hasLicenseInFooter &&
        mobile.domAudit.hasLicenseInFooter,
      cardBordersForestGreen:
        desktop.domAudit.allCardsHaveForestBorder &&
        mobile.domAudit.allCardsHaveForestBorder,
      mobileFloatingBarValidAndNonOverlapping:
        Boolean(mobile.domAudit.floatingBarInfo?.visible) &&
        mobile.domAudit.floatingBarInfo?.position === 'fixed' &&
        Boolean(mobile.domAudit.floatingBarInfo?.hasTelLink) &&
        Boolean(mobile.domAudit.floatingBarInfo?.hasZaloLink) &&
        Boolean(mobile.mobileFooterClearance?.doesNotObscureFooterText),
      zeroClsDesktopAndMobile:
        desktop.cls.afterFaqToggle === 0 &&
        desktop.cls.afterBooking === 0 &&
        mobile.cls.afterFaqToggle === 0 &&
        mobile.cls.afterBooking === 0,
      bookingFlowPass:
        desktop.e2e.bookingHttpStatus === 200 &&
        desktop.e2e.confirmationRendered &&
        mobile.e2e.bookingHttpStatus === 200 &&
        mobile.e2e.confirmationRendered,
      jsonLdValid:
        Boolean(desktop.jsonLdAudit) &&
        desktop.jsonLdAudit.parseErrorsCount === 0 &&
        desktop.jsonLdAudit.hasMedicalClinicAndLocalBusiness &&
        desktop.jsonLdAudit.allPhysiciansHaveCredential &&
        desktop.jsonLdAudit.hasFaqPage &&
        desktop.jsonLdAudit.faqQuestionsValid &&
        desktop.jsonLdAudit.postalAddressValid &&
        desktop.jsonLdAudit.geoCoordinatesValid &&
        desktop.jsonLdAudit.openingHoursValid &&
        desktop.jsonLdAudit.clinicOperatingLicenseValid,
      sitemapValid:
        routes.sitemap.status === 200 && routes.sitemap.isValidXml,
      robotsValid:
        routes.robots.status === 200 &&
        routes.robots.disallowsAdmin &&
        routes.robots.disallowsStudio &&
        routes.robots.hasSitemapDirective,
      adminStudioValid:
        routes.admin.status === 200 &&
        routes.admin.hasNoindexNofollow &&
        routes.admin.consoleErrorsCount === 0 &&
        routes.admin.pageErrorsCount === 0,
    };

    const allPassed = Object.values(assertions).every(Boolean);

    const report = {
      auditedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      browserExecutable: executablePath,
      allPassed,
      assertions,
      desktop,
      mobile,
      routes,
      screenshots: [
        'audit-artifacts/desktop-hero.png',
        'audit-artifacts/desktop-visit-process.png',
        'audit-artifacts/desktop-services-doctors.png',
        'audit-artifacts/desktop-symptom-faq.png',
        'audit-artifacts/desktop-booking-map.png',
        'audit-artifacts/mobile-hero-floating-bar.png',
        'audit-artifacts/admin-cms-studio.png',
      ],
    };

    const reportPath = path.join(ARTIFACTS_DIR, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    console.log('[INFO] Audit assertions summary:');
    for (const [k, v] of Object.entries(assertions)) {
      console.log(`  ${v ? '[PASS]' : '[FAIL]'} ${k}`);
    }

    if (!allPassed) {
      console.error('[FAIL] One or more audit assertions failed. Inspect audit-artifacts/audit-report.json');
      process.exitCode = 1;
    } else {
      console.log('[OK] All Playwright WCAG AAA, Senior UX, CLS, E2E & SEO assertions passed!');
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[ERROR] Audit script crashed:', err);
  process.exit(1);
});
