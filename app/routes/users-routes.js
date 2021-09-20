const users = require('../controllers/users-controller')

module.exports = function (app) {
    app.route(app.rootUrl + '/tokensignin').post(users.oauthSignIn)
//     app.route(app.rootUrl + '/register').post(users.register)
//     app.route(app.rootUrl + '/login').post(users.login)
//     app.route(app.rootUrl + '/login').post(users.logout)
}