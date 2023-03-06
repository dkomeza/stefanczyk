var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import JS from "./themes/JS.js";
class FileEditor {
    constructor() {
        this.path = path === "/" ? "" : path;
        this.file = file;
        this.closeButton = document.querySelector("#cancel-file");
        this.saveButton = document.querySelector("#save-file");
        this.increaseFontSize = document.querySelector("#font-size-increase");
        this.decreaseFontSize = document.querySelector("#font-size-decrease");
        this.increaseTheme = document.querySelector("#theme-increase");
        this.decreaseTheme = document.querySelector("#theme-decrease");
        this.editor = document.querySelector("#editor");
        this.lines = document.getElementsByClassName("line");
        this.createNavEvents();
        this.ext = this.getFileExtension();
        this.createThemeEvents();
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
        this.updateTheme();
    }
    getFileExtension() {
        const file = this.file.split(".");
        return file[file.length - 1];
    }
    saveFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.getData();
            console.log(data);
            yield fetch(`/api/saveFile/`, {
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
        });
    }
    getData() {
        let data = "";
        for (let i = 0; i < this.lines.length; i++) {
            data += this.lines[i].textContent;
            if (i !== this.lines.length - 1) {
                data += "\n";
            }
        }
        return data;
    }
    makeEditable() {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].setAttribute("contenteditable", "true");
        }
    }
    createKeyEvents() {
        this.editor.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const target = e.target;
                const sel = window.getSelection();
                const cursorPosition = sel === null || sel === void 0 ? void 0 : sel.getRangeAt(0).endOffset;
                const text = target.textContent;
                if (text && cursorPosition != undefined) {
                    const before = text.slice(0, cursorPosition);
                    const after = text.slice(cursorPosition);
                    target.textContent = before;
                    this.addLine(target);
                    const newLine = target.nextElementSibling;
                    newLine.textContent = after;
                    const range = document.createRange();
                    range.setStart(newLine, 0);
                    range.collapse(true);
                    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                    sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    return;
                }
                this.addLine(e.target);
            }
            if (e.key === "Backspace") {
                const target = e.target;
                const sel = window.getSelection();
                const cursorPosition = sel === null || sel === void 0 ? void 0 : sel.getRangeAt(0).endOffset;
                if (cursorPosition === 0) {
                    e.preventDefault();
                    const prevLine = target.previousElementSibling;
                    const text = target.textContent;
                    if (prevLine) {
                        const prevLength = prevLine.textContent.length;
                        if (prevLength > 0 || text) {
                            if (text) {
                                prevLine.textContent += text;
                            }
                            prevLine.focus();
                            const range = document.createRange();
                            const sel = window.getSelection();
                            range.setStart(prevLine.childNodes[0], prevLength);
                            range.collapse(true);
                            sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                            sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                        }
                        prevLine.focus();
                    }
                    this.removeLine(target);
                }
            }
            if (e.key === "Tab") {
                e.preventDefault();
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                const target = e.target;
                const sel = window.getSelection();
                const newCursorPosition = sel === null || sel === void 0 ? void 0 : sel.getRangeAt(0).endOffset;
                const prev = target.previousElementSibling;
                if (prev) {
                    prev.focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    if (newCursorPosition &&
                        prev.textContent.length >= newCursorPosition) {
                        range.setStart(prev.childNodes[0], newCursorPosition);
                        range.collapse(true);
                        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    }
                    else if (newCursorPosition) {
                        range.setStart(prev.childNodes[0], prev.textContent.length);
                        range.collapse(true);
                        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    }
                    else {
                        prev.focus();
                    }
                }
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                const target = e.target;
                const sel = window.getSelection();
                const newCursorPosition = sel === null || sel === void 0 ? void 0 : sel.getRangeAt(0).endOffset;
                const next = target.nextElementSibling;
                if (next) {
                    next.focus();
                    const range = document.createRange();
                    const sel = window.getSelection();
                    if (newCursorPosition &&
                        next.textContent.length >= newCursorPosition) {
                        range.setStart(next.childNodes[0], newCursorPosition);
                        range.collapse(true);
                        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    }
                    else if (newCursorPosition) {
                        range.setStart(next.childNodes[0], next.textContent.length);
                        range.collapse(true);
                        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    }
                    else {
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
    addLine(target) {
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
    removeLine(target) {
        if (this.lines.length > 1) {
            target.remove();
            this.updateLineNumbers();
        }
    }
    updateLineNumbers() {
        const lineNumbers = document.querySelector("#lines");
        lineNumbers.innerHTML = "";
        for (let i = 0; i < this.lines.length; i++) {
            const line = document.createElement("div");
            line.classList.add("line-number");
            line.textContent = `${i + 1}`;
            lineNumbers.append(line);
        }
    }
    updateTheme(line) {
        if (line) {
            switch (this.ext) {
                case "js":
                    line.innerHTML = JS.highlight(line.textContent);
                    break;
            }
            return;
        }
        for (let i = 0; i < this.lines.length; i++) {
            switch (this.ext) {
                case "js":
                    this.lines[i].innerHTML = JS.highlight(this.lines[i].textContent);
                    break;
            }
        }
    }
    createThemeEvents() {
        // this.increaseFontSize.addEventListener("click", () => {
        //   this.fontSize += 2;
        //   this.updateFontSize();
        // }
    }
}
const fileEditor = new FileEditor();
fileEditor.createEditor();
