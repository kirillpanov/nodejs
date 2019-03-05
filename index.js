const express = require("express");
const first = require("lodash/first");
const bodyParser = require("body-parser");
const app = express();

const newsMongoose = require("./mongoose/news.mongoose");

newsMongoose.connectDataBase();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 * return array of news
 *
 * response: { news: [ { id: text } , {id: text} ] }
 */
app.get("/news", (_, res) => {
    newsMongoose.getNews().then(newsItems => res.send({ news: newsItems }));
});

/*
 * return news item by its id
 *
 * response: { newsItem: { id: text, ... } }
 */
app.get("/news/:id", (req, res) => {
    newsMongoose
        .getNews(req.params.id)
        .then(items => res.send({ newsItem: first(items) }));
});

/*
 * post array of news
 *
 * example of object to send: { "items": [ { "title": "Some title 3", "content": "Some content 3" }, { "title": "Some title 4", "content": "Some content 4" } ]}
 */
app.post("/news", (req, res) => {
    newsMongoose
        .postNews(req.body && req.body.items)
        .then(() => res.send("news were posted successfully"));
});

/*
 * add items
 *
 * example of object to send: { "newsItem": { "title": "Some title 1", "content": "Some content 1" } }
 */
app.put("/news", (req, res) => {
    newsMongoose.addItem(req.body && req.body.newsItem);
});

/*
 * delete item by id
 */
app.delete("/news/:id", (req, res) => {
    newsMongoose
        .deleteById(req.params.id)
        .then(() => res.send(`items with id ${req.params.id} was deleted`))
        .catch(console.error);
});

/*
 * delete item by id
 */
app.delete("/news", (_, res) => {
    newsMongoose
        .deleteAll(res)
        .then(() => res.send("all news were deleted"))
        .catch(console.error);
});

app.listen(3000, () => console.log("Application started. Open localhost:3000"));
