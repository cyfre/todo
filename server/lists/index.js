const util = require('../util.js');
const model = require('./model');

const routes = util.genModelRoutes(model);

module.exports = {
    routes,
    model
}