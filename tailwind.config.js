/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        yel: "#FFDB4D",
        lyel: "#FFF8DE",
        br: "7D6000",
      },
      fontFamily: {
        redHat: ["Red Hat Display", "sans-serif"],
      },
    },
  },
  plugins: [],
};
