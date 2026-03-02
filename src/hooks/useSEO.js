/**
 * useSEO.js — Dynamic per-page SEO meta tag injection
 * ─────────────────────────────────────────────────────────
 * Usage:
 *   useSEO({
 *     title:       'Page Title',
 *     description: 'Page description under 160 chars.',
 *     image:       'https://…/image.jpg',  // for OG + Twitter
 *     url:         'https://www.akdesigns.space/page',
 *     type:        'website' | 'article',
 *     noIndex:     true,  // for 404, admin pages
 *     jsonLd:      { … }, // optional structured data object
 *   });
 */

import { useEffect } from 'react';

const SITE_NAME = 'AK Designs';
const SITE_URL = 'https://www.akdesigns.space';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const TWITTER_HANDLE = '@akcreativex';

/**
 * Set (or create) a <meta> tag by either name or property attribute.
 */
function setMeta(attrKey, attrValue, content) {
    let el = document.querySelector(`meta[${attrKey}="${attrValue}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrKey, attrValue);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

/**
 * Set (or create) a <link> tag.
 */
function setLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

/**
 * Inject or update a <script type="application/ld+json"> block.
 * Uses a data-id attribute to prevent duplicates when navigating.
 */
function setJsonLd(data, id = 'page-jsonld') {
    let el = document.querySelector(`script[data-id="${id}"]`);
    if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute('data-id', id);
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data, null, 2);
}

function removeJsonLd(id = 'page-jsonld') {
    const el = document.querySelector(`script[data-id="${id}"]`);
    if (el) el.remove();
}

// ─────────────────────────────────────────────────────────

export function useSEO({
    title,
    description,
    image,
    url,
    type = 'website',
    noIndex = false,
    jsonLd = null,
    breadcrumbs = null,
} = {}) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Visual Artist & Brand Designer`;
        const desc = description || 'AK Designs — crafting bold visual experiences, logos, and brand identities that elevate brands worldwide.';
        const img = image || DEFAULT_IMAGE;
        const canonical = url || SITE_URL;

        // ── Document title ──────────────────────────────────
        document.title = fullTitle;

        // ── Primary meta ────────────────────────────────────
        setMeta('name', 'description', desc);
        setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1');

        // ── Canonical ───────────────────────────────────────
        setLink('canonical', canonical);

        // ── Open Graph ──────────────────────────────────────
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:image', img);
        setMeta('property', 'og:image:alt', fullTitle);
        setMeta('property', 'og:url', canonical);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:site_name', SITE_NAME);
        setMeta('property', 'og:locale', 'en_US');

        // ── Twitter Card ────────────────────────────────────
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:site', TWITTER_HANDLE);
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image', img);
        setMeta('name', 'twitter:image:alt', fullTitle);

        // ── JSON-LD (page-specific structured data) ─────────
        if (jsonLd) {
            setJsonLd(jsonLd, 'page-jsonld');
        } else {
            removeJsonLd('page-jsonld');
        }

        // ── Breadcrumb JSON-LD ──────────────────────────────
        if (breadcrumbs && breadcrumbs.length > 0) {
            const breadcrumbData = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': breadcrumbs.map((crumb, i) => ({
                    '@type': 'ListItem',
                    'position': i + 1,
                    'name': crumb.name,
                    'item': crumb.url ? `${SITE_URL}${crumb.url}` : undefined,
                })),
            };
            setJsonLd(breadcrumbData, 'breadcrumb-jsonld');
        } else {
            removeJsonLd('breadcrumb-jsonld');
        }

        // ── Cleanup on unmount ──────────────────────────────
        return () => {
            // Reset to defaults when component unmounts
            document.title = `${SITE_NAME} | Visual Artist & Brand Designer`;
            setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');
        };
    }, [title, description, image, url, type, noIndex, jsonLd, breadcrumbs]);
}

export default useSEO;
