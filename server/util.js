const express = require('express');

function update(target, source) {
    for (let prop in source) {
        if (prop in target) {
            target[prop] = source[prop];
        }
    }
}

function genModelRoutes(model) {
    const routes = express.Router();

    // route configs
    [{ 
        method: 'get', path: '/', 
        modelFunc: req => model.getAll()
    }, {
        method: 'get', path: '/:id', 
        modelFunc: req => model.get(req.params.id)
    }, {
        method: 'post', path: '/', 
        modelFunc: req => model.create(req.body)
    }, {
        method: 'put', path: '/:id', 
        modelFunc: req => model.update(req.params.id, req.body)
    }, {
        method: 'delete', path: '/:id', 
        modelFunc: req => model.remove(req.params.id)
    }].forEach(config => {
        routes[config.method](config.path, (req, res) => {
            config
                .modelFunc(req)
                .then(data => {
                    // console.log(req.method, req.originalUrl);
                    // console.log(data);
                    res.json(data);})
                .catch(error => res.json(error));
        });
    });

    return routes;
}

module.exports = {
    update,
    genModelRoutes
}