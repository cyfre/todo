const util = require('../util');
const model = require('./model');

const routes = util.genModelRoutes(model);

module.exports = {
    routes,
    model
}