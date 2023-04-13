import Task from "../models/Task.js";

interface updateData {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
}

export default class TaskController {
  tasks: Task[] = [];

  getTasks(id?: number) {
    if (id) {
      return this.tasks.filter((task) => (task.id = id));
    }
    return this.tasks;
  }

  updateTask(data: updateData) {
    if (!data["id"]) {
      return;
    }
    const task = this.tasks.find((task) => (task.id = data["id"]));
    if (task) {
      task.id = data["id"] ?? task.id;
      task.description = data["description"] ?? task.description;
      task.completed = data["completed"] ?? task.completed;
      task.title = data["title"] ?? task.title;
    }
  }

  addTask(data: Task) {
    this.tasks.push(new Task(data));
  }

  deleteTask(id: number) {
    this.tasks.filter((task) => task.id !== id);
  }
}
