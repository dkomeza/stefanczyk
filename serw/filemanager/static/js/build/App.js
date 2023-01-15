import Navbar from "./modules/Navbar.js";
import Upload from "./modules/Upload.js";
class App {
    constructor() {
        this.navbar = new Navbar();
        this.upload = new Upload();
    }
    createApp() {
        this.navbar.createNavbar();
        this.upload.createUpload();
    }
}
export default new App();
