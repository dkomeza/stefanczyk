import express from "express";
import hbs from "express-handlebars";
import formidable from "formidable";
import * as path from "path";

import { uploadData } from "./modules/fileSystem.js";

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("views", path.join("views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");

app.use(express.static("./static"));

app.get("/", function (req, res) {
  res.render("upload.hbs");
});

app.post("/upload", function (req, res) {
  // console.log(req);
  let form = formidable({
    keepExtensions: true,
    uploadDir: "./uploads",
    multiples: true,
  });
  form.parse(req, function (err, fields, files) {
    res.send(uploadData(files.files));
  });
});

app.get("/files", function (req, res) {
  res.render("files.hbs");
});

app.listen(3000, function () {
  console.log("Start");
});
