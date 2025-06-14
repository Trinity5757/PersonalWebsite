module.exports =
{
    //class will allow the user to toggle the theme and media will allow the application to pull from the system settings
    darkMode: 'class',
    // Plugins tell the program to process Tailwind features first and then run the auto prefixer to optimize the browser compalibility
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)'],
                heading: ['var(--headerFont)'],
            },
            colors: {
                forrest: 'var(--forrest)',
                mocha: 'var(--mocha)',
                cream: 'var(--cream)',
                blush: 'var(--blush)',
                white: 'var(--white)',
                black: 'var(--black)',
            },
        },
    },
};