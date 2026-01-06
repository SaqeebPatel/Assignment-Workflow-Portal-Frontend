

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B",       // Orange – main action, active menu
        secondary: "#0F172A",     // Navy / Dark Blue – sidebar, topbar
        background: "#F3F4F6",    // Light Gray – main content
        card: "#FFFFFF",           // White – cards/panels
        accent: "#22C55E",         // Green – highlights, success
        success: "#22C55E",
        error: "#EF4444",
        textPrimary: "#111827",    // Main text
        textSecondary: "#6B7280"   // Muted text
      },
    },
  },
  plugins: [],
};
