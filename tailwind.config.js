module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ['"Open Sans"', "sans-serif"],
      serif: ["Merriweather", "serif"],
      cursive: ["Freehand", "cursive"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-scoped-groups")({
      groups: ["one", "two"],
    }),
  ],
};
