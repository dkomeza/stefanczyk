export default function events(keyDict: { [key: string]: boolean }) {
  window.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        keyDict["w"] = true;
        break;
      case "KeyA":
        keyDict["a"] = true;
        break;
      case "KeyS":
        keyDict["s"] = true;
        break;
      case "KeyD":
        keyDict["d"] = true;
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        keyDict["w"] = false;
        break;
      case "KeyA":
        keyDict["a"] = false;
        break;
      case "KeyS":
        keyDict["s"] = false;
        break;
      case "KeyD":
        keyDict["d"] = false;
        break;
    }
  });
}
