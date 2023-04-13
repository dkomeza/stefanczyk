class FileUtils {
    constructor() {
        this.createFolderDiv = document.createElement("div");
        this.createFileDiv = document.createElement("div");
        this.modal = document.getElementById("file-modal");
        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove("show");
            }
        };
        this.createActionDivs();
    }
    createFolder(directory) {
        this.modal.classList.toggle("show");
        this.modal.innerHTML = "";
        this.modal.append(this.createFolderDiv);
        const hiddenInput = document.getElementById("directoryValue");
        hiddenInput.value = directory;
    }
    createFile(directory) {
        this.modal.classList.toggle("show");
        this.modal.innerHTML = "";
        this.modal.append(this.createFileDiv);
        const hiddenInput = document.getElementById("directoryValue");
        hiddenInput.value = directory;
    }
    deleteFile(directory, files) {
        fetch("/api/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                directory: directory,
                files: files,
            }),
        }).then(() => window.location.reload());
    }
    renameFile(directory, file) {
        var _a;
        const oldName = (_a = file.querySelector("span")) === null || _a === void 0 ? void 0 : _a.innerText;
        file.querySelector("h3").innerHTML = `<input type="text" value="${oldName}">`;
        const input = file.querySelector("input");
        input.setSelectionRange(0, input.value.length);
        input.focus();
        input.onblur = () => {
            this.handleRename(directory, oldName, input.value);
        };
        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                this.handleRename(directory, oldName, input.value);
            }
        };
    }
    zipFiles(directory, files) {
        fetch("/api/zip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                directory: directory,
                files: files,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            const link = document.createElement("a");
            link.href = `/api/download?file=${data.path}`;
            link.download = "archive.zip";
            link.click();
        });
    }
    handleRename(directory, oldname, newname) {
        fetch("/api/rename", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                directory: directory,
                oldname: oldname,
                newname: newname,
            }),
        }).then(() => window.location.reload());
    }
    createActionDivs() {
        const createFolderDiv = document.createElement("div");
        createFolderDiv.innerHTML = `<form action="/api/createFolder" method="POST">
        <input type="hidden" name="directory" id="directoryValue" value="">
        <div class="input-wrapper">
            <label for="folder-name-input">Folder name</label>
            <input type="text" id="folder-name-input" name="foldername" style="color: black">
        </div>
        <button type="submit" style="color: black">Create folder</button>
    </form>`;
        this.createFolderDiv = createFolderDiv;
        const createFileDiv = document.createElement("div");
        createFileDiv.innerHTML = `<form action="/api/createFile" method="POST">
        <input type="hidden" name="directory" id="directoryValue" value="">
        <div class="input-wrapper">
            <label for="file-name-input">File name</label>
            <input type="text" id="file-name-input" name="filename" style="color: black">
        </div>
        <button type="submit" style="color: black">Create file</button>
    </form>`;
        this.createFileDiv = createFileDiv;
    }
}
export default new FileUtils();
