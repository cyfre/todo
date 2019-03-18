const util = require('../util.js');
const lists = require('../lists');

let items = [
    { _id: 1, list: 1, text: "grocery shopping", isCompleted: false },
    { _id: 2, list: 1, text: "take car in for service", isCompleted: false },
    { _id: 3, list: 1, text: "make app", isCompleted: false },
    { _id: 4, list: 2, text: "milk", isCompleted: false },
    { _id: 5, list: 2, text: "eggs", isCompleted: false },
    { _id: 6, list: 4, text: 'apples' },
    { _id: 7, list: 4, text: 'bananas' },
    { _id: 8, list: 4, text: 'oranges' },
    { _id: 9, list: 4, text: 'pears' },
    { _id: 10, list: 4, text: 'plums' },
    { _id: 11, list: 5, text: 'spinach' },
    { _id: 12, list: 5, text: 'broccoli' },
    { _id: 13, list: 5, text: 'cauliflower' },
    { _id: 14, list: 5, text: 'brussel sprouts' },
];
let lastId = 14;

async function getAll() {
    return items;
}

async function get(id) {
    return items.find(item => item._id === Number(id));
}

async function create(params) {
    let item = {
        _id: ++lastId,
        list: params.list,
        text: params.text
    };
    items.push(item);
    return item;
}

async function update(id, updatedItem) {
    if (id != updatedItem._id) throw Error('id mismatch');

    let item = items.find(item => item._id === updatedItem._id);
    util.update(item, updatedItem);
    return item;
}

async function remove(id) {
    let i = items.findIndex(item => item._id == id);
    if (i !== -1) {
        let [item] = items.splice(i, 1);
        let list = await lists.model.get(item.list);
        list.items.splice(list.items.findIndex(id => id == item._id), 1);
        lists.model.update(item.list, list);
    }
    return items;
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}