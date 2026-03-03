/**
 * Turnstile.jsx
 * ─────────────────────────────────────────────────────────────────
 * Cloudflare Turnstile CAPTCHA widget — zero dependencies.
 *
 * NOTE on the 405 /cdn-cgi/challenge-platform/ error:
 *   This is a non-fatal Cloudflare "clearance cookie" redemption that
 *   only works when the site is behind Cloudflare proxy (orange cloud).
 *   On Vercel-hosted sites the POST returns 405 — the CAPTCHA token
 *   generation still works normally. No action needed.
 *
 * Props:
 *   onVerify(token: string) — called when user passes the challenge
 *   onError()              — called on widget error (optional)
 *   onExpire()             — called when token expires (optional)
 *   theme                  — 'dark' | 'light' | 'auto' (default: 'dark')
 *   size                   — 'normal' | 'compact' (default: 'normal')
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

// 1x00000000000000000000AA = Cloudflare's always-passes test key (dev only)
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

// Module-level singletons so the script loads only once across all renders
let scriptLoaded = false;
let scriptLoading = false;
const readyCallbacks = [];

function loadTurnstileScript(cb) {
    if (window.turnstile) {
        cb();
        return;
    }
    readyCallbacks.push(cb);
    if (scriptLoading) return;
    scriptLoading = true;

    const checkInterval = setInterval(() => {
        if (window.turnstile) {
            clearInterval(checkInterval);
            scriptLoaded = true;
            scriptLoading = false;
            readyCallbacks.forEach(fn => fn());
            readyCallbacks.length = 0;
        }
    }, 100);

    setTimeout(() => {
        if (!scriptLoaded) {
            clearInterval(checkInterval);
            scriptLoading = false;
        }
    }, 10000);
}

// ─────────────────────────────────────────────────────────────────

const Turnstile = ({
    onVerify,
    onError,
    onExpire,
    theme = 'dark',
    size = 'normal',
}) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [widgetError, setWidgetError] = useState(false);

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile) return;

        // Remove any stale widget instance before re-rendering
        if (widgetIdRef.current !== null) {
            try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
            widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme,
            size,

            // ── Callbacks ────────────────────────────────────────
            callback: (token) => {
                setWidgetError(false);
                onVerify?.(token);
            },

            'error-callback': (errCode) => {
                // Ignore the clearance-route 405 — it's not a real failure.
                // Real error codes: 110100–110200 range.
                if (typeof errCode === 'string' && errCode.startsWith('1101')) {
                    setWidgetError(true);
                    onError?.();
                }
                // else: non-fatal (e.g. clearance redemption on non-CF domain) — ignore
            },

            'expired-callback': () => {
                onExpire?.();
                onVerify?.(null);
            },

            // Timeout — let user retry instead of showing a blank box
            'timeout-callback': () => {
                if (widgetIdRef.current !== null && window.turnstile) {
                    try { window.turnstile.reset(widgetIdRef.current); } catch (_) { }
                }
            },
        });
    }, [theme, size, onVerify, onError, onExpire]);

    useEffect(() => {
        setWidgetError(false);
        loadTurnstileScript(renderWidget);

        return () => {
            if (widgetIdRef.current !== null && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
                widgetIdRef.current = null;
            }
        };
    }, [renderWidget]);

    return (
        <div style={{ margin: '16px 0' }}>
            <div
                ref={containerRef}
                style={{ display: 'flex', justifyContent: 'center' }}
                aria-label="Security verification — Cloudflare Turnstile"
            />
            {widgetError && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginTop: '10px', color: '#f87171',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    padding: '10px 14px', borderRadius: '10px',
                    fontSize: '0.82rem',
                }}>
                    <ShieldAlert size={14} />
                    Verification failed. Please refresh and try again.
                </div>
            )}
        </div>
    );
};

export default Turnstile;
