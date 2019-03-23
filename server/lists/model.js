const { ObjectID } = require('mongodb');
const util = require('../util');
const db = require('../db');

const name = 'lists';

const get = util.genGet(name);

async function create(params) {
    let result = await db.collection(name).insertOne({
        name: params.name,
        items: [],
        completed: []
    });
    return get(result.insertedId);
}

async function update(id, updatedList) {
    updatedList._id = ObjectID(updatedList._id);
    updatedList.items = updatedList.items.map(id => ObjectID(id));
    updatedList.completed = updatedList.completed.map(id => ObjectID(id));

    return db.collection(name).replaceOne(
        { _id: ObjectID(id) },
        { $set: updatedList }
    );
}

async function remove(id) {
    await db.collection('items').deleteMany({ list: ObjectID(id) });
    return db.collection(name).deleteOne({ _id: ObjectID(id) });
}

module.exports = {
    name,
    get,
    create,
    update,
    remove
}