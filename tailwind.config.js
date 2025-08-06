import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'catolica-blue': '#00559C'
      },
      screens: {
        'max-xs': {'max': '344px'}
      },
    },
  },
  plugins: [],
});
