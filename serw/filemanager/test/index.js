const canvas = document.getElementById("image");
const context = canvas.getContext("2d");

const image = new Image();
image.src = "./index.png";

image.onload = () => {
  context.filter = "blur(5px)";
  context.fillStyle = "#000000";
  context.fillRect(0, 0, 300, 150);
  //   context.drawImage(image, 0, 0);
  context.fillStyle = "#FFFFFF";
  context.font = "48px serif";
  context.fillText("Hello world", 50, 100);

  const file = dataURLtoFile(canvas.toDataURL("image/png"), "image");
};

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
