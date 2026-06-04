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
        primary: "#0B1F3A",
        accent: "#C9A84C",
        bg: "#F8F6F1",
        surface: "#FFFFFF",
        text: "#1A1A1A",
        muted: "#6B7280",
        success: "#16A34A",
        danger: "#DC2626",
        "admin-bg": "#0F172A",
        "admin-card": "#1E293B",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
