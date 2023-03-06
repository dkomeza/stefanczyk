import express from "express";
import Auth from "./api/Auth";
import FS from "./api/FS";
import formidable from "formidable";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";

interface FileInterface {
  name: string;
  modified: Date;
  icon: string;
}

interface FolderInterface {
  name: string;
  path: string;
  size: number;
}

interface ContextInterface {
  files: FileInterface[];
  folders: FolderInterface[];
}

const context: ContextInterface = {
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
    partialsDir: "./views/partials",
    helpers: {
      shortenName: (name: string) => {
        if (name.length > 17) {
          return name.substring(0, 17) + "...";
        }
        return name;
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/login", (req, res) => {
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        res.redirect("/");
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
        res.redirect("/");
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
      res.redirect("/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/files", (req, res) => {
  const { username, publicKey } = req.cookies;
  const directory = req.url.split("/").splice(2).join("/");
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        const { files, folders } = FS.getFiles(username, directory);
        context.files = files;
        context.folders = folders;
        res.render("Content/files.handlebars", { context });
        return;
      }
      res.redirect("/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/files/*", (req, res) => {
  const { username, publicKey } = req.cookies;
  const directory = req.url.split("/").splice(2).join("/");
  let finaldir = directory.replace(/%20/g, " ");
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        const { files, folders } = FS.getFiles(username, finaldir);
        context.files = files;
        context.folders = folders;
        res.render("Content/files.handlebars", { context });
        return;
      }
      res.redirect("/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/editor/*", (req, res) => {
  const { username, publicKey } = req.cookies;
  const directory = req.url.split("/").splice(2).join("/");
  let finaldir = directory.split("?")[0].replace(/%20/g, " ");
  const { path } = req.query;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        const file = finaldir.split("/").pop();
        const { content } = FS.getFileContent(username, finaldir);
        const theme = {
          
        }
        const context = {
          content: content.split("\n"),
          path,
          file,
        };
        if (file?.endsWith(".png") || file?.endsWith(".jpg")) {
          res.render("Content/ImageEditor.handlebars", {
            context,
            layout: "editor.handlebars",
          });
          return;
        } else {
          res.render("Content/CodeEditor.handlebars", {
            context,
            layout: "editor.handlebars",
          });
          return;
        }
      }
      res.redirect("/login");
      return;
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/image", (req, res) => {
  const { directory } = req.body;
  console.log(directory);
  const { username, publicKey } = req.cookies;
  if (username && publicKey) {
    Auth.auth(username, publicKey).then((data) => {
      if (data) {
        const data = FS.getImage(username, directory);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      } else {
        return;
      }
    });
  }
});

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;
  Auth.signup(username, password).then((data) => {
    if (!data.error) {
      res.cookie("username", data.username);
      res.cookie("publicKey", data.publicKey);
      res.redirect("/");
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
      res.redirect("/");
      return;
    } else {
      res.redirect("/login");
    }
  });
});

app.post("/api/upload", function (req, res) {
  const { username, publicKey } = req.cookies;
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
      if (files.files instanceof Array) {
        files.files.forEach((file) => {
          fileArr.push(file);
        });
      } else {
        fileArr.push(files.files);
      }
      console.log(fileArr);
      FS.saveFiles(username.toString(), fileArr, fields.path.toString());
      res.send({ success: true });
    });
  });
});

app.post("/api/file", function (req, res) {
  const { username, publicKey, directory, filename } = req.body;
  let finaldir = directory.replace(/%20/g, " ");
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      res.status(401);
      res.send({ error: "Unauthorized" });
      return;
    }
    const { path } = FS.getFile(username, finaldir, filename);
    res.sendFile(path, { root: "./" });
  });
});

app.post("/api/createFolder", (req, res) => {
  const { username, publicKey } = req.cookies;
  const { directory, foldername } = req.body;
  let finaldir = directory.replace(/%20/g, " ");
  let finalfoldername = foldername.replace(/%20/g, " ");
  if (!foldername) {
    res.status(400);
    res.send({ error: "Folder name is required" });
    return;
  }
  Auth.auth(username, publicKey).then((data) => {
    if (data) {
      FS.createFolder(username, finaldir, finalfoldername);
      res.redirect("/files/" + finaldir);
      return;
    }
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
  });
});

app.post("/api/createFile", (req, res) => {
  const { username, publicKey } = req.cookies;
  const { directory, filename } = req.body;
  let finaldir = directory.replace(/%20/g, " ");
  let finalfilename = filename.replace(/%20/g, " ");
  if (!filename) {
    res.status(400);
    res.send({ error: "Folder name is required" });
    return;
  }
  Auth.auth(username, publicKey).then((data) => {
    if (data) {
      FS.createFile(username, finaldir, finalfilename);
      res.redirect("/files/" + finaldir);
      return;
    }
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
  });
});

app.post("/api/saveFile", (req, res) => {
  const { username, publicKey } = req.cookies;
  const { file, content } = req.body;
  let finalfile = file.replace(/%20/g, " ");
  Auth.auth(username, publicKey).then((data) => {
    if (data) {
      FS.saveFile(username, finalfile, content);
      res.send({ success: true });
      return;
    }
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
  });
});

app.post("/api/delete", function (req, res) {
  const { username, publicKey } = req.cookies;
  const { directory, files } = req.body;
  let finaldir = directory.replace(/%20/g, " ");
  if (files.length === 0) {
    res.status(400);
    res.send({ error: "Filename is required" });
    return;
  }
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      FS.delete(username, finaldir, files);
      res.send({ success: true });
      return;
    }
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
  });
});

app.post("/api/rename", function (req, res) {
  const { username, publicKey } = req.cookies;
  const { directory, oldname, newname } = req.body;
  let finaldir = directory.replace(/%20/g, " ");
  let finaloldname = oldname.replace(/%20/g, " ");
  let finalnewname = newname.replace(/%20/g, " ");
  if (!oldname || !newname || oldname === newname) {
    res.status(400);
    res.send({ error: "Oldname and newname are required" });
    return;
  }
  Auth.auth(username.toString(), publicKey.toString()).then((data) => {
    if (data) {
      FS.rename(username, finaldir, finaloldname, finalnewname);
      res.send({ success: true });
      return;
    }
    res.status(401);
    res.send({ error: "Unauthorized" });
    return;
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
  });
});

app.get("/api/status", (req, res) => {
  res.send(JSON.stringify({ status: "API is running" }));
});

app.listen(3001, () => {});
