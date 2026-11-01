import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3123';
const ARTIFACTS_DIR = path.resolve(process.cwd(), 'audit-artifacts');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function runLighthouseCli(presetLabel, extraArgs, rawOutFile) {
  const lighthouseBin = path.resolve(
    process.cwd(),
    'node_modules',
    'lighthouse',
    'cli',
    'index.js',
  );

  const args = [
    lighthouseBin,
    BASE_URL,
    '--output=json',
    `--output-path=${rawOutFile}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
    '--quiet',
    ...extraArgs,
  ];

  console.log(`[INFO] Running Lighthouse (${presetLabel}) against ${BASE_URL}...`);
  execFileSync(process.execPath, args, {
    env: {
      ...process.env,
      CHROME_PATH,
    },
    stdio: 'inherit',
    timeout: 180000,
  });

  const lhr = JSON.parse(fs.readFileSync(rawOutFile, 'utf8'));

  const scores = {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round(
      (lhr.categories['best-practices']?.score ?? 0) * 100,
    ),
    seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
  };

  const getMetric = (id) => {
    const a = lhr.audits?.[id];
    if (!a) return null;
    return {
      numericValue:
        typeof a.numericValue === 'number'
          ? Number(a.numericValue.toFixed(3))
          : null,
      displayValue: a.displayValue || null,
      score: a.score,
    };
  };

  const metrics = {
    firstContentfulPaint: getMetric('first-contentful-paint'),
    largestContentfulPaint: getMetric('largest-contentful-paint'),
    totalBlockingTime: getMetric('total-blocking-time'),
    cumulativeLayoutShift: getMetric('cumulative-layout-shift'),
    speedIndex: getMetric('speed-index'),
    interactive: getMetric('interactive'),
  };

  // Collect any non-perfect audits in the 4 categories so we can inspect/fix if needed
  const nonPerfectAudits = [];
  for (const [catKey, catObj] of Object.entries(lhr.categories)) {
    for (const ref of catObj.auditRefs || []) {
      const audit = lhr.audits[ref.id];
      if (
        audit &&
        typeof audit.score === 'number' &&
        audit.score < 1 &&
        (ref.weight > 0 || catKey !== 'performance')
      ) {
        nonPerfectAudits.push({
          category: catKey,
          id: ref.id,
          title: audit.title,
          score: audit.score,
          displayValue: audit.displayValue || null,
          detailsSnippet: audit.details?.items
            ? audit.details.items.slice(0, 3)
            : undefined,
        });
      }
    }
  }

  return {
    preset: presetLabel,
    requestedUrl: lhr.requestedUrl,
    finalDisplayedUrl: lhr.finalDisplayedUrl,
    fetchTime: lhr.fetchTime,
    lighthouseVersion: lhr.lighthouseVersion,
    scores,
    metrics,
    nonPerfectAudits,
  };
}

function main() {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

  const mobileRawPath = path.join(ARTIFACTS_DIR, 'lighthouse-mobile-raw.json');
  const desktopRawPath = path.join(ARTIFACTS_DIR, 'lighthouse-desktop-raw.json');

  const mobile = runLighthouseCli('mobile', ['--form-factor=mobile'], mobileRawPath);
  const desktop = runLighthouseCli(
    'desktop',
    ['--preset=desktop'],
    desktopRawPath,
  );

  // Remove bulky raw traces/screenshots JSON after extracting summary to keep artifacts clean
  try {
    fs.unlinkSync(mobileRawPath);
    fs.unlinkSync(desktopRawPath);
  } catch {
    // ignore
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    url: BASE_URL,
    mobile,
    desktop,
  };

  const summaryPath = path.join(ARTIFACTS_DIR, 'lighthouse-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('\n[OK] Lighthouse Mobile Scores:', mobile.scores);
  console.log('[OK] Lighthouse Desktop Scores:', desktop.scores);
}

main();
