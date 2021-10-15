const phrases = require('../controllers/phrases-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/kiribati').get(phrases.getKiriPhrases)
    // app.route(app.rootUrl + '/kiribati/:word').get(phrases.getKiriPhrase)
    // app.route(app.rootUrl + '/translations/:id').get(phrases.getTranslation)
    app.route(app.rootUrl + '/english').get(phrases.getEngPhrases)
    // app.route(app.rootUrl + '/english/:word').get(phrases.getEngPhrase)
}
