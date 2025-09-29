/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef7ff",
          100: "#d9ecff",
          200: "#bfe0ff",
          300: "#93c9ff",
          400: "#5aaaff",
          500: "#2b83f6",
          600: "#1768d6",
          700: "#1253a9",
          800: "#0f4387",
          900: "#0f396e"
        }
      }
    },
  },
  plugins: [],
}
