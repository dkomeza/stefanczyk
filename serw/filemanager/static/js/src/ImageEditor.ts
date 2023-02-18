declare var path: string;
declare var file: string;

console.log(file);

fetch("/image", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    directory: path + "/" + file,
  }),
})
  .then((response) => response.text())
  .then((data) => data.toString())
  .then((data) => {
    const image = new Image();
    image.src = "data:image/png;base64, " + data;
    document.body.append(image);
    const canvas = document.getElementById("image-canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d")!;
    context.filter = "blur(4px)";
    context.fillStyle = "#000000";
    context.drawImage(image, 0, 0);
    const file = dataURLtoFile(canvas.toDataURL("image/png"), "image2.png");
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("files", file);
    formData.append("path", "/");
    request.open("POST", "/api/upload");
    request.send(formData);
  });

function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
