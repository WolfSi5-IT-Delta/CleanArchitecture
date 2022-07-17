const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // mode: 'jit',

  content: [
    "./resources/**/*.blade.php",
    // "./resources/**/*.js",
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    // './resources/views/**/*.blade.php',
    './resources/**/*.{js,jsx}',
    // './resources/**/*.svelte',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      'xs':{'min':'320px','max':'545px'},
      ...defaultTheme.screens
    }
  },

  // variants: {
  //   extend: {
  //     opacity: ['disabled'],
  //   },
  // },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')
  ],
};
