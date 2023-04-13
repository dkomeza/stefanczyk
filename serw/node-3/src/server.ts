import slow from "slow.ts";
import TaskController from "./controller/TaskController.js";
import Task from "./models/Task.js";

const taskController = new TaskController();

const app = new slow();

const router = app.router!;

router.route("get", "/", (_req, res) => {
  res.send("super");
});

router.route("get", "/tasks", (_req, res) => {
  res.send("super");
  //   console.log("dupa");
  //   res.send(taskController.getTasks());
});

router.route("get", "/tasks/:id", (req, res) => {
  res.send(taskController.getTasks(req.params["id"] as number));
});

router.route("post", "/tasks", (req, res) => {
  taskController.addTask(req.body as unknown as Task);
  res.send({ status: "ok" });
});

router.route("delete", "/:id", (req, res) => {
  taskController.deleteTask(req.params["id"] as number);
  res.send({ status: "ok" });
});

app.listen(5000);
