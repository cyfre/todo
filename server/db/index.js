const { MongoClient } = require('mongodb');

let client;

function connect(url, callback) {
    if (client) return callback();

    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, mongo_client) => {
        if (err) {
            callback(err);
        } else {
            client = mongo_client
            callback();
        }
    });
}

function get() {
    return client.db();
}

function collection(name) {
    return client.db().collection(name);
}

function close(callback) {
    if (client) {
        client.close(err => {
            client = null;
            callback(err);
        });
    }
}

module.exports = {
    connect,
    get,
    collection,
    close
}