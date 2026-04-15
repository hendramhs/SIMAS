/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f3f5f8",
        ink: "#111827",
        muted: "#667085",
        panel: "#ffffff",
        panelSoft: "#f8fafc",
        line: "#cbd5e1",
        sidebar: "#0f172a",
        sidebarSoft: "#1e293b",
        sideink: "#f1f5f9",
        sidemuted: "#94a3b8",
        brand: "#2563eb",
        brandSoft: "#dbeafe",
        danger: "#b42318",
        dangerSoft: "#fef2f2",
        dangerLine: "#fecaca",
        success: "#0f9f6e",
        successSoft: "#ecfdf5",
        successLine: "#bbf7d0",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 24px rgba(15, 23, 42, 0.05)",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
