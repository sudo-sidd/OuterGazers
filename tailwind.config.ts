import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#F9F8F6",       // Crisp editorial off-white background
          charcoal: "#111111", // Stark dark heading and body text
          red: "#B81414",      // Signature studio crimson red
          darkRed: "#8A0F0F",  // Deep hover red
          border: "#E5E5E0",   // Clean structural divider lines
        },
      },
      letterSpacing: {
        studioWide: ".2em",
        tighter: "-.04em",
      },
    },
  },
  plugins: [],
};

export default config;