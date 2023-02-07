"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("./api/Auth"));
const FS_1 = __importDefault(require("./api/FS"));
const formidable_1 = __importDefault(require("formidable"));
const express_handlebars_1 = require("express-handlebars");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const context = {
    files: [],
    folders: [],
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("./static"));
app.use((0, cookie_parser_1.default)());
app.set("views", "./views");
app.engine("handlebars", (0, express_handlebars_1.engine)({
    defaultLayout: "main.handlebars",
    partialsDir: "./views/partials",
    helpers: {
        shortenName: (name) => {
            if (name.length > 17) {
                return name.substring(0, 17) + "...";
            }
            return name;
        },
    },
}));
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/login", (req, res) => {
    const { username, publicKey } = req.cookies;
    if (username && publicKey) {
        Auth_1.default.auth(username, publicKey).then((data) => {
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
        Auth_1.default.auth(username, publicKey).then((data) => {
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
        Auth_1.default.auth(username, publicKey).then((data) => {
            if (data) {
                res.render("home.handlebars", { context });
                return;
            }
            res.redirect("/login");
            return;
        });
    }
    else {
        res.redirect("/login");
    }
});
app.get("/files", (req, res) => {
    const { username, publicKey } = req.cookies;
    const directory = req.url.split("/").splice(2).join("/");
    if (username && publicKey) {
        Auth_1.default.auth(username, publicKey).then((data) => {
            if (data) {
                const { files, folders } = FS_1.default.getFiles(username, directory);
                context.files = files;
                context.folders = folders;
                res.render("Content/files.handlebars", { context });
                return;
            }
            res.redirect("/login");
            return;
        });
    }
    else {
        res.redirect("/login");
    }
});
app.get("/files/*", (req, res) => {
    const { username, publicKey } = req.cookies;
    const directory = req.url.split("/").splice(2).join("/");
    let finaldir = directory.replace(/%20/g, " ");
    if (username && publicKey) {
        Auth_1.default.auth(username, publicKey).then((data) => {
            if (data) {
                const { files, folders } = FS_1.default.getFiles(username, finaldir);
                context.files = files;
                context.folders = folders;
                res.render("Content/files.handlebars", { context });
                return;
            }
            res.redirect("/login");
            return;
        });
    }
    else {
        res.redirect("/login");
    }
});
app.post("/api/signup", (req, res) => {
    const { username, password } = req.body;
    Auth_1.default.signup(username, password).then((data) => {
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
    Auth_1.default.login(username, password).then((data) => {
        if (!data.error) {
            res.cookie("username", data.username);
            res.cookie("publicKey", data.publicKey);
            res.redirect("/");
            return;
        }
        else {
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
    const form = (0, formidable_1.default)({
        keepExtensions: true,
        multiples: true,
        uploadDir: "./temp",
        maxFileSize: 5 * 1024 * 1024 * 1024,
    });
    form.parse(req, function (err, fields, files) {
        Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
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
            }
            else {
                fileArr.push(files.files);
            }
            FS_1.default.saveFiles(username.toString(), fileArr, fields.path.toString());
            res.send({ success: true });
        });
    });
});
app.post("/api/file", function (req, res) {
    const { username, publicKey, directory, filename } = req.body;
    let finaldir = directory.replace(/%20/g, " ");
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
        if (data) {
            res.status(401);
            res.send({ error: "Unauthorized" });
            return;
        }
        const { path } = FS_1.default.getFile(username, finaldir, filename);
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
    Auth_1.default.auth(username, publicKey).then((data) => {
        if (data) {
            FS_1.default.createFolder(username, finaldir, finalfoldername);
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
    Auth_1.default.auth(username, publicKey).then((data) => {
        if (data) {
            FS_1.default.createFile(username, finaldir, finalfilename);
            res.redirect("/files/" + finaldir);
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
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
        if (data) {
            FS_1.default.delete(username, finaldir, files);
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
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
        if (data) {
            FS_1.default.rename(username, finaldir, finaloldname, finalnewname);
            res.send({ success: true });
            return;
        }
        res.status(401);
        res.send({ error: "Unauthorized" });
        return;
    });
});
app.post("/api/move", function (req, res) {
    const { username, publicKey, olddirectory, oldfilename, newdirectory, newfilename, } = req.body;
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
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
            FS_1.default.move(username, olddirectory, undefined, newdirectory, undefined);
            return;
        }
        FS_1.default.move(username, olddirectory, oldfilename, newdirectory, newfilename);
    });
});
app.post("/api/copy", function (req, res) {
    const { username, publicKey, olddirectory, oldfilename, newdirectory, newfilename, } = req.body;
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
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
            FS_1.default.copy(username, olddirectory, undefined, newdirectory, undefined);
            return;
        }
        FS_1.default.copy(username, olddirectory, oldfilename, newdirectory, newfilename);
    });
});
app.post("/api/info", function (req, res) {
    const { username, publicKey, directory, filename } = req.body;
    Auth_1.default.auth(username.toString(), publicKey.toString()).then((data) => {
        if (data) {
            res.status(401);
            res.send({ error: "Unauthorized" });
            return;
        }
        const info = FS_1.default.info(username, directory, filename);
    });
});
app.get("/api/status", (req, res) => {
    res.send(JSON.stringify({ status: "API is running" }));
});
app.listen(3001, () => { });
