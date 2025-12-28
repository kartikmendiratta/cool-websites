import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Retro Palette
        retro: {
          bg: '#fffdf5',       // Creamy paper background
          main: '#e0e7ff',     // Soft periwinkle
          accent: '#ff6b6b',   // Salmon/Coral red
          dark: '#1a1a1a',     // Soft black for text
          yellow: '#fbbf24',   // Marigold
          mint: '#a7f3d0',     // Mint green
          lavender: '#c4b5fd', // Lavender
          orange: '#fb923c',   // Retro orange
        },
      },
      boxShadow: {
        // Hard Shadows (Neobrutalism)
        'retro': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'retro-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
        'retro-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
      },
      translate: {
        'box': '4px',
        'box-sm': '2px',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
