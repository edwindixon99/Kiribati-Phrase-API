const requested = require('../controllers/requested-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/requests').post(requested.insertRequest)
    app.route(app.rootUrl + '/requests/english').get(requested.getRequestedEnglishWords)
    app.route(app.rootUrl + '/requests/kiribati').get(requested.getRequestedKiribatiWords)
}
