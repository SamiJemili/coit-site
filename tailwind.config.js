/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#2563eb",  // Bleu professionnel
          800: "#1e293b",  // Gris anthracite
          900: "#111827",  // Bleu nuit
        },
      },
    },
  },
  plugins: [],
}