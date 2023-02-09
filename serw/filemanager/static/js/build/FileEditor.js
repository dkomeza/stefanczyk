"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FileEditor {
    constructor() {
        this.path = path;
        this.file = file;
        this.closeButton = document.querySelector("#cancel-file");
        this.saveButton = document.querySelector("#save-file");
        this.editor = document.querySelector("#editor");
        this.lines = document.getElementsByClassName("line");
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
    createEditor() {
        console.log(this.lines);
        this.createKeyEvents();
        this.makeEditable();
        this.updateLineNumbers();
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
                if (text && cursorPosition) {
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
            if (e.key === "Backspace" &&
                e.target.textContent === "") {
                e.preventDefault();
                this.removeLine(e.target);
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
                        console.log("gitara");
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
    }
    addLine(target) {
        const newLine = document.createElement("div");
        newLine.classList.add("line");
        newLine.setAttribute("contenteditable", "true");
        target.after(newLine);
        newLine.focus();
        this.updateLineNumbers();
    }
    removeLine(target) {
        target.remove();
        this.updateLineNumbers();
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
}
const fileEditor = new FileEditor();
fileEditor.createEditor();
