#!/usr/bin/env node
/**
 * generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────
 * Fetches dynamic content from the backend API and writes
 * ready-to-deploy XML sitemap files into /public.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *
 * Run this after publishing new blog posts or projects,
 * or hook it into your CI/CD pipeline before npm run build.
 * ─────────────────────────────────────────────────────────────────
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const SITE_URL = 'https://www.akdesigns.space';
const API_BASE = 'https://api.akdesign.space/api';
const TODAY = new Date().toISOString().split('T')[0];

// ── helpers ────────────────────────────────────────────────────
function escapeXml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function buildUrlset(urls) {
    const items = urls.map(u => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod || TODAY}</lastmod>
    <changefreq>${u.changefreq || 'monthly'}</changefreq>
    <priority>${u.priority || '0.6'}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${items}
</urlset>`;
}

function buildSitemapIndex(sitemaps) {
    const items = sitemaps.map(s => `
  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    <lastmod>${s.lastmod || TODAY}</lastmod>
  </sitemap>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

async function fetchJson(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn(`⚠️  Could not fetch ${url}: ${e.message} — using empty array`);
        return { data: [] };
    }
}

// ── main ───────────────────────────────────────────────────────
async function main() {
    console.log('🗺️  Generating sitemaps...\n');

    // 1. Static pages sitemap (already in public/sitemap.xml — skip overwrite)
    const staticUrls = [
        { loc: `${SITE_URL}/`, lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
        { loc: `${SITE_URL}/about`, lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
        { loc: `${SITE_URL}/projects`, lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/blog`, lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
        { loc: `${SITE_URL}/contact`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
    ];
    writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), buildUrlset(staticUrls));
    console.log('✅  sitemap.xml        — static pages');

    // 2. Fetch blog slugs from backend
    const blogData = await fetchJson(`${API_BASE}/blog?limit=1000`);
    const blogs = Array.isArray(blogData.data) ? blogData.data : [];
    const blogUrls = blogs.map(b => ({
        loc: `${SITE_URL}/blog/${b.slug}`,
        lastmod: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : TODAY,
        changefreq: 'monthly',
        priority: '0.6',
    }));
    writeFileSync(join(PUBLIC_DIR, 'sitemap-blog.xml'), buildUrlset(blogUrls));
    console.log(`✅  sitemap-blog.xml   — ${blogUrls.length} blog post(s)`);

    // 3. Fetch project slugs from backend (gallery endpoint)
    const galleryData = await fetchJson(`${API_BASE}/gallery?limit=1000`);
    const projects = Array.isArray(galleryData.data) ? galleryData.data : [];
    const projectUrls = projects.map(p => ({
        loc: `${SITE_URL}/projects/${p.slug}`,
        lastmod: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : TODAY,
        changefreq: 'monthly',
        priority: '0.7',
    }));
    writeFileSync(join(PUBLIC_DIR, 'sitemap-projects.xml'), buildUrlset(projectUrls));
    console.log(`✅  sitemap-projects.xml — ${projectUrls.length} project(s)`);

    // 4. Sitemap index
    const index = buildSitemapIndex([
        { loc: `${SITE_URL}/sitemap.xml`, lastmod: TODAY },
        { loc: `${SITE_URL}/sitemap-blog.xml`, lastmod: TODAY },
        { loc: `${SITE_URL}/sitemap-projects.xml`, lastmod: TODAY },
    ]);
    writeFileSync(join(PUBLIC_DIR, 'sitemap-index.xml'), index);
    console.log('✅  sitemap-index.xml  — index');

    console.log('\n🎉  Done! All sitemap files written to /public.');
    console.log(`    Total URLs: ${staticUrls.length + blogUrls.length + projectUrls.length}`);
}

main().catch(err => {
    console.error('❌  Sitemap generation failed:', err);
    process.exit(1);
});
