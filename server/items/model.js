const { ObjectID } = require('mongodb');
const util = require('../util');
const db = require('../db');
const lists = require('../lists');

const name = 'items';

const get = util.genGet(name);

async function create(params) {
    let result = await db.collection(name).insertOne({
        list: ObjectID(params.list),
        text: params.text
    });
    return get(result.insertedId);
}

async function update(id, updatedItem) {
    updatedItem._id = ObjectID(updatedItem._id);
    updatedItem.list = ObjectID(updatedItem.list);

    let list = await lists.model.get(updatedItem.list);
    if (updatedItem.isCompleted) {
        list.completed.push(updatedItem._id);
    } else {
        list.completed = list.completed.filter(id => !id.equals(updatedItem._id));
    }
    await lists.model.update(list._id, list);

    return db.collection(name).replaceOne(
        { _id: ObjectID(id) },
        { $set: updatedItem }
    );
}

async function remove(id) {
    let item = await get(id);
    let list = await lists.model.get(item.list);
    list.items = list.items.filter(id => !id.equals(item._id));
    list.completed = list.completed.filter(id => !id.equals(item._id));
    await lists.model.update(list._id, list);
    return db.collection(name).deleteOne({ _id: ObjectID(id)});
}

module.exports = {
    name,
    get,
    create,
    update,
    remove
}