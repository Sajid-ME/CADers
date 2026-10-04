import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
          light: "rgb(var(--color-primary-light) / <alpha-value>)",
          on: "rgb(var(--color-primary-on) / <alpha-value>)",
          container: "rgb(var(--color-primary-container) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-primary-on-container) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          on: "rgb(var(--color-secondary-on) / <alpha-value>)",
          container: "rgb(var(--color-secondary-container) / <alpha-value>)",
          "on-container":
            "rgb(var(--color-secondary-on-container) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          variant: "rgb(var(--color-surface-variant) / <alpha-value>)",
          container: "rgb(var(--color-surface-container) / <alpha-value>)",
          "container-high":
            "rgb(var(--color-surface-container-high) / <alpha-value>)",
          on: "rgb(var(--color-surface-on) / <alpha-value>)",
          "on-variant":
            "rgb(var(--color-surface-on-variant) / <alpha-value>)",
        },
        outline: {
          DEFAULT: "rgb(var(--color-outline) / <alpha-value>)",
          variant: "rgb(var(--color-outline-variant) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-surface-on) / <alpha-value>)",
          soft: "rgb(var(--color-surface-on-variant) / <alpha-value>)",
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