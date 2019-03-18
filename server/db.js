const { MongoClient } = require('mongodb');

let db;
async function connect(db) {
    MongoClient.connect('mongodb://localhost/' + db, { useNewUrlParser: true }).then(connection => {
        db = connection.db(db);
        return db;
    });
}

function collection(name) {
    return db.collection(name);
}

module.exports = {
    connect,
    collection
}