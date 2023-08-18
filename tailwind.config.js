/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-blue': '#081421',
        'oxford-blue': '#0C1E31',
        'light-cyan': '#6EA4BF',
        'columbia-blue': '#AACADA'
      },
      fontFamily: {
        header: ['IBM Plex Sans', 'sans-serif'],
        title: ['IBM Plex Mono', 'monospace']
      },
      height: {
        sidebar: '45rem'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
