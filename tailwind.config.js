/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    corePlugins: {
        preflight: false, // Disabling preflight to prevent breaking existing site styles
    },
    theme: {
        extend: {
            maxWidth: {
                container: "1280px",
            },
            animation: {
                marquee: 'marquee var(--duration) linear infinite',
            },
            keyframes: {
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(calc(-100% - var(--gap)))' }
                }
            },
            colors: {
                background: "var(--bg-color)",
                foreground: "var(--text-primary)",
                muted: "rgba(255, 255, 255, 0.05)",
                "muted-foreground": "rgba(255, 255, 255, 0.5)",
            }
        },
    },
    plugins: [],
}
