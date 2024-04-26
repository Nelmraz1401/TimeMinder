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
      }
    },
  },
  plugins: [
    forms
  ],
}