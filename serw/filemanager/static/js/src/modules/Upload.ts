class Upload {
  sidebar: HTMLElement;
  upload: HTMLElement;
  fileInput: HTMLInputElement;
  path: string;
  constructor() {
    this.sidebar = document.querySelector(".sidebar")!;
    this.upload = document.querySelector(".upload")!;
    this.fileInput = document.querySelector("#file-input")!;
    this.path = this.getCurrentPath();
  }
  getCurrentPath() {
    if (
      window.location.pathname.split("/")[1] === "files" &&
      window.location.pathname.split("/").splice(2).join("/")
    ) {
      return this.urldecode(
        window.location.pathname.split("/").splice(2).join("/")
      );
    }
    return "/";
  }
  createUpload() {
    this.fileInput.addEventListener("input", () => {
      const request = new XMLHttpRequest();
      const formData = new FormData();
      for (let i = 0; i < this.fileInput.files!.length; i++) {
        formData.append("files", this.fileInput.files![i]);
      }
      formData.append("path", this.path);
      request.onload = () => {
        if (request.status === 200) {
          window.location.reload();
        } 
      };
      request.open("POST", "/api/upload");
      request.send(formData);

      this.fileInput.value = "";
    });
  }
  private urldecode(url: string) {
    return decodeURIComponent((url + "").replace(/\+/g, "%20"));
  }
}

export default Upload;
