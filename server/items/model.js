const { ObjectID } = require('mongodb');
const util = require('../util.js');
const db = require('../db.js');
const lists = require('../lists');

async function getAll() {
    return db.collection('items').find().toArray();
}

async function get(id) {
    return db.collection('items').findOne({ _id: ObjectID(id)});
}

async function create(params) {
    let result = await db.collection('items').insertOne({
        list: ObjectID(params.list),
        text: params.text
    });
    return get(result.insertedId);
}

async function update(id, updatedItem) {
    updatedItem._id = ObjectID(updatedItem._id);
    updatedItem.list = ObjectID(updatedItem.list);
    console.log(updatedItem);
    return db.collection('items').replaceOne(
        { _id: ObjectID(id) },
        { $set: updatedItem }
    );
}

async function remove(id) {
    let item = await get(id);
    let list = await lists.model.get(item.list);
    list.items.splice(list.items.findIndex(id => id === item._id), 1);
    await lists.model.update(item.list, list);
    return db.collection('items').deleteOne({ _id: ObjectID(id)});
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}