import type { Config } from 'tailwindcss';

const config: Config = {
  // Permanent Soft-Cream Light Theme ONLY — never activate dark mode from OS settings
  darkMode: ['selector', '[data-kokoro-never-dark]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kokoro: {
          canvas: '#FAFAF7',
          surface: '#FFFFFF',
          border: '#0D3B2E',
          forest: '#0D3B2E',
          ink: '#06231B',
          gold: '#B88219',
          'gold-hover': '#C99224',
        },
        'kokoro-canvas': '#FAFAF7',
        'kokoro-surface': '#FFFFFF',
        'kokoro-border': '#0D3B2E',
        'kokoro-forest': '#0D3B2E',
        'kokoro-ink': '#06231B',
        'kokoro-gold': '#B88219',
        'kokoro-gold-hover': '#C99224',
      },
      fontFamily: {
        sans: [
          'var(--font-be-vietnam-pro)',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'var(--font-lora)',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
      },
      fontSize: {
        base: ['1.125rem', { lineHeight: '1.75' }], // 18px base minimum
        lg: ['1.25rem', { lineHeight: '1.75' }],    // 20px
        xl: ['1.375rem', { lineHeight: '1.65' }],   // 22px
      },
      boxShadow: {
        'kokoro-card': '0 4px 20px -4px rgba(6, 35, 27, 0.06)',
        'kokoro-elevated': '0 12px 32px -8px rgba(6, 35, 27, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
