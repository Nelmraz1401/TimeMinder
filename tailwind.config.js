import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          700: "#00357d",
        }
      }, 
      keyframes: {
        easeUp: {
          '0%': { marginTop: '-100vh' },
          '100%': { marginTop: '0vh' },
        },
        // Define more animations as needed
      },
      animation: {
        easeUp: 'easeUp 1s ease-in-out', 
      },
    },
  },
  plugins: [
    forms
  ],
}