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
    createEditor() { }
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
}
const fileEditor = new FileEditor();
fileEditor.createEditor();
console.log("xkd");
console.log(path);
