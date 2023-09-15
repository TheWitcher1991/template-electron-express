const { GLOBAL } = require('../../utils/config.js')

class baseController {

    static render (request, response) {

        response.render(GLOBAL.ROUTES.index.path, {
            title: 'Index',
            stylePath: GLOBAL.STYLE_PATH,
            apiPath: GLOBAL.API_PATH
        })

    }

}

module.exports = baseController