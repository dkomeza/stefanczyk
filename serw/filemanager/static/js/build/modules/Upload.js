class Upload {
    constructor() {
        this.progressBar = null;
        this.sidebar = document.querySelector(".sidebar");
        this.upload = document.querySelector(".upload");
        this.fileInput = document.querySelector("#file-input");
        this.path = this.getCurrentPath();
    }
    getCurrentPath() {
        if (window.location.pathname.split("/")[1] === "files" &&
            window.location.pathname.split("/").splice(2).join("/")) {
            return this.urldecode(window.location.pathname.split("/").splice(2).join("/"));
        }
        return "/";
    }
    createUpload() {
        this.fileInput.addEventListener("input", () => {
            const request = new XMLHttpRequest();
            const formData = new FormData();
            for (let i = 0; i < this.fileInput.files.length; i++) {
                formData.append("files", this.fileInput.files[i]);
            }
            formData.append("path", this.path);
            request.onload = () => {
                if (request.status === 200) {
                    window.location.reload();
                }
            };
            request.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    this.updateProgressBar(progress);
                }
            };
            request.open("POST", "/api/upload");
            request.send(formData);
            this.createProgressBar();
            this.fileInput.value = "";
        });
    }
    createProgressBar() {
        this.progressBar = document.createElement("div");
        this.progressBar.classList.add("progress-bar");
        const progress = document.createElement("div");
        progress.classList.add("progress");
        const progressText = document.createElement("div");
        progressText.classList.add("progress-text");
        const progressTextHeader = document.createElement("h3");
        const progressInner = document.createElement("div");
        const progressTextSpan = document.createElement("span");
        const progressOuterBar = document.createElement("div");
        const progressInnerBar = document.createElement("div");
        progressTextHeader.innerText = "Uploading...";
        progressTextSpan.innerText = "0%";
        progressInner.classList.add("progress-inner");
        progressOuterBar.classList.add("progress-outer-bar");
        progressInnerBar.classList.add("progress-inner-bar");
        progressTextSpan.classList.add("progress-text-span");
        progressOuterBar.appendChild(progressInnerBar);
        progressInner.appendChild(progressOuterBar);
        progressInner.appendChild(progressTextSpan);
        progressText.appendChild(progressTextHeader);
        progress.appendChild(progressText);
        progress.appendChild(progressInner);
        this.progressBar.appendChild(progress);
        document.body.appendChild(this.progressBar);
    }
    updateProgressBar(progress) {
        if (this.progressBar) {
            const progressTextSpan = this.progressBar.querySelector(".progress-text-span");
            const progressInnerBar = this.progressBar.querySelector(".progress-inner-bar");
            progressTextSpan.innerText = `${progress}%`;
            progressInnerBar.style.width = `${progress}%`;
        }
    }
    urldecode(url) {
        return decodeURIComponent((url + "").replace(/\+/g, "%20"));
    }
}
export default Upload;
