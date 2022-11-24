const express = require("express");
const app = express();

const formidable = require("formidable");
const hbs = require("express-handlebars");

const path = require("path");

let currentID = 1;
const filesArr = [];

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/static"));

app.get("/", function (req, res) {
  res.render("upload.hbs");
});

app.post("/upload", function (req, res) {
  let form = formidable({});
  form.keepExtensions = true;
  form.multiples = true;

  form.uploadDir = __dirname + "/static/upload/"; // folder do zapisu zdjęcia

  form.parse(req, function (err, fields, files) {
    console.log();
    if (files.files.length) {
      for (let i = 0; i < files.files.length; i++) {
        filesArr.push({
          id: currentID,
          name: files.files[i].name,
          size: files.files[i].size,
          type: files.files[i].type,
          path: files.files[i].path,
          time: new Date().getTime(),
        });
        currentID++;
      }
    } else {
      filesArr.push({
        id: currentID,
        name: files.files.name,
        size: files.files.size,
        type: files.files.type,
        path: files.files.path,
        time: new Date().getTime(),
      });
      currentID++;
    }
    res.redirect("/");
  });
});

app.get("/files", function (req, res) {
  res.render("files.hbs", { context: filesArr });
});

app.get("/download", function (req, res) {
  res.download(req.query.path);
});

app.get("/delete", function (req, res) {
  let id = req.query.id;
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id == id) filesArr.splice(i, 1);
  }
  res.redirect("/files");
});

app.get("/show", function (req, res) {
  res.sendFile(req.query.path);
});

app.get("/info", function (req, res) {
  let currentItem;
  filesArr.forEach((item) => {
    if (item.id == req.query.id) {
      currentItem = item;
    }
  });
  if (currentItem) {
    res.render("info.hbs", currentItem);
  } else {
    res.render("info.hbs");
  }
});

app.listen(3000, function () {
  console.log("Start");
});
