declare var path: string | undefined;
declare var file: string;
declare var fontSize: string;
declare var theme: string;

class FileEditor {
  path: string;
  file: string;
  ext: string;
  fontSize: number;
  theme: number;
  closeButton: HTMLButtonElement;
  saveButton: HTMLButtonElement;
  editor: HTMLDivElement;
  lines: HTMLCollectionOf<HTMLDivElement>;
  increaseFontSize: HTMLButtonElement;
  decreaseFontSize: HTMLButtonElement;
  increaseTheme: HTMLButtonElement;
  decreaseTheme: HTMLButtonElement;
  constructor() {
    this.path = path || "";
    this.file = file;
    this.fontSize = parseInt(fontSize);
    this.theme = parseInt(theme);

    this.closeButton = document.querySelector("#cancel-file")!;
    this.saveButton = document.querySelector("#save-file")!;
    this.increaseFontSize = document.querySelector("#font-size-increase")!;
    this.decreaseFontSize = document.querySelector("#font-size-decrease")!;
    this.increaseTheme = document.querySelector("#theme-increase")!;
    this.decreaseTheme = document.querySelector("#theme-decrease")!;
    this.editor = document.querySelector("#editor")!;
    this.lines = document.getElementsByClassName(
      "line"
    ) as HTMLCollectionOf<HTMLDivElement>;
    this.createNavEvents();
    this.ext = this.getFileExtension();
    this.createThemeEvents();
    this.setTheme();
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
    this.createKeyEvents();
    this.makeEditable();
    this.updateLineNumbers();
  }

  private setTheme() {
    const root = document.documentElement;
    root.style.setProperty("--fontSize", `${this.fontSize}px`);
    this.editor.classList.remove("theme-1", "theme-2", "theme-3");
    this.editor.classList.add(`theme-${this.theme + 1}`);
    this.saveTheme();
  }

  private getFileExtension() {
    const file = this.file.split(".");
    return file[file.length - 1];
  }

  private async saveFile() {
    const data = this.getData();
    await fetch(`/api/saveFile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: data,
        file: `${this.path}/${this.file}`,
      }),
    });
    window.location.href = `/files/${this.path}`;
  }

  private getData() {
    let data = "";
    for (let i = 0; i < this.lines.length; i++) {
      data += this.lines[i].textContent;
      if (i !== this.lines.length - 1) {
        data += "\n";
      }
    }
    return data;
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
        if (cursorPosition === 0) {
          e.preventDefault();
          const prevLine = target.previousElementSibling as HTMLDivElement;
          const text = target.textContent;
          if (prevLine) {
            const prevLength = prevLine.textContent!.length;
            if (prevLength > 0 || text) {
              if (text) {
                prevLine.textContent += text;
              }
              prevLine.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.setStart(prevLine.childNodes[0], prevLength);
              range.collapse(true);
              sel?.removeAllRanges();
              sel?.addRange(range);
            }
            prevLine.focus();
            this.removeLine(target);
          }
        }
      }
      if (e.key === "Tab") {
        e.preventDefault();
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
  }

  private addLine(target: HTMLDivElement) {
    const newLine = document.createElement("div");
    newLine.classList.add("line");
    newLine.setAttribute("contenteditable", "true");
    target.after(newLine);
    newLine.focus();
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

  private createThemeEvents() {
    this.increaseFontSize.addEventListener("click", () => {
      this.fontSize += 2;
      this.setTheme();
    });
    this.decreaseFontSize.addEventListener("click", () => {
      this.fontSize -= 2;
      this.setTheme();
    });
    this.increaseTheme.addEventListener("click", () => {
      if (this.theme < 2) {
        this.theme++;
        this.setTheme();
      }
    });
    this.decreaseTheme.addEventListener("click", () => {
      if (this.theme > 0) {
        this.theme--;
        this.setTheme();
      }
    });
  }

  private saveTheme() {
    fetch("/api/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        theme: this.theme,
        fontSize: this.fontSize,
      }),
    });
  }
}

const fileEditor = new FileEditor();

fileEditor.createEditor();
