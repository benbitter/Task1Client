/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables dark mode with .dark class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4f46e5",
          DEFAULT: "#4338ca",
          dark: "#312e81",
        },
      },
    },
  },
  plugins: [],
};
