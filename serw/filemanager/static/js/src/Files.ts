import Breadcrumbs from "./modules/Breadcrumbs.js";
import FileUtils from "./modules/FileUtils.js";

class Files {
  container: HTMLElement;
  files: NodeListOf<HTMLElement>;
  folders: NodeListOf<HTMLElement>;
  contextMenu: HTMLElement | null;
  selected: HTMLElement[] = [];
  shift: boolean = false;
  control: boolean = false;
  directory: string;
  constructor(directory: string) {
    this.container = document.querySelector(".files-container")!;
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
        this.contextMenu!.classList.remove("show");
      }
    };
    this.folders.forEach((folder) => {
      folder.ondblclick = () => {
        this.selected = [];
        let path = window.location.pathname;
        let splitPath = path.split("/");
        splitPath = splitPath.filter((item) => item !== "");
        path = splitPath.join("/");
        window.location.href =
          "/" + path + "/" + folder.querySelector("span")?.innerText!;
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
        const target = e.target as HTMLElement;
        if (target.classList.contains("folder")) {
          this.folders.forEach((folder, key) => {
            if (folder === target) {
              this.handleSelect(target, key);
              return;
            }
          });
        } else if (target.classList.contains("file")) {
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

  handleSelect(target: HTMLElement, key: number) {
    if (!this.control && !this.shift) {
      this.folders.forEach((folder) => {
        folder.classList.remove("selected");
      });
      this.files.forEach((file) => {
        file.classList.remove("selected");
      });
      if (this.selected.includes(target)) {
        const currentKey = this.selected.indexOf(target);
        console.log(currentKey);
        target.classList.remove("selected");
        this.selected = [];
      } else {
        this.selected.push(target);
        target.classList.add("selected");
      }
    } else if (this.control) {
      if (this.selected.includes(target)) {
        const currentKey = this.selected.indexOf(target);
        this.selected.splice(currentKey, 1);
        target.classList.remove("selected");
      } else {
        this.selected.push(target);
        target.classList.add("selected");
      }
    } else if (this.shift) {
      if (this.selected.length === 0) {
        this.selected.push(target);
        target.classList.add("selected");
      } else {
        this.folders.forEach((folder) => {
          folder.classList.remove("selected");
        });
        this.files.forEach((file) => {
          file.classList.remove("selected");
        });
        const lastSelectedKey = Array.from(this.folders).indexOf(
          this.selected[0]
        );
        if (lastSelectedKey < key) {
          for (let i = lastSelectedKey; i <= key; i++) {
            console.log(key);
            this.selected.push(this.folders[i]);
            this.folders[i].classList.add("selected");
          }
        } else {
          for (let i = lastSelectedKey; i >= key; i--) {
            this.selected.push(this.folders[i]);
            this.folders[i].classList.add("selected");
          }
        }
      }
    }
  }
  handleRightClick(e: MouseEvent, file: boolean) {
    if (file) {
      if (this.selected.length === 0) {
        const file = e.target as HTMLElement;
        this.selected.push(file);
        file.classList.add("selected");
      }
    }
    this.showContextMenu(e, file);
  }
  private showContextMenu(e: MouseEvent, file: boolean) {
    const innerFile = (this.contextMenu! as Element).querySelector(
      "#file"
    ) as HTMLElement;
    const innerDefault = (this.contextMenu! as Element).querySelector(
      "#default"
    ) as HTMLElement;
    if (file) {
      innerFile.style.display = "flex";
      innerDefault.style.display = "none";
    } else {
      innerFile.style.display = "none";
      innerDefault.style.display = "flex";
    }
    this.contextMenu?.classList.add("show");
    this.contextMenu!.style.top = `${e.clientY}px`;
    this.contextMenu!.style.left = `${e.clientX + 4}px`;
    this.contextMenu!.style.transform = this.getTranslate({
      x: e.clientX,
      y: e.clientY,
    });
  }

  private handleContextMenu() {
    const createFolder = document.querySelector(
      "#contextMenu-createNewFolder"
    ) as HTMLElement;
    const createFile = document.querySelector(
      "#contextMenu-createNewFile"
    ) as HTMLElement;

    const deleteFile = document.querySelector(
      "#contextMenu-deleteFile"
    ) as HTMLElement;

    createFolder.onclick = () => FileUtils.createFolder(this.directory);
    createFile.onclick = () => FileUtils.createFile(this.directory);

    deleteFile.onclick = () => {
      const files: string[] = [];
      this.selected.forEach((file) => {
        files.push(
          (file.querySelector(".full-name") as HTMLElement).innerText!
        );
      });
      FileUtils.deleteFile(this.directory, [...new Set(files)]);
    };
  }

  private getTranslate(coords: { x: number; y: number }) {
    const translate = { x: 0, y: 0 };
    if (coords.y > window.innerHeight - 300) {
      translate.y = -100;
    }
    if (
      coords.x >
      document.querySelector(".root")!.getBoundingClientRect().right - 200
    ) {
      translate.x = -100;
    }
    return `translate(${translate.x}%, ${translate.y}%)`;
  }

  private checkEvent(e: MouseEvent) {
    const target = e.target as HTMLElement;
    return (
      target.classList.contains("folder") || target.classList.contains("file")
    );
  }
}

const breadcrumbs = new Breadcrumbs();
new Files(breadcrumbs.finalPath.join("/"));

breadcrumbs.createBreadcrumbs();
