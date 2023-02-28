import JS from "./themes/JS.js";

declare var path: string;
declare var file: string;

class FileEditor {
  path: string;
  file: string;
  ext: string;
  closeButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;
  editor: HTMLDivElement;
  lines: HTMLCollectionOf<HTMLDivElement>;
  constructor() {
    this.path = path;
    this.file = file;
    this.closeButton = document.querySelector("#cancel-file")!;
    this.saveButton = document.querySelector("#save-file")!;
    this.editor = document.querySelector("#editor")!;
    this.lines = document.getElementsByClassName(
      "line"
    ) as HTMLCollectionOf<HTMLDivElement>;
    this.createNavEvents();
    this.ext = this.getFileExtension();
  }

  createNavEvents() {
    this.closeButton.onclick = () => {
      window.location.href = `/files/${this.path}`;
    };
    this.saveButton.onclick = () => {
      this.saveFile();
    };
  }

  createEditor() {
    console.log(this.lines);
    this.createKeyEvents();
    this.makeEditable();
    this.updateLineNumbers();
    this.updateTheme();
  }

  private getFileExtension() {
    const file = this.file.split(".");
    return file[file.length - 1];
  }

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

  private makeEditable() {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].setAttribute("contenteditable", "true");
    }
  }

  private createKeyEvents() {
    this.editor.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        const sel = window.getSelection();
        const cursorPosition = sel?.getRangeAt(0).endOffset;
        const text = target.textContent;
        if (text && cursorPosition != undefined) {
          const before = text.slice(0, cursorPosition);
          const after = text.slice(cursorPosition);
          target.textContent = before;
          this.addLine(target);
          const newLine = target.nextElementSibling as HTMLDivElement;
          newLine.textContent = after;
          const range = document.createRange();
          range.setStart(newLine, 0);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          return;
        }
        this.addLine(e.target as HTMLDivElement);
      }
      if (e.key === "Backspace") {
        const target = e.target as HTMLDivElement;
        const sel = window.getSelection();
        const cursorPosition = sel?.getRangeAt(0).endOffset;
        sel?.removeAllRanges();
        if (cursorPosition == 0) {
          e.preventDefault();
          const text = target.textContent;
          const newLine = target.previousElementSibling as HTMLDivElement;
          newLine.focus();
          const range = document.createRange();
          range.setStart(newLine, 1);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          if (text && cursorPosition != undefined) {
            newLine.textContent = newLine.textContent + text;
            const range = document.createRange();
            range.setStart(newLine, newLine.textContent!.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
          newLine.focus();
          this.removeLine(e.target as HTMLDivElement);
        }
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        target.textContent += "  ";
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        const sel = window.getSelection();
        const newCursorPosition = sel?.getRangeAt(0).endOffset;
        const prev = target.previousElementSibling as HTMLDivElement;
        if (prev) {
          prev.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          if (
            newCursorPosition &&
            prev.textContent!.length >= newCursorPosition
          ) {
            console.log("gitara");
            range.setStart(prev.childNodes[0], newCursorPosition!);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          } else if (newCursorPosition) {
            range.setStart(prev.childNodes[0], prev.textContent!.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          } else {
            prev.focus();
          }
        }
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        const sel = window.getSelection();
        const newCursorPosition = sel?.getRangeAt(0).endOffset;
        const next = target.nextElementSibling as HTMLDivElement;
        if (next) {
          next.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          if (
            newCursorPosition &&
            next.textContent!.length >= newCursorPosition
          ) {
            range.setStart(next.childNodes[0], newCursorPosition!);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          } else if (newCursorPosition) {
            range.setStart(next.childNodes[0], next.textContent!.length);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          } else {
            next.focus();
          }
        }
      }
    });
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].addEventListener("keyup", (e) => {
        this.updateTheme(this.lines[i]);
      });
    }
  }

  private addLine(target: HTMLDivElement) {
    const newLine = document.createElement("div");
    newLine.classList.add("line");
    newLine.setAttribute("contenteditable", "true");
    target.after(newLine);
    newLine.focus();
    newLine.addEventListener("keydown", (e) => {
      this.updateTheme(newLine);
    });
    this.updateLineNumbers();
  }

  private removeLine(target: HTMLDivElement) {
    if (this.lines.length > 1) {
      target.remove();
      this.updateLineNumbers();
    }
  }

  private updateLineNumbers() {
    const lineNumbers = document.querySelector("#lines") as HTMLDivElement;
    lineNumbers.innerHTML = "";
    for (let i = 0; i < this.lines.length; i++) {
      const line = document.createElement("div");
      line.classList.add("line-number");
      line.textContent = `${i + 1}`;
      lineNumbers.append(line);
    }
  }

  private updateTheme(line?: HTMLDivElement) {
    if (line) {
      switch (this.ext) {
        case "js":
          line.innerHTML = JS.highlight(line.textContent!);
          break;
      }
      return;
    }
    for (let i = 0; i < this.lines.length; i++) {
      switch (this.ext) {
        case "js":
          this.lines[i].innerHTML = JS.highlight(this.lines[i].textContent!);
          break;
      }
    }
  }
}

const fileEditor = new FileEditor();

fileEditor.createEditor();
