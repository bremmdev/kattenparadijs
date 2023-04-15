/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      handwriting: ['var(--font-dancing-script)'],
      sans: ['var(--font-poppins)'],
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "960px",
      // => @media (min-width: 960px) { ... }

      lg: "1200px",
      // => @media (min-width: 1200px) { ... }
    },
    extend: {
      inset: {
        '1/8': '12.5%',
      },
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1},
        }
      },
      animation: {
        'fade': 'fade 0.5s ease-in-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
