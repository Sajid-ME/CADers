import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B5E20",
          dark: "#154A1A",
          light: "#4CAF50",
          on: "#FFFFFF",
          container: "#A5D6A7",
          "on-container": "#002106",
        },
        secondary: {
          DEFAULT: "#4CAF50",
          on: "#FFFFFF",
          container: "#C8E6C9",
          "on-container": "#0A2E0F",
        },
        surface: {
          DEFAULT: "#FBFDF8",
          variant: "#E8F5E9",
          container: "#F1F8F2",
          "container-high": "#E8F5E9",
          on: "#1C1B1F",
          "on-variant": "#49454F",
        },
        outline: {
          DEFAULT: "#79747E",
          variant: "#CAC4D0",
        },
        ink: {
          DEFAULT: "#1C1B1F",
          soft: "#49454F",
        },
      },
      boxShadow: {
        "elev-1":
          "0px 1px 2px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)",
        "elev-2":
          "0px 1px 2px rgba(0,0,0,0.30), 0px 2px 6px 2px rgba(0,0,0,0.15)",
        "elev-3":
          "0px 1px 3px rgba(0,0,0,0.30), 0px 4px 8px 3px rgba(0,0,0,0.15)",
        "elev-4":
          "0px 2px 3px rgba(0,0,0,0.30), 0px 6px 10px 4px rgba(0,0,0,0.15)",
        "elev-5":
          "0px 4px 4px rgba(0,0,0,0.30), 0px 8px 12px 6px rgba(0,0,0,0.15)",
      },
      borderRadius: {
        "m-xs": "4px",
        "m-sm": "8px",
        "m-md": "12px",
        "m-lg": "16px",
        "m-xl": "28px",
      },
      transitionTimingFunction: {
        "m-standard": "cubic-bezier(0.2, 0, 0, 1)",
        "m-emphasized": "cubic-bezier(0.05, 0.7, 0.1, 1)",
      },
      transitionDuration: {
        "m-short": "150ms",
        "m-medium": "300ms",
        "m-long": "500ms",
      },
      container: {
        center: true,
        padding: "1.25rem",
        screens: { "2xl": "1200px" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;