const voting = require('../controllers/voting-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/translations/:id/upvote').post(voting.upvotePhrase)
}
