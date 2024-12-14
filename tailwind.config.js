/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "red-hat": ['"Red Hat Display"', "sans-serif"],
      },
    },
  },
  variants: {},
  plugins: [],
};
