const voting = require('../controllers/voting-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/translations/:id/upvote').post(voting.upvotePhrase)
    app.route(app.rootUrl + '/translations/:id/downvote').post(voting.downvotePhrase)
    app.route(app.rootUrl + '/translations/:id/remove').delete(voting.removeVote)
    app.route(app.rootUrl + '/translations/votes').get(voting.userVoteList)
}
