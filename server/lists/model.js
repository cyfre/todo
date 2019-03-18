const util = require('../util.js');

let lists = [
    { _id: 1, name: "To Do", items: [1, 2, 3] },
    { _id: 2, name: "Shopping List", items: [4, 5] },
    { _id: 3, name: "Wishlist", items: [] },
    { _id: 4, name: 'Fruits', items: [ 6, 7, 8, 9, 10 ] },
    { _id: 5, name: 'Vegetables', items: [ 11, 12, 13, 14 ] },
];
let lastId = 8;

async function getAll() {
    return lists;
}

async function get(id) {
    return lists.find(list => list._id == id);
}

async function create(params) {
    let list = {
        _id: ++lastId,
        name: params.name,
        items: []
    };
    lists.push(list);
    return list;
}

async function update(id, updatedList) {
    if (id != updatedList._id) throw Error('id mismatch');

    let list = lists.find(list => list._id == updatedList._id);
    util.update(list, updatedList);
    return list;
}

async function remove(id) {
    let i = lists.findIndex(list => list._id == id);
    if (i !== -1) lists.splice(i, 1);
    return lists;
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}