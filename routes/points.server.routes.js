const points = require('../controllers/points.server.controller');
module.exports = function(app) {
    app.route(app.rootUrl +'/points/:id')
        .get(petitions.pointCount);
};
