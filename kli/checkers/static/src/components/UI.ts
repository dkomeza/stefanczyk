export default class UI {
  app: HTMLElement;
  container: HTMLElement;
  constructor() {
    this.app = this.createApp();
    this.container = this.createContainer();
  }

  private createApp() {
    const app = document.createElement("div");
    app.classList.add("app");
    return app;
  }

  private createContainer() {
    const container = document.createElement("div");
    container.classList.add("game-container");
    return container;
  }

  createUI() {
    this.app.append(this.container);
    return this.app;
  }
  getContainer() {
    return this.container;
  }
}
