/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#222222',
        'on-surface': '#ffffff',
        primary: '#24C373',
        'on-primary': '#ffffff',
        secondary: '#000000',
        'on-secondary': '#ffffff',
        error: '#ff3b30',
        outline: '#ffffff',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'ticketbox-green': '#24C373',
        'dark-gray': '#222222',
        'pure-black': '#000000',
      },
    },
  },
  plugins: [],
}