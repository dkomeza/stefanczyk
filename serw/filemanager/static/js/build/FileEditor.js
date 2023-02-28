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
        this.path = path;
        this.file = file;
        this.closeButton = document.querySelector("#cancel-file");
        this.saveButton = document.querySelector("#save-file");
        this.editor = document.querySelector("#editor");
        this.lines = document.getElementsByClassName("line");
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
    getFileExtension() {
        const file = this.file.split(".");
        return file[file.length - 1];
    }
    saveFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`/api/saveFile/`, {
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
        });
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
                sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                if (cursorPosition == 0) {
                    e.preventDefault();
                    const text = target.textContent;
                    const newLine = target.previousElementSibling;
                    newLine.focus();
                    const range = document.createRange();
                    range.setStart(newLine, 1);
                    range.collapse(true);
                    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                    sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    if (text && cursorPosition != undefined) {
                        newLine.textContent = newLine.textContent + text;
                        const range = document.createRange();
                        range.setStart(newLine, newLine.textContent.length);
                        range.collapse(true);
                        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
                        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
                    }
                    newLine.focus();
                    this.removeLine(e.target);
                }
            }
            if (e.key === "Tab") {
                e.preventDefault();
                const target = e.target;
                target.textContent += "  ";
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
                        console.log("gitara");
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
}
const fileEditor = new FileEditor();
fileEditor.createEditor();
