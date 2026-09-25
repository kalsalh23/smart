import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F7F3FC",
          100: "#F0E9FA",
          200: "#E2D3F6",
          300: "#CBB2EE",
          400: "#AC86E2",
          500: "#905ED2",
          600: "#7B3FBE",
          700: "#6C31A8",
          800: "#582789",
          900: "#471F6D",
          950: "#2B1144",
        },
        ink: {
          DEFAULT: "#201833",
          soft: "#57506B",
          faint: "#8B84A0",
        },
        gold: {
          300: "#E7D29A",
          400: "#D9BC6E",
          500: "#C9A227",
          600: "#A8861C",
          700: "#7C6411",
        },
        plum: "#3B1B5E",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        "display-ar": ["var(--font-amiri)", "var(--font-display)", "serif"],
      },
      boxShadow: {
        soft: "0 12px 32px -14px rgba(52, 24, 96, 0.22)",
        card: "0 1px 2px rgba(32, 24, 51, 0.05), 0 8px 24px -12px rgba(52, 24, 96, 0.14)",
      },
      borderRadius: {
        "4xl": "1.75rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 26s linear infinite",
        fadeUp: "fadeUp .45s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
