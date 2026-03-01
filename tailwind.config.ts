import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-void": "#07070A",
        "bg-base": "#0D0D12",
        "bg-surface": "#13131A",
        "bg-elevated": "#1C1C26",
        "accent-green": "#3DDB82",
        "accent-green-mid": "#2AB86A",
        "accent-red": "#FF4D4D",
        "accent-blue": "#4D9EFF",
        "accent-gold": "#E2B96A",
        "text-primary": "#EFEFF4",
        "text-secondary": "#7A7A8C",
        "text-muted": "#3E3E52",
        "text-ghost": "#262636",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "28px",
        "2xl": "36px",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
