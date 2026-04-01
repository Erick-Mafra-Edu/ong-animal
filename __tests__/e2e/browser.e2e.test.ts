/**
 * E2E Browser Tests – Puppeteer
 * =================================
 * Builds the Expo web app and tests it in a real Chromium browser.
 *
 * Run standalone:
 *   npx jest --config jest.e2e.config.js
 *
 * Set BASE_URL to point at a running server instead of building:
 *   BASE_URL=http://localhost:3000 npx jest --config jest.e2e.config.js
 */

import puppeteer, { Browser, Page } from 'puppeteer-core';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/chromium-browser',   // Debian/Ubuntu
  '/usr/bin/chromium',            // Arch/Alpine
  '/usr/bin/google-chrome',       // Google Chrome on Linux
  '/usr/bin/google-chrome-stable',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',    // Windows
].filter(Boolean) as string[];

function findChrome(): string {
  const { existsSync } = require('fs') as typeof import('fs');
  for (const p of CHROME_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    'Chrome/Chromium not found. Set the CHROME_PATH environment variable to the executable path.'
  );
}

const CHROME_PATH = findChrome();

const PORT = 18081;
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;
const DIST_DIR = process.env.DIST_DIR || path.resolve(__dirname, '../../dist');
const NEED_BUILD = !process.env.BASE_URL && !fs.existsSync(path.join(DIST_DIR, 'index.html'));

let browser: Browser;
let server: http.Server | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Static file server
// ─────────────────────────────────────────────────────────────────────────────
const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function createStaticServer(root: string, port: number): Promise<http.Server> {
  const resolvedRoot = path.resolve(root);

  // Pre-enumerate all files in the dist directory at startup.
  // This breaks the taint chain: file reads never use user-provided paths.
  const fileIndex = new Map<string, string>();
  (function indexDir(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        indexDir(full);
      } else {
        // Key: URL-style path relative to root (e.g. /_expo/static/js/web/entry.js)
        const rel = full.slice(resolvedRoot.length).replace(/\\/g, '/');
        fileIndex.set(rel, full);
      }
    }
  })(resolvedRoot);

  const INDEX_HTML = path.join(resolvedRoot, 'index.html');

  const srv = http.createServer((req, res) => {
    const urlPath = req.url?.split('?')[0] ?? '/';
    // Look up the pre-indexed file; never use the raw URL as a path directly
    const fsPath = fileIndex.get(urlPath);
    const target = fsPath ?? INDEX_HTML;

    const ext = path.extname(target);
    const mime = MIME[ext] ?? 'application/octet-stream';
    try {
      const data = fs.readFileSync(target);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    } catch {
      const html = fs.readFileSync(INDEX_HTML);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  });

  return new Promise((resolve, reject) => {
    srv.on('error', reject);
    srv.listen(port, '127.0.0.1', () => resolve(srv));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite setup / teardown
// ─────────────────────────────────────────────────────────────────────────────
beforeAll(async () => {
  // 1. Build the web app if needed
  if (NEED_BUILD) {
    console.log('Building Expo web app…');
    const root = path.resolve(__dirname, '../../');
    const result = spawnSync(
      'npx',
      ['expo', 'export', '--platform', 'web', '--output-dir', 'dist'],
      {
        cwd: root,
        env: {
          ...process.env,
          EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
          EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? 'placeholder-key',
          CI: '1',
          EXPO_NO_TELEMETRY: '1',
        },
        timeout: 120_000,
        stdio: 'pipe',
      }
    );
    if (result.status !== 0) {
      throw new Error(`Expo build failed:\n${result.stderr?.toString()}`);
    }
    console.log('Build complete.');
  }

  // 2. Start static server (only when BASE_URL is the default local one)
  if (!process.env.BASE_URL) {
    server = await createStaticServer(DIST_DIR, PORT);
    console.log(`Static server listening on ${BASE_URL}`);
  }

  // 3. Launch browser
  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    headless: true,
  });
}, 140_000);

afterAll(async () => {
  await browser?.close();
  await new Promise<void>((res) => (server ? server.close(() => res()) : res()));
});

const newPage = (): Promise<Page> => browser.newPage();

// ─────────────────────────────────────────────────────────────────────────────
// 1. Page loads – basic reachability
// ─────────────────────────────────────────────────────────────────────────────
describe('Web – Page Load', () => {
  it('root URL responds with HTML', async () => {
    const page = await newPage();
    const res = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    expect(res?.status()).toBeLessThan(500);
    await page.close();
  });

  it('page title contains ONG Animal', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/ong\s*animal|expo/);
    await page.close();
  });

  it('page renders a root DOM element', async () => {
    const page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20_000 });
    const root = await page.$('#root, [data-reactroot]');
    expect(root).not.toBeNull();
    await page.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Navigation – SPA route resolution (all served from index.html)
// ─────────────────────────────────────────────────────────────────────────────
describe('Web – Route Navigation', () => {
  it('/login route loads without error', async () => {
    const page = await newPage();
    const res = await page.goto(`${BASE_URL}/(auth)/login`, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    expect((res?.status() ?? 200)).toBeLessThan(500);
    await page.close();
  });

  it('/cadastro route loads without error', async () => {
    const page = await newPage();
    const res = await page.goto(`${BASE_URL}/(auth)/cadastro`, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    expect((res?.status() ?? 200)).toBeLessThan(500);
    await page.close();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Login screen – UI elements present
// ─────────────────────────────────────────────────────────────────────────────
describe('Web – Login Screen UI', () => {
  let page: Page;

  beforeEach(async () => {
    page = await newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20_000 });
  });

  afterEach(async () => {
    await page.close();
  });

  it('page is not blank (has visible text)', async () => {
    const body = await page.$eval('body', (el) => (el as HTMLElement).innerText?.trim() ?? '');
    expect(body.length).toBeGreaterThan(0);
  });

  it('no fatal JavaScript errors on initial load', async () => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.reload({ waitUntil: 'networkidle2', timeout: 20_000 });
    const fatalErrors = errors.filter(
      (e) =>
        !e.includes('Warning:') &&
        !e.includes('ResizeObserver') &&
        !e.includes('ExpoModulesCore') &&
        !e.includes('supabase') // placeholder URL will cause a network error
    );
    expect(fatalErrors).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Responsive layout – viewport checks
// ─────────────────────────────────────────────────────────────────────────────
describe('Web – Responsive Layout', () => {
  const viewports = [
    { name: 'Mobile (375×667)', width: 375, height: 667 },
    { name: 'Tablet (768×1024)', width: 768, height: 1024 },
    { name: 'Desktop (1280×800)', width: 1280, height: 800 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`renders without horizontal scrollbar at ${name}`, async () => {
      const page = await newPage();
      await page.setViewport({ width, height });
      await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20_000 });

      const hasHScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHScroll).toBe(false);
      await page.close();
    });
  });
});
