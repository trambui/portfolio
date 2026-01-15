/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html", "./public/js/*.js"],
    theme: {
      extend: {
        colors: {
          slate: {
            850: '#1e293b',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }