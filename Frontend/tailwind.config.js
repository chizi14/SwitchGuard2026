/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Neutral tokens are wired to CSS variables (see index.css) so
        // toggling the `dark` class on <html> re-themes the whole app
        // without editing every component.
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-dim": "rgb(var(--c-surface-dim) / <alpha-value>)",
        "surface-lowest": "rgb(var(--c-surface-lowest) / <alpha-value>)",
        "surface-low": "rgb(var(--c-surface-low) / <alpha-value>)",
        "surface-container": "rgb(var(--c-surface-container) / <alpha-value>)",
        "surface-high": "rgb(var(--c-surface-high) / <alpha-value>)",
        "surface-highest": "rgb(var(--c-surface-highest) / <alpha-value>)",
        "on-surface": "rgb(var(--c-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--c-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--c-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--c-outline-variant) / <alpha-value>)",
        background: "rgb(var(--c-background) / <alpha-value>)",
        "on-background": "rgb(var(--c-on-background) / <alpha-value>)",

        // Brand/functional colors stay constant across light and dark —
        // standard practice, and they already have safe contrast built in.
        primary: "#000519",
        "primary-container": "#001b4e",
        "on-primary": "#ffffff",
        "on-primary-container": "#7185bd",
        secondary: "#775a00",
        "secondary-container": "#ffce51",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#735700",
        tertiary: "#000703",
        "tertiary-container": "#002416",
        "on-tertiary-container": "#0e996b",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        soft: "0px 4px 20px rgba(0, 27, 78, 0.05)",
        "soft-hover": "0px 8px 28px rgba(0, 27, 78, 0.09)",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
