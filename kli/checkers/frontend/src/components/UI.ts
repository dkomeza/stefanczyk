export default class UI {
  app: HTMLElement;
  container: HTMLElement;
  menu: HTMLElement;
  constructor() {
    this.app = this.createApp();
    this.container = this.createContainer();
    this.menu = this.createMenu();
  }

  private createApp() {
    const app = document.createElement("div");
    app.classList.add("app");
    return app;
  }

  private createMenu() {
    const menu = document.createElement("div");
    menu.classList.add("menu-container");

    const name_input = document.createElement("input");
    name_input.setAttribute("placeholder", "username");
    const submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.innerText = "Log in";

    menu.append(name_input);
    menu.append(submit);

    return menu;
  }

  private createContainer() {
    const container = document.createElement("div");
    container.classList.add("game-container");
    return container;
  }

  createUI() {
    this.app.append(this.menu);
    this.app.append(this.container);

    return this.app;
  }
  getContainer() {
    return this.container;
  }
  getMenu() {
    return this.menu;
  }
}
