let GLOBAL = {

    PORT: process.env.PORT || 8080,

    API_BASE_URL: `http://localhost:${this.PORT}/`,

    ROUTES: {
        index: {
            url: '/',
            path: 'index' // index.ejs
        },
    },

    // Regarding the folder "dist"
    STYLE_PATH: './public/static/style.bundle.css',
    API_PATH: './api.js',

    SESSION_COOKIE_OPTION: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },

}

module.exports = {
    GLOBAL
}