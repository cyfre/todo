let users = [
    { _id: 1, name: "Alice", lists: [1] },
];

async function getAll() {
    return users;
}

async function get(id) {
    return users.find(user => user._id === Number(id));
}

async function create(params) {
    let user = {
        _id: users.length + 1,
        name: params.name,
        lists: []
    };
    users.push(user);
    return user;
}

module.exports = {
    getAll,
    get,
    create
}