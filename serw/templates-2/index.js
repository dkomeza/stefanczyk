const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const context1 = require("./data/data1.json");
const context2 = require("./data/data2.json");
const context3 = require("./data/data3.json");
const context4 = require("./data/data4.json");
const context5 = require("./data/data5.json");

const inputs = [];

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    defaultLayout: "main.hbs",
    extname: ".hbs",
    partialsDir: "views/partials",
    helpers: {
      shortTitle: function (title) {
        return title.length <= 20 ? title : `${title.substring(0, 20)}...`;
      },
      splitBoi: function (string) {
        return string
          .split(" ")
          .map((item) => item.split("").join("-"))
          .join(" === ");
      },
    },
  })
);
app.set("view engine", "hbs");

app.get("/1", function (req, res) {
  res.render("index1.hbs", context1);
});

app.get("/2", function (req, res) {
  res.render("index2.hbs", context2);
});

app.get("/3", function (req, res) {
  res.render("index3.hbs", context3);
});
app.get("/4", function (req, res) {
  if (req.query.input) {
    inputs.push(req.query.input);
    res.render("index4.hbs", { context: context4, input: inputs });
  }
  res.render("index4.hbs", { context: context4 });
});

app.get("/5", function (req, res) {
  res.render("index5.hbs", context5);
});

app.use(express.static(__dirname + "/static"));
app.listen(PORT, () => {
  console.log("Server started");
});
