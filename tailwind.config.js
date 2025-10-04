// tailwind.config.js  (ROOT ONLY)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  // MUST be an ARRAY. If you want the forms plugin, keep the require line below.
  plugins: [require('@tailwindcss/forms')],
};


