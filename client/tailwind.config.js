/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#05070c',
        midnight: '#080d18',
        navy: '#101a2e',
        gold: '#d6a84f',
        champagne: '#f5df9b',
        emerald: '#1fc99a'
      },
      boxShadow: {
        premium: '0 24px 90px rgba(0,0,0,.48)',
        glow: '0 0 40px rgba(214,168,79,.18)'
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
