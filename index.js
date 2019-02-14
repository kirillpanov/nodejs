const express = require("express");
const cors = require("cors");
const fs = require("fs");
const Promise = require("bluebird");
const toPairs = require("lodash/toPairs");
const fromPairs = require("lodash/fromPairs");
const map = require("lodash/map");
const assign = require("lodash/assign");
const unset = require("lodash/unset");
const bodyParser = require("body-parser");

const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
 * task 2
 *
 * entities (any route, any request)
 */
// app.use("*", (req, res) => {
//     readFileAsync("./news.json", "utf-8")
//         .then(content => res.send(content))
//         .catch(console.error);
// });

/*
 * return array of news
 *
 * response: { news: [ { id: text } , {id: text} ] }
 */
app.get("/news", cors(), (req, res) => {
    readFileAsync("./news.json", "utf-8")
        .then(content => JSON.parse(content))
        .tap(() => console.log(`Got request for getting news`))
        .then(data =>
            res.send({ news: map(toPairs(data), item => fromPairs([item])) })
        )
        .catch(console.error);
});

/*
 * return news item by its id
 *
 * response: { newsItem: { id: text } }
 */
app.get("/news/:id", cors(), (req, res) => {
    let id;
    readFileAsync("./news.json", "utf-8")
        .then(content => JSON.parse(content))
        .tap(() => (id = req.params.id))
        .tap(() => console.log(`Got request with id:${id}`))
        .then(data => res.send({ newsItem: { [id]: data[id] } }))
        .catch(console.error);
});

/*
 * override news
 *
 * example of object to send: { "id1": "Other news item1", "id2": "Other news item2" }
 */
app.post("/news", cors(), (req, res) => {
    writeFileAsync("./news.json", JSON.stringify(req.body))
        .tap(() => console.log(req.body))
        .then(() => res.send("news were added"))
        .catch(console.error);
});

/*
 * add items
 *
 * example of object to send: { "newItem": "Other news item3" }
 */
app.put("/news/:id", cors(), (req, res) => {
    readFileAsync("./news.json", "utf-8")
        .then(content => JSON.parse(content))
        .tap(() => console.log(req.body))
        .then(data =>
            assign({}, data, { [req.params.id]: req.body && req.body.newItem })
        )
        .then(data => writeFileAsync("./news.json", JSON.stringify(data)))
        .then(() => res.send("news item was added"))
        .catch(console.error);
});

/*
 * delete items
 *
 */
app.delete("/news/:id", cors(), (req, res) => {
    readFileAsync("./news.json", "utf-8")
        .then(content => JSON.parse(content))
        .then(data => {
            unset(data, req.params.id);
            return data;
        })
        .then(data => writeFileAsync("./news.json", JSON.stringify(data)))
        .then(() => res.send(`news item with id:${req.params.id} was deleted`))
        .catch(console.error);
});

app.listen(3000, () => console.log("Application started. Open localhost:3000"));
