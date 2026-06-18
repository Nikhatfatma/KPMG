/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#00338D", dark: "#002760", light: "#1A4BA8" },
        brandBlue: { DEFAULT: "#1E49E2", dark: "#1939B5" },
        cyan: { DEFAULT: "#43E0C7", soft: "#B5F5E5" },
        purple: "#470A68",
        pink: "#B91476",
        green: "#00B8A0",
        amber: "#C28A00",
        red: "#C53030",
        ink: "#1A1A1A",
        line: "#E8E8EC",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
