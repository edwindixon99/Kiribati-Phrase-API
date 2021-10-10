const express = require('express')
const cors = require('cors');

module.exports = function () {
    // INITIALISE EXPRESS
    const app = express()
    app.rootUrl = '/api/v1'

    // MIDDLEWARE
    app.use(express.json())

    app.use(express.raw({ type: 'image/*', limit: '200mb' }))

    app.use( cors ({
        origin: "*"
        })
    );

    // ROUTES
    // require('../app/routes/backdoor.routes')(app);
    require('../app/routes/phrases-routes')(app)
    require('../app/routes/users-routes')(app)
    require('../app/routes/voting-routes')(app)

    return app
}
