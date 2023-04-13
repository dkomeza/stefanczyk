import Task from "../models/Task.js";
export default class TaskController {
    tasks = [];
    getTasks(id) {
        if (id) {
            return this.tasks.filter((task) => (task.id = id));
        }
        return this.tasks;
    }
    updateTask(data) {
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
    addTask(data) {
        this.tasks.push(new Task(data));
    }
    deleteTask(id) {
        this.tasks.filter((task) => task.id !== id);
    }
}
