export default class Task {
    id;
    title;
    description;
    completed;
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.completed = data.completed;
    }
}
