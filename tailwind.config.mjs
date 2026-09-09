/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        /* Ghana flag palette — single source of truth */
        'ghana-red': '#C8102E',
        'ghana-gold': '#F2A900',
        'ghana-gold-hover': '#D99500',
        'ghana-green': '#006B3F',
        'ghana-green-hover': '#005A35',
        /* Neutrals */
        ink: '#1A1613',
        cream: '#FAF3E4',
        'cream-deep': '#F0E4CC',
        dark: '#0E0D0C',
        'dark-card': '#151413',
        'dark-muted': '#171615',
        'dark-border': '#363331',
        foreground: '#F4F1EA',
        /* Pulse aliases — same values as Ghana tokens for uniform UI */
        'pulse-gold': '#F2A900',
        'pulse-red': '#C8102E',
        'pulse-green': '#006B3F',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      fontSize: {
        hero: 'clamp(2.75rem, 8vw + 0.5rem, 6rem)',
        h2: 'clamp(1.875rem, 4vw + 0.5rem, 3.25rem)',
        h3: 'clamp(1.125rem, 2vw + 0.75rem, 1.5rem)',
        body: 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(26, 22, 19, 0.08)',
        glow: '0 0 40px rgba(242, 169, 0, 0.15)',
      },
      letterSpacing: {
        nav: '0.18em',
      },
    },
  },
};
