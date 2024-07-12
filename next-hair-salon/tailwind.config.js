const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "retro",
      {
        mytheme: {
          primary: "#F8F0E6", //Main brand color, used for primary buttons, links, and accents.
          "primary-focus": "#FFE3C3", // Slightly lighter for focus state
          secondary: "#985F6F", //Secondary brand color, used for less prominent elements.
          accent: "#B38B8F", // A contrasting color used for highlighting or drawing attention
          neutral: "#C0A596", //Base neutral color, often used for text and backgrounds
          "base-100": "#D9C8D0", //White or background color.
          "base-content": "#B38B8F", //Color of text and icons on the base color.
          drastic: {
            DEFAULT: "#FF0000", // Replace with the actual color value for drastic actions
            foreground: "#FFFFFF", // Replace with the actual foreground color value for drastic actions
          },
          error: "#E74C3C",
          // ... etc.
        },
      },
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root",
  },
  theme: {
    extend: {
      boxShadow: {
        "white-glow": "0 0 15px rgba(255, 255, 255, 0.8)", // Custom circular white glow effect
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
