/**
 * Turnstile.jsx
 * ─────────────────────────────────────────────────────────────────
 * Cloudflare Turnstile CAPTCHA widget — zero dependencies.
 * Loads the Turnstile JS API on demand (only once) and renders
 * the widget in a dedicated container div.
 *
 * Props:
 *   onVerify(token: string) — called when user passes the challenge
 *   onError()              — called on widget error (optional)
 *   onExpire()             — called when token expires (optional)
 *   theme                  — 'dark' | 'light' | 'auto' (default: 'dark')
 *   size                   — 'normal' | 'compact' (default: 'normal')
 */

import { useEffect, useRef, useCallback } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // 1x… = always-passes test key

let scriptLoaded = false;
let scriptLoading = false;
const readyCallbacks = [];

function loadTurnstileScript(cb) {
    if (scriptLoaded) { cb(); return; }
    readyCallbacks.push(cb);
    if (scriptLoading) return;

    scriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        scriptLoaded = true;
        readyCallbacks.forEach(fn => fn());
        readyCallbacks.length = 0;
    };
    document.head.appendChild(script);
}

const Turnstile = ({
    onVerify,
    onError,
    onExpire,
    theme = 'dark',
    size = 'normal',
}) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile) return;

        // Clean up any existing widget before re-rendering
        if (widgetIdRef.current !== null) {
            try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme,
            size,
            callback: (token) => onVerify?.(token),
            'error-callback': () => onError?.(),
            'expired-callback': () => {
                onExpire?.();
                onVerify?.(null); // reset token on expiry
            },
        });
    }, [theme, size, onVerify, onError, onExpire]);

    useEffect(() => {
        loadTurnstileScript(renderWidget);
        return () => {
            if (widgetIdRef.current !== null && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch (_) { }
            }
        };
    }, [renderWidget]);

    return (
        <div
            ref={containerRef}
            style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}
            aria-label="Security verification"
        />
    );
};

export default Turnstile;
