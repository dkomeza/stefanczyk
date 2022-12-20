let input = document.getElementById("files");
input.oninput = function () {
  let files = input.files;
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
};
