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
        "bg-base":    "#0a0a0f",
        "bg-surface": "#12121a",
        "accent-orange": "#FF4D00",
        "accent-green":  "#00E87A",
        "caution":    "#FFB800",
        "danger":     "#FF3B5C",
        "text-primary": "#F0F0F5",
        "text-muted":   "#6B6B7E",
      },
      fontFamily: {
        outfit:     ["var(--font-outfit)", "sans-serif"],
        jetbrains:  ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #FF4D00, #ff6a20)",
      },
      animation: {
        "fade-up":  "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in":  "fadeIn 0.4s ease both",
        "float":    "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
