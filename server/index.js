const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

let user_id = 1;

// Modules
const users = require('./users');
const lists = require('./lists');
const items = require('./items');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: "a secret",
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    req.session.userId = user_id;
    next();
});

app.use((err, req, res, next) => {
    console.log(err);
    next();
});
app.use((req, res, next) => {
    console.log(String(Date.now()), req.method, req.originalUrl, req.session.userId);
    next();
});

app.use('/api/users', users.routes);
app.use('/api/lists', lists.routes);
app.use('/api/items', items.routes);

app.use('/public', express.static('public'));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve('./public/index.html'));
// });

// start server
db.connect('mongodb://localhost/todo', () => {
    app.listen(5000, () => {
        console.log('App started on port 5000');
    });
});
