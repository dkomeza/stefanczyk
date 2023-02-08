declare var path: string;
declare var file: string;

class FileEditor {
  path: string;
  file: string;
  closeButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;
  constructor() {
    this.path = path;
    this.file = file;
    this.closeButton = document.querySelector("#cancel-file")!;
    this.saveButton = document.querySelector("#save-file")!;
    this.createNavEvents();
  }

  createNavEvents() {
    this.closeButton.onclick = () => {
      window.location.href = `/files/${this.path}`;
    };
    this.saveButton.onclick = () => {
      this.saveFile();
    };
  }

  createEditor() {}

  private async saveFile() {
    await fetch(`/api/saveFile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "asdaf",
        file: `${this.path}/${this.file}`,
      }),
    });
    window.location.href = `/files/${this.path}`;
  }
}

const fileEditor = new FileEditor();

fileEditor.createEditor();

console.log("xkd");
console.log(path);
