const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.static("static"));
app.use(express.static("static/pages"));

app.get("/pages", function (req, res) {
  fs.readdir(
    `${__dirname}/static/pages`,
    { withFileTypes: true },
    function (err, files) {
      if (err) {
        return console.log(err);
      }
      res.setHeader("content-type", "application/json");
      const filesNames = files
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);
      res.send(filesNames);
    }
  );
});

app.listen(PORT, () => {
  console.log("Start serwera");
});
