const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({ defaultLayout: "index.hbs" }));
app.set("view engine", "hbs");

app.get("/", function(req, res) {
    res.render('index.hbs')
})

app.listen(PORT, () => {
  console.log("Server started");
});
