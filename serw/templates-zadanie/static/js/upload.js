window.onload = function () {
  let input = document.getElementById("files");
  let form = document.getElementById("form");
  let formData = new FormData();
  let fileArr = [];
  input.oninput = function () {
    formData = new FormData();
    const entries = Object.entries(input.files);
    console.log(entries);
    // if (input.files.length) {
    //   input.files.forEach((file) => {
    //     fileArr.append(file);
    //   });
    // } else {
    //   fileArr.append(input.files[0]);
    // }
    formData.append("files", fileArr);
  };
  form.onsubmit = function (e) {
    e.preventDefault();
    console.log(formData);
    fetch("/upload/", {
      method: "POST",
      body: formData,
    });
  };
};
