const express = require("express");
const app = express();
const PORT = 3000;

const data = require("./app/data/tanks.json");

app.use(express.static("app/"));

app.get("/data", function (req, res) {
  if (data[req.query.tank]) {
    res.send(JSON.stringify(data[req.query.tank]));
  }
});

app.listen(PORT, function () {
  console.log("Supcio");
});
