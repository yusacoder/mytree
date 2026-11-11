import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080D0B",
        surface: "#111A15",
        "forest-dark": "#0F261B",
        "forest": "#183C2B",
        "forest-light": "#23553D",
        gold: {
          DEFAULT: "#D6B66B",
          light: "#EAD49B",
          dark: "#B89647",
        },
        snow: "#F5F3EC",
        muted: "#A4ADA5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      animation: {
        "snow-fall": "snowfall 10s linear infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        snowfall: {
          "0%": { transform: "translateY(-10px) translateX(0)" },
          "50%": { transform: "translateY(50vh) translateX(15px)" },
          "100%": { transform: "translateY(105vh) translateX(-15px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
