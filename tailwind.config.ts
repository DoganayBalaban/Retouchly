import type { Config } from "tailwindcss"

const config = {
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
        }
      },
    },
  } satisfies Config
export default config