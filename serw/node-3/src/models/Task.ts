export default class Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  constructor(data: Task) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.completed = data.completed;
  }
}
