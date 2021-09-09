const questions = require('../controllers/phrases-controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/kiribati')
        .get(questions.getKiriPhrases);

    app.route(app.rootUrl + '/english')
        .get(questions.getEngPhrases);



};