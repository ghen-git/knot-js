/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/*.{html,js}"],
    theme: {
        extend: 
        {
            colors: {
                'bp':
                {
                    '100': '#EAF0F2',
                    '200': '#B8C9D7',
                    '300': '#A6B2C2',
                    '400': '#929DAB',
                    '500': '#7E8493',
                    '600': '#51515E',
                    '700': '#3C3B44'
                }
            },
            borderWidth: {
                '1': '1px'
            }
        }
    },
    plugins: [],
}
