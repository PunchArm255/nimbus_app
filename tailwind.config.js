/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        yel: "#FFDB4D",
        lyel: "#FFF8DE",
        brown: "#7D6000",
      },
      fontFamily: {
        redHat: ["Red Hat Display", "sans-serif"],
      },
    },
  },
  plugins: [],
};