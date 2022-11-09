const express = require("express");
const app = express();
const port = 3000;

const hbs = require("express-handlebars");
const path = require("path");

const context = require("./data/data.json");

let categories = [];
let letters = [];

app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    defaultLayout: "main.hbs",
    extname: "hbs",
    partialsDir: "views/partials",
    helpers: {
      getPrice: function (price) {
        return price + " $";
      },
      getCategories: function (category) {
        if (categories.indexOf(category) >= 0) {
          return false;
        } else {
          categories.push(category);
          return true;
        }
      },
      getLetters: function (title) {
        let letter = title.split("").shift();
        console.log(letter);
        if (letters.indexOf(letter) >= 0) {
          return false;
        } else {
          letters.push(letter);
          return true;
        }
      },
    },
  })
);
app.set("view engine", "hbs");

app.get("/", function (req, res) {
  res.render("index.hbs", context);
});

app.use(express.static(__dirname + "/static"));
app.listen(port, () => {
  console.log("Start na porcie: " + port);
});
