const colors = require('tailwindcss/colors');

module.exports = {
  future: {
    defaultLineHeights: true,
    standardFontWeights: true,
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      inset: {
        0.5: '0.5rem',
        1: '1rem',
        2: '2rem',
      },
      cursor: {
        'col-resize': 'col-resize',
      },
      colors: {
        'alexa-blue': '#78e5ff',
        'blueGray': colors.blueGray,
        'jovo-blue': '#272f48',
        'opacityblack': 'rgba(0,0,0,0.5)',
      },
      spacing: {
        72: '18rem',
        80: '20rem',
        88: '22rem',
        96: '24rem',
      },
      backgroundColor: {
        primary: '#434A65',
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      maxHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '144': '36rem',
        '172': '44rem',
      },
      height: {
        120: '30rem',
        144: '36rem',
        172: '44rem',
      },
      verticalAlign: {
        sub: 'sub',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
