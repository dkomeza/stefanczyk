import express from "express";
import Auth from "./api/Auth";
import FS from "./api/FS";
import formidable from "formidable";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";

const context = {
  files: [],
  folders: [],
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./static"));
app.use(cookieParser());
app.set("views", "./views");
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main.handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/login", (req, res) => {
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      console.log(data);
      if (data) {
        res.redirect(301, "/");
        return;
      }
    });
  }
  res.render("Auth/Login.handlebars", { layout: "auth.handlebars" });
});

app.get("/signup", (req, res) => {
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        res.redirect(301, "/");
        return;
      }
    });
  }
  res.render("Auth/Signup.handlebars", { layout: "auth.handlebars" });
});

app.get("/", (req, res) => {
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        res.render("home.handlebars", { context });
        return;
      }
      res.redirect(301, "/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/files/*", (req, res) => {
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        res.render("home.handlebars", { context });
        return;
      }
      res.redirect(301, "/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  Auth.signup(username, password).then((data) => {
    if (!data.error) {
      res.cookie("username", data.username);
      res.cookie("publicKey", data.publicKey);
      res.redirect(500, "/");
      return;
    }
    res.redirect("/signup");
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  Auth.login(username, password).then((data) => {
    if (!data.error) {
      res.cookie("username", data.username);
      res.cookie("publicKey", data.publicKey);
      res.redirect(301, "/");
      return;
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/api/upload", function (req, res) {
  const { username, publicKey } = req.cookies;
  console.log(req);
  if (!(username && publicKey)) {
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
  }
  const form = formidable({
    keepExtensions: true,
    multiples: true,
    uploadDir: "./temp",
    maxFileSize: 5 * 1024 * 1024 * 1024,
  });
  form.parse(req, function (err, fields, files) {
    Auth.auth(username.toString(), publicKey.toString()).then((data) => {
      if (!data) {
        res.status(401);
        res.send({ error: "Unauthorized" });
        return;
      }
      const fileArr = [];
      console.log(files);
      if (files.files instanceof Array) {
        files.files.forEach((file) => {
          fileArr.push(file);
        });
      } else {
        fileArr.push(files.files);
      }
      FS.saveFiles(username.toString(), fileArr);
      res.redirect(301, "/");
    });
  });
});

app.post("/api/file", function (req, res) {
  const { username, publicKey, directory, filename } = req.body;
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    const { path } = FS.getFile(username, directory, filename);
    res.sendFile(path, { root: "./" });
  });
});

app.post("/api/createFolder", (req, res) => {
  const { username, publicKey, directory, foldername } = req.body;
  if (!foldername) {
    res.status(400);
    res.send({ error: "Folder name is required" });
    return;
  }
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    FS.createFolder(username, directory, foldername);
    res.send({ message: "Folder created" });
  });
});

app.post("/api/delete", function (req, res) {
  const { username, publicKey, directory, filename } = req.body;
  if (!filename) {
    res.status(400);
    res.send({ error: "Filename is required" });
    return;
  }
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    FS.delete(username, directory, filename);
    res.send({ message: "File deleted" });
  });
});

app.post("/api/rename", function (req, res) {
  const { username, publicKey, directory, oldname, newname } = req.body;
  if (!oldname || !newname || oldname === newname) {
    res.status(400);
    res.send({ error: "Oldname and newname are required" });
    return;
  }
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    FS.rename(username, directory, oldname, newname);
  });
});

app.post("/api/move", function (req, res) {
  const {
    username,
    publicKey,
    olddirectory,
    oldfilename,
    newdirectory,
    newfilename,
  } = req.body;
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    if (!(oldfilename && newfilename)) {
      if (oldfilename || newfilename) {
        res.sendStatus(400);
        res.send({ message: "Wrong filename" });
        return;
      }
      FS.move(username, olddirectory, undefined, newdirectory, undefined);
      return;
    }
    FS.move(username, olddirectory, oldfilename, newdirectory, newfilename);
  });
});

app.post("/api/copy", function (req, res) {
  const {
    username,
    publicKey,
    olddirectory,
    oldfilename,
    newdirectory,
    newfilename,
  } = req.body;
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    if (!(oldfilename && newfilename)) {
      if (oldfilename || newfilename) {
        res.sendStatus(400);
        res.send({ message: "Wrong filename" });
        return;
      }
      FS.copy(username, olddirectory, undefined, newdirectory, undefined);
      return;
    }
    FS.copy(username, olddirectory, oldfilename, newdirectory, newfilename);
  });
});

app.post("/api/info", function (req, res) {
  const { username, publicKey, directory, filename } = req.body;
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    const info = FS.info(username, directory, filename);
    console.log(info);
  });
});

app.get("/api/status", (req, res) => {
  res.send(JSON.stringify({ status: "API is running" }));
});

app.listen(3000, () => {});
