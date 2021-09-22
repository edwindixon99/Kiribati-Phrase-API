const express = require('express')

module.exports = function () {
    // INITIALISE EXPRESS
    const app = express()
    app.rootUrl = '/api/v1'

    // MIDDLEWARE
    app.use(express.json())

    app.use(express.raw({ type: 'image/*', limit: '200mb' }))

    // ROUTES
    // require('../app/routes/backdoor.routes')(app);
    require('../app/routes/phrases-routes')(app)
    require('../app/routes/users-routes')(app)
    require('../app/routes/voting-routes')(app)

    return app
}
