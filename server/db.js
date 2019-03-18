const { MongoClient } = require('mongodb');

let client;

function connect(url, callback) {
    if (client) return callback(client);

    MongoClient.connect(url, { useNewUrlParser: true }, (err, mongo_client) => {
        client = mongo_client
        callback(client);
    });
}

function collection(name) {
    return client.db().collection(name);
}

module.exports = {
    connect,
    collection
}