/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    minWidth: {
      "9/10": "90%",
    },
  },
  plugins: [],
};
