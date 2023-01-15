import App from "./App.js";
import Loader from "./modules/Loader.js";

const loader = new Loader();

window.onload = () => {
  App.createApp();
  loader.load();
};
