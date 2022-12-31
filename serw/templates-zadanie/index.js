const express = require("express");
const app = express();

const formidable = require("formidable");
const hbs = require("express-handlebars");

const path = require("path");

const filesTypesArr = [
  "3g2",
  "3ga",
  "3gp",
  "7z",
  "aa",
  "aac",
  "ac",
  "accdb",
  "accdt",
  "ace",
  "adn",
  "ai",
  "aif",
  "aifc",
  "aiff",
  "ait",
  "amr",
  "ani",
  "apk",
  "app",
  "applescript",
  "asax",
  "asc",
  "ascx",
  "asf",
  "ash",
  "ashx",
  "asm",
  "asmx",
  "asp",
  "aspx",
  "asx",
  "au",
  "aup",
  "avi",
  "axd",
  "aze",
  "bak",
  "bash",
  "bat",
  "bin",
  "blank",
  "bmp",
  "bowerrc",
  "bpg",
  "browser",
  "bz2",
  "bzempty",
  "c",
  "cab",
  "cad",
  "caf",
  "cal",
  "cd",
  "cdda",
  "cer",
  "cfg",
  "cfm",
  "cfml",
  "cgi",
  "chm",
  "class",
  "cmd",
  "code-workspace",
  "codekit",
  "coffee",
  "coffeelintignore",
  "com",
  "compile",
  "conf",
  "config",
  "cpp",
  "cptx",
  "cr2",
  "crdownload",
  "crt",
  "crypt",
  "cs",
  "csh",
  "cson",
  "csproj",
  "css",
  "csv",
  "cue",
  "cur",
  "dart",
  "dat",
  "data",
  "db",
  "dbf",
  "deb",
  "dgn",
  "dist",
  "diz",
  "dll",
  "dmg",
  "dng",
  "doc",
  "docb",
  "docm",
  "docx",
  "dot",
  "dotm",
  "dotx",
  "download",
  "dpj",
  "ds_store",
  "dsn",
  "dtd",
  "dwg",
  "dxf",
  "editorconfig",
  "el",
  "elf",
  "eml",
  "enc",
  "eot",
  "eps",
  "epub",
  "eslintignore",
  "exe",
  "f4v",
  "fax",
  "fb2",
  "fla",
  "flac",
  "flv",
  "fnt",
  "folder",
  "fon",
  "gadget",
  "gdp",
  "gem",
  "gif",
  "gitattributes",
  "gitignore",
  "go",
  "gpg",
  "gpl",
  "gradle",
  "gz",
  "h",
  "handlebars",
  "hbs",
  "heic",
  "hlp",
  "hs",
  "hsl",
  "htm",
  "html",
  "ibooks",
  "icns",
  "ico",
  "ics",
  "idx",
  "iff",
  "ifo",
  "image",
  "img",
  "iml",
  "in",
  "inc",
  "indd",
  "inf",
  "info",
  "ini",
  "inv",
  "iso",
  "j2",
  "jar",
  "java",
  "jpe",
  "jpeg",
  "jpg",
  "js",
  "json",
  "jsp",
  "jsx",
  "key",
  "kf8",
  "kmk",
  "ksh",
  "kt",
  "kts",
  "kup",
  "less",
  "lex",
  "licx",
  "lisp",
  "lit",
  "lnk",
  "lock",
  "log",
  "lua",
  "m",
  "m2v",
  "m3u",
  "m3u8",
  "m4",
  "m4a",
  "m4r",
  "m4v",
  "map",
  "master",
  "mc",
  "md",
  "mdb",
  "mdf",
  "me",
  "mi",
  "mid",
  "midi",
  "mk",
  "mkv",
  "mm",
  "mng",
  "mo",
  "mobi",
  "mod",
  "mov",
  "mp2",
  "mp3",
  "mp4",
  "mpa",
  "mpd",
  "mpe",
  "mpeg",
  "mpg",
  "mpga",
  "mpp",
  "mpt",
  "msg",
  "msi",
  "msu",
  "nef",
  "nes",
  "nfo",
  "nix",
  "npmignore",
  "ocx",
  "odb",
  "ods",
  "odt",
  "ogg",
  "ogv",
  "ost",
  "otf",
  "ott",
  "ova",
  "ovf",
  "p12",
  "p7b",
  "pages",
  "part",
  "pcd",
  "pdb",
  "pdf",
  "pem",
  "pfx",
  "pgp",
  "ph",
  "phar",
  "php",
  "pid",
  "pkg",
  "pl",
  "plist",
  "pm",
  "png",
  "po",
  "pom",
  "pot",
  "potx",
  "pps",
  "ppsx",
  "ppt",
  "pptm",
  "pptx",
  "prop",
  "ps",
  "ps1",
  "psd",
  "psp",
  "pst",
  "pub",
  "py",
  "pyc",
  "qt",
  "ra",
  "ram",
  "rar",
  "raw",
  "rb",
  "rdf",
  "rdl",
  "reg",
  "resx",
  "retry",
  "rm",
  "rom",
  "rpm",
  "rpt",
  "rsa",
  "rss",
  "rst",
  "rtf",
  "ru",
  "rub",
  "sass",
  "scss",
  "sdf",
  "sed",
  "sh",
  "sit",
  "sitemap",
  "skin",
  "sldm",
  "sldx",
  "sln",
  "sol",
  "sphinx",
  "sql",
  "sqlite",
  "step",
  "stl",
  "svg",
  "swd",
  "swf",
  "swift",
  "swp",
  "sys",
  "tar",
  "tax",
  "tcsh",
  "tex",
  "tfignore",
  "tga",
  "tgz",
  "tif",
  "tiff",
  "tmp",
  "tmx",
  "torrent",
  "tpl",
  "ts",
  "tsv",
  "ttf",
  "twig",
  "txt",
  "udf",
  "vb",
  "vbproj",
  "vbs",
  "vcd",
  "vcf",
  "vcs",
  "vdi",
  "vdx",
  "vmdk",
  "vob",
  "vox",
  "vscodeignore",
  "vsd",
  "vss",
  "vst",
  "vsx",
  "vtx",
  "war",
  "wav",
  "wbk",
  "webinfo",
  "webm",
  "webp",
  "wma",
  "wmf",
  "wmv",
  "woff",
  "woff2",
  "wps",
  "wsf",
  "xaml",
  "xcf",
  "xfl",
  "xlm",
  "xls",
  "xlsm",
  "xlsx",
  "xlt",
  "xltm",
  "xltx",
  "xml",
  "xpi",
  "xps",
  "xrb",
  "xsd",
  "xsl",
  "xspf",
  "xz",
  "yaml",
  "yml",
  "z",
  "zip",
  "zsh",
];

