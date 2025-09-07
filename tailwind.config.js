const { default: daisyui } = require("daisyui");
const { base } = require("daisyui/imports");
const { default: themes } = require("daisyui/theme/object");

module.exports = {
  darkMode: 'class', // or 'class' if you want manual toggle
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // enable both
    darkTheme: "dark",
  },
};
