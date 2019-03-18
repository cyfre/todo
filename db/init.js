const { MongoClient, ObjectID } = require('mongodb');

let client = new MongoClient('mongodb://localhost/todo', { useNewUrlParser: true });
client.connect(async (err) => {
    let db = client.db('todo');

    await db.collection('items').deleteMany({});
    await db.collection('lists').deleteMany({});

    let items = [
        { text: "grocery shopping" },
        { text: "get haircut" },
        { text: "take car in for service" },
        { text: "make app" },
        { text: "milk" },
        { text: "eggs" },
        { text: 'apples' },
        { text: 'bananas' },
        { text: 'oranges' },
        { text: 'pears' },
        { text: 'plums' },
        { text: 'spinach' },
        { text: 'broccoli' },
        { text: 'cauliflower' },
        { text: 'brussel sprouts' },
    ];
    items.forEach((item, i) => item._id = ObjectID(i));

    let lists = [
        { name: "To Do", items: [0, 1, 2, 3] },
        { name: "Shopping List", items: [4, 5] },
        { name: "Wishlist", items: [] },
        { name: 'Fruits', items: [6, 7, 8, 9, 10] },
        { name: 'Vegetables', items: [11, 12, 13, 14] },
    ];
    lists.forEach((list, i) => {
        list._id = ObjectID(i)
        list.items.forEach(i => items[i].list = list._id);
        list.items = list.items.map(i => items[i]._id);
    });

    await db.collection('items').insertMany(items);
    await db.collection('lists').insertMany(lists);

    client.close();
});