let currentID = 1;
const filesArr = [];

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", hbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/static"));

app.get("/", function (req, res) {
  res.render("upload.hbs");
});

app.get("/beta", function (req, res) {
  res.render("betaUpload.hbs", { layout: "beta.hbs" });
});

app.post("/upload", function (req, res) {
  let form = formidable({
    keepExtensions: true,
    uploadDir: path.join(__dirname, "static", "uploads"),
    multiples: true,
  });

  form.parse(req, function (err, fields, files) {
    if (files.files.length) {
      for (let i = 0; i < files.files.length; i++) {
        let size =
          files.files[i].size > 1_048_576
            ? (files.files[i].size / 1_048_576).toFixed(2) + " MB"
            : files.files[i].size > 1024
            ? (files.files[i].size / 1024).toFixed(2) + " KB"
            : files.files[i].size + " B";
        let ext = files.files[i].name.split(".").pop();
        let icon;
        if (filesTypesArr.includes(ext)) {
          icon = ext;
        } else {
          icon = "default";
        }

        filesArr.push({
          id: currentID,
          icon: icon,
          name: files.files[i].name,
          size: size,
          type: files.files[i].type,
          path: files.files[i].path,
          time: new Date().getTime(),
        });
        currentID++;
      }
    } else {
      let size =
        files.files.size > 1_048_576
          ? (files.files.size / 1_048_576).toFixed(2) + " MB"
          : files.files.size > 1024
          ? (files.files.size / 1024).toFixed(2) + " KB"
          : files.files.size + " B";
      let ext = files.files.name.split(".").pop();
      let icon;
      if (filesTypesArr.includes(ext)) {
        icon = ext;
      } else {
        icon = "default";
      }
      filesArr.push({
        id: currentID,
        icon: icon,
        name: files.files.name,
        size: size,
        type: files.files.type,
        path: files.files.path,
        time: new Date().getTime(),
      });
      currentID++;
    }
    res.redirect("/files");
  });
});

app.get("/files", function (req, res) {
  res.render("files.hbs", { context: filesArr });
});

app.get("/download", function (req, res) {
  filesArr.forEach((file) => {
    if (file.id == req.query.id) {
      res.download(file.path);
    }
  });
});

app.get("/delete", function (req, res) {
  let id = req.query.id;
  for (let i = 0; i < filesArr.length; i++) {
    if (filesArr[i].id == id) filesArr.splice(i, 1);
  }
  res.redirect("/files");
});

app.get("/deleteAll", function (req, res) {
  filesArr.splice(0, filesArr.length);
  res.redirect("/files");
})

app.get("/show", function (req, res) {
  filesArr.forEach((file) => {
    if (file.id == req.query.id) {
      res.sendFile(file.path);
    }
  });
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
