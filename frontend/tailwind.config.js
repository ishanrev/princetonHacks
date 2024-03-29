/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
        colors: {
            base: '#F1DDBF25',
            sub: {
                100: '#78938A15',
                200: '#78938A25',
                300: '#78938A50',
                400: '#78938A75',
                500: '#78938A',
            },
            primary: {
                100: '#92BA9210',
                200: '#92BA9225',
                300: '#92BA9250',
                400: '#92BA9275',
                500: '#92BA92',
            },
            dark: {
                100: '#525E7510',
                200: '#525E7525',
                300: '#525E7550',
                400: '#525E7588',
                500: '#525E75',
            },
            test: '#31254F',
            fa: '#fafafa'
        },
        boxShadow: {
            'full': '3px 3px 3px 3px rgba(0, 0, 0, 0.3)',
        }
    },
    maxWidth: {
        '1/2': '50%',
    }
},
  plugins: [],
}
