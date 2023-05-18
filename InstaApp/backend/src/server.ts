import slow from "../../../../../Github/slow/index.js";
import formidable from "formidable";

import ImageController from "./controllers/ImageController.js";
import UserController from "./controllers/UserController.js";
import { connectDB } from "./data/DB.js";

const app = new slow();
const router = app.router!;

connectDB();

router.route("get", "/status", (_req, res) => {
  res.send({ status: "ok" });
});

// images
router.route("post", "/images", (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: "./uploads",
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    const { album } = fields;
    const { image } = files;
    if (err) {
      res.statusCode = 500;
      res.send({ status: err });
      return;
    }
    if (!album) {
      res.statusCode = 400;
      res.send({ status: "No album defined" });
      return;
    }
    if (!image) {
      res.statusCode = 400;
      res.send({ status: "No image attached" });
      return;
    }

    const imageArray = [] as formidable.File[];
    if (image instanceof Array) {
      imageArray.push(...image);
    } else {
      imageArray.push(image!);
    }

    ImageController.saveImage(album.toString(), imageArray);
    res.send({ status: "ok" });
  });
});

router.route("delete", "/images", (_req, res) => {
  ImageController.removeAllImages();
  res.send({ status: "ok" });
});

// users
router.route("post", "/users/register", async (req, res) => {
  try {
    const { username, email, password, name, surname } = req.body;

    if (!(username && email && password && name && surname)) {
      res.statusCode = 400;
      res.send({ status: "All inputs are required" });
      return;
    }

    const result = await UserController.registerUser({
      username: username.toString(),
      email: email.toString(),
      password: password.toString(),
      name: name.toString(),
      surname: surname.toString(),
    });

    if (result.ok) {
      res.send({ status: "ok", token: result.token });
    } else {
      res.statusCode = 409;
      res.send({ status: result.status });
    }
  } catch (error) {
    res.statusCode = 500;
    res.send({ status: error });
  }
});
router.route("post", "/users/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!(login && password)) {
      res.statusCode = 400;
      res.send({ status: "All inputs are required" });
      return;
    }

    const result = await UserController.loginUser({
      login: login.toString(),
      password: password.toString(),
    });

    if (result.ok) {
      res.send({ status: "ok", token: result.token });
    } else {
      res.statusCode = 401;
      res.send({ status: result.status });
    }
  } catch (error) {
    res.statusCode = 500;
    res.send({ status: error });
  }
});
router.route("get", "/users", async (_req, res) => {
  const users = await UserController.getAllUsers();

  res.send({ status: "ok", users });
});

// tf is this
process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});
process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});

app.listen();
