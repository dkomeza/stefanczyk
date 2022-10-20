const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = 3000;

const context = {
  subject: "ćwiczenie 4 - dane z tablicy, select",
  fields: [{ name: "title" }, { name: "author" }, { name: "lang" }],
  books: [
    { title: "Lalka", author: "B Prus", lang: "PL" },
    { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
    { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
    { title: "Zamek", author: "F Kafka", lang: "CZ" },
  ],
};

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");

app.get("/index", function (req, res) {
  let count = context.fields.length;
  res.render("index04.hbs", { context: context, count: count });
});

app.get("/book", function (req, res) {
  if (req.query.select) {
    let newContext = { subject: context.subject };
    newContext.books = [];
    for (let i = 0; i < context.books.length; i++) {
      newContext.books.push({ content: context.books[i][req.query.select] });
    }
    res.render("index04_1.hbs", newContext);
  } else {
    let newContext = {
      subject: context.subject,
      error: ["Brak wybranej opcji"],
    };
    res.render("index04_1.hbs", newContext);
  }
});

app.use(express.static(__dirname + "/static"));
app.listen(PORT, () => {
  console.log("Server started");
});
