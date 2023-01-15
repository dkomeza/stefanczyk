export default class Loader {
  loader: HTMLDivElement;
  constructor() {
    this.loader = document.createElement("div");
  }
  load() {
    document.body.style.opacity = "1";
  }
}
