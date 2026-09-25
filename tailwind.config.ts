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
          DEFAULT: "#241C38",
          soft: "#5B5470",
          faint: "#8F88A3",
        },
        blush: "#FDF0F5",
        gold: "#C9A227",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(75, 38, 133, 0.18)",
        card: "0 6px 20px -8px rgba(75, 38, 133, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
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
        marquee: "marquee 22s linear infinite",
        fadeUp: "fadeUp .45s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
