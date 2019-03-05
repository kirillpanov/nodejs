const mongoose = require("mongoose");
const assign = require("lodash/assign");

const db = mongoose.connection;
const newsSchema = new mongoose.Schema({
    id: String,
    title: String,
    content: String
});
const NewsItem = mongoose.model("NewsItem", newsSchema);

const connectDataBase = () => {
    mongoose.connect("mongodb://localhost/test", {
        useNewUrlParser: true
    });
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("data base opened"));
};

const counter = () => {
    let start = 0;
    return () => start++;
};
const count = counter();

const getNews = id => {
    let query;

    if (id) {
        query = { id };
    }

    return NewsItem.find(query);
};

const addItem = item => {
    const itemToAdd = assign({}, item, { id: `id${count()}` });
    const newsItem = new NewsItem(itemToAdd);
    newsItem.save((err, item) => console.log(`item ${item} was saved`));
};

const postNews = news => {
    news.forEach(addItem);
};

const deleteAll = () => NewsItem.deleteMany({});

const deleteById = id => NewsItem.deleteOne({ id: id });

module.exports.connectDataBase = connectDataBase;
module.exports.getNews = getNews;
module.exports.addItem = addItem;
module.exports.postNews = postNews;
module.exports.deleteAll = deleteAll;
module.exports.deleteById = deleteById;
