const { ObjectID } = require('mongodb');
const util = require('../util.js');
const db = require('../db.js');

async function getAll() {
    return db.collection('lists').find().toArray();
}

async function get(id) {
    return db.collection('lists').findOne({ _id: ObjectID(id)});
}

async function create(params) {
    let result = await db.collection('lists').insertOne({
        name: params.name,
        items: []
    });
    return get(result.insertedId);
}

async function update(id, updatedList) {
    updatedList._id = ObjectID(updatedList._id);
    updatedList.items = updatedList.items.map(id => ObjectID(id));
    return db.collection('lists').replaceOne(
        { _id: ObjectID(id) },
        { $set: updatedList }
    );
}

async function remove(id) {
    await db.collection('items').deleteMany({ list: ObjectID(id) });
    return db.collection('lists').deleteOne({ _id: ObjectID(id) });
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}