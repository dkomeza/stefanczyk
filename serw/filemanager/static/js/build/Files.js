import Breadcrumbs from "./modules/Breadcrumbs.js";
import FileUtils from "./modules/FileUtils.js";
class Files {
    constructor(directory) {
        this.selected = [];
        this.shift = false;
        this.control = false;
        this.container = document.querySelector(".files-container");
        this.files = document.querySelectorAll(".file");
        this.folders = document.querySelectorAll(".folder");
        this.contextMenu = document.querySelector(".files-context-menu");
        this.directory = directory;
        this.createEvents();
        document.body.onclick = (e) => {
            if (!this.checkEvent(e)) {
                this.selected = [];
                this.folders.forEach((folder) => {
                    folder.classList.remove("selected");
                });
                this.files.forEach((file) => {
                    file.classList.remove("selected");
                });
                this.contextMenu.classList.remove("show");
            }
        };
        this.folders.forEach((folder) => {
            folder.ondblclick = () => {
                var _a;
                this.selected = [];
                let path = window.location.pathname;
                let splitPath = path.split("/");
                splitPath = splitPath.filter((item) => item !== "");
                path = splitPath.join("/");
                window.location.href =
                    "/" + path + "/" + ((_a = folder.querySelector("span")) === null || _a === void 0 ? void 0 : _a.innerText);
            };
        });
        this.files.forEach((file) => {
            file.ondblclick = () => {
                var _a;
                this.selected = [];
                let path = window.location.pathname;
                let splitPath = path.split("/");
                splitPath[1] = "editor";
                splitPath = splitPath.filter((item) => item !== "");
                path = splitPath.join("/");
                window.location.href =
                    "/" +
                        path +
                        "/" +
                        ((_a = file.querySelector("span")) === null || _a === void 0 ? void 0 : _a.innerText) +
                        "?path=" +
                        this.directory;
            };
        });
        this.handleContextMenu();
    }
    createEvents() {
        window.onkeydown = (e) => {
            if (e.key === "Shift") {
                e.preventDefault();
                this.shift = true;
            }
            if (e.key === "Control") {
                e.preventDefault();
                this.control = true;
            }
        };
        window.onkeyup = (e) => {
            if (e.key === "Shift") {
                this.shift = false;
            }
            if (e.key === "Control") {
                this.control = false;
            }
        };
        this.container.onclick = (e) => {
            if (this.checkEvent(e)) {
                const target = e.target;
                if (target.classList.contains("folder")) {
                    this.folders.forEach((folder, key) => {
                        if (folder === target) {
                            this.handleSelect(target, key);
                            return;
                        }
                    });
                }
                else if (target.classList.contains("file")) {
                    this.files.forEach((file, key) => {
                        if (file === target) {
                            this.handleSelect(target, key);
                            return;
                        }
                    });
                }
            }
        };
        this.container.oncontextmenu = (e) => {
            e.preventDefault();
            this.handleRightClick(e, this.checkEvent(e));
        };
    }
    handleSelect(target, key) {
        if (!this.control && !this.shift) {
            this.folders.forEach((folder) => {
                folder.classList.remove("selected");
            });
            this.files.forEach((file) => {
                file.classList.remove("selected");
            });
            if (this.selected.includes(target)) {
                target.classList.remove("selected");
                this.selected = [];
            }
            else {
                this.selected.push(target);
                target.classList.add("selected");
            }
        }
        else if (this.control) {
            if (this.selected.includes(target)) {
                const currentKey = this.selected.indexOf(target);
                this.selected.splice(currentKey, 1);
                target.classList.remove("selected");
            }
            else {
                this.selected.push(target);
                target.classList.add("selected");
            }
        }
        else if (this.shift) {
            if (this.selected.length === 0) {
                this.selected.push(target);
                target.classList.add("selected");
            }
            else {
                this.folders.forEach((folder) => {
                    folder.classList.remove("selected");
                });
                this.files.forEach((file) => {
                    file.classList.remove("selected");
                });
                if (this.selected[0].classList.contains("folder") &&
                    target.classList.contains("folder")) {
                    const lastSelectedKey = Array.from(this.folders).indexOf(this.selected[0]);
                    if (lastSelectedKey < key) {
                        for (let i = lastSelectedKey; i <= key; i++) {
                            this.selected.push(this.folders[i]);
                            this.folders[i].classList.add("selected");
                        }
                    }
                    else {
                        for (let i = lastSelectedKey; i >= key; i--) {
                            this.selected.push(this.folders[i]);
                            this.folders[i].classList.add("selected");
                        }
                    }
                }
                else if (this.selected[0].classList.contains("file") &&
                    target.classList.contains("file")) {
                    const lastSelectedKey = Array.from(this.files).indexOf(this.selected[0]);
                    if (lastSelectedKey < key) {
                        for (let i = lastSelectedKey; i <= key; i++) {
                            this.selected.push(this.files[i]);
                            this.files[i].classList.add("selected");
                        }
                    }
                    else {
                        for (let i = lastSelectedKey; i >= key; i--) {
                            this.selected.push(this.files[i]);
                            this.files[i].classList.add("selected");
                        }
                    }
                }
                else {
                    this.selected = [];
                    this.selected.push(target);
                    target.classList.add("selected");
                }
            }
        }
    }
    handleRightClick(e, file) {
        if (file) {
            if (this.selected.length === 0) {
                const file = e.target;
                this.selected.push(file);
                file.classList.add("selected");
            }
        }
        this.showContextMenu(e, file);
    }
    showContextMenu(e, file) {
        var _a;
        const innerFile = this.contextMenu.querySelector("#file");
        const innerDefault = this.contextMenu.querySelector("#default");
        if (file) {
            innerFile.style.display = "flex";
            innerDefault.style.display = "none";
        }
        else {
            innerFile.style.display = "none";
            innerDefault.style.display = "flex";
        }
        (_a = this.contextMenu) === null || _a === void 0 ? void 0 : _a.classList.add("show");
        this.contextMenu.style.top = `${e.clientY}px`;
        this.contextMenu.style.left = `${e.clientX + 4}px`;
        this.contextMenu.style.transform = this.getTranslate({
            x: e.clientX,
            y: e.clientY,
        });
        if (this.selected.length > 1) {
            const renameFile = document.querySelector("#contextMenu-renameFile");
            renameFile.style.display = "none";
        }
        else {
            const renameFile = document.querySelector("#contextMenu-renameFile");
            renameFile.style.display = "block";
        }
        const zipFile = document.querySelector("#contextMenu-zipFile");
    }
    handleContextMenu() {
        const createFolder = document.querySelector("#contextMenu-createNewFolder");
        const createFile = document.querySelector("#contextMenu-createNewFile");
        const deleteFile = document.querySelector("#contextMenu-deleteFile");
        const renameFile = document.querySelector("#contextMenu-renameFile");
        const zipFile = document.querySelector("#contextMenu-zipFile");
        createFolder.onclick = () => FileUtils.createFolder(this.directory);
        createFile.onclick = () => FileUtils.createFile(this.directory);
        deleteFile.onclick = () => {
            const files = [];
            this.selected.forEach((file) => {
                files.push(file.querySelector(".full-name").innerText);
            });
            FileUtils.deleteFile(this.directory, [...new Set(files)]);
        };
        renameFile.onclick = () => {
            const files = [];
            this.selected.forEach((file) => {
                files.push(file.querySelector(".full-name").innerText);
            });
            FileUtils.renameFile(this.directory, this.selected[0]);
        };
        zipFile.onclick = () => {
            const files = [];
            this.selected.forEach((file) => {
                files.push(file.querySelector(".full-name").innerText);
            });
            FileUtils.zipFiles(this.directory, [...new Set(files)]);
        };
    }
    getTranslate(coords) {
        const translate = { x: 0, y: 0 };
        if (coords.y > window.innerHeight - 300) {
            translate.y = -100;
        }
        if (coords.x >
            document.querySelector(".root").getBoundingClientRect().right - 200) {
            translate.x = -100;
        }
        return `translate(${translate.x}%, ${translate.y}%)`;
    }
    checkEvent(e) {
        const target = e.target;
        return (target.classList.contains("folder") || target.classList.contains("file"));
    }
}
const breadcrumbs = new Breadcrumbs();
new Files(breadcrumbs.finalPath.join("/"));
breadcrumbs.createBreadcrumbs();
