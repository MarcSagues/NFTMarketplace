const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-1": "#552AEF",
        "primary-2": "#5437e1",
        "primary-3": "#2E77EA",
        "primary-4": "#8BC3FD",
        "primary-5": "#7E29F1",
        "dark-1": "#202225",
        "dark-2": "#2a2b2c",
        "dark-3": "#202020",
        "dark-4": "#353535",
      },
    },
  },
};
