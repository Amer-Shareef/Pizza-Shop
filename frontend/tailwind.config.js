// Exporting the Tailwind configuration to set up dark mode and define the content source
module.exports = {
  // Enabling dark mode based on the "class" strategy, toggle dark mode by adding a class to the root element
  darkMode: "class",
  // In this case, all .js, .jsx files inside the 'src' directory will be scanned for class names
  content: ["./src/**/*.{js,jsx}"],

  theme: {
    extend: {},
  },

  plugins: [],
};
