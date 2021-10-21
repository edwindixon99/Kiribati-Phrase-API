const phrases = require('../controllers/phrases-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/kiribati').get(phrases.getKiriPhrases)
    // app.route(app.rootUrl + '/kiribati/:word').get(phrases.getKiriPhrase)
    // app.route(app.rootUrl + '/translations/:id').get(phrases.getTranslation)
    app.route(app.rootUrl + '/english').get(phrases.getEngPhrases)
    // app.route(app.rootUrl + '/english/:word').get(phrases.getEngPhrase)
    app.route(app.rootUrl + '/translations/recent').get(phrases.getRecent)
    app.route(app.rootUrl + '/:lang/:word').post(phrases.addPhrase)
    app.route(app.rootUrl + '/translations/:id').delete(phrases.deleteTranslation)
}
