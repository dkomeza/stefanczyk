declare var path: string | undefined;
declare var file: string;

const ext = getFileExtension();
const closeButton = document.querySelector("#cancel-file") as HTMLButtonElement;
const saveButton = document.querySelector("#save-file") as HTMLButtonElement;
const filterButton = document.querySelector(
  "#filter-button"
) as HTMLButtonElement;
const editor = document.querySelector("#editor")!;
const aside = document.querySelector("aside")!;
const image = document.querySelector("#preview") as HTMLImageElement;
const source = document.querySelector("#source") as HTMLImageElement;
const canvas = document.querySelector("#output") as HTMLCanvasElement;

canvas.width = source.width;
canvas.height = source.height;

const ctx = canvas.getContext("2d")!;
createNavEvents();
addFilterEvents();

function getFileExtension() {
  return file.split(".").pop() || file;
}

function createNavEvents() {
  closeButton.onclick = () => {
    window.location.href = `/files/${path}`;
  };
  saveButton.onclick = () => {
    saveFile();
  };
  filterButton.onclick = () => {
    aside.classList.toggle("hidden");
  };
}

function addFilterEvents() {
  const filterButtons = document.querySelectorAll(
    ".filter-image"
  ) as NodeListOf<HTMLButtonElement>;
  filterButtons.forEach((button) => {
    button.onclick = () => {
      const filter = button.dataset.filter;
      image.style.filter = filter || "none";
    };
  });
}

function saveFile() {
  ctx.filter = image.style.filter;
  console.log(ctx.filter);
  ctx.drawImage(source, 0, 0);
  canvas.toBlob((blob) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    const newFile = new File([blob!], file, {
      type: "image/png",
    });
    formData.append("files", newFile);
    formData.append("path", path || "");
    request.open("POST", "/api/saveImage");
    request.send(formData);
    request.onload = () => {
      window.location.reload();
    };
  });
}

// Path: static/js/src/ImageEditor.ts
