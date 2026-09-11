/** @type {import('tailwindcss').Config} */
module.exports = {
//      corePlugins: {
//     preflight: false,
//   },
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(188, 50, 58)", // customize as needed
            },
        },
    },
    plugins: [],
};
