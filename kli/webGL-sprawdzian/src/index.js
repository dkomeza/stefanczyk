import Light from "./Light.js";
import Box from "./Box.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

let currentIndex = 0;

let lightArray = [];

const controlsWrapper = document.getElementById("position-wrapper");

const colorArr = ["red", "green", "blue", "yellow"];

document.getElementById("add-light").onclick = () => {
  let light = new Light(currentIndex);
  lightArray.push(light);
  scene.add(light.getLight());
  createControler(currentIndex);
  currentIndex++;
};

function createControler(index) {
  const controls = document.createElement("div");
  const buttonContainer = document.createElement("div");
  for (let i = 0; i < colorArr.length; i++) {
    const button = document.createElement("button");
    button.onclick = () => handleButtonClick(index, colorArr[i]);
    button.classList.add("button-controler");
    button.style.backgroundColor = colorArr[i];
    buttonContainer.append(button);
  }
  controls.append(buttonContainer);
  for (let i = 0; i < 2; i++) {
    const range = document.createElement("input");
    range.type = "range";
    range.oninput = () => handleRangeInput(range, index, i);
    controls.append(range);
  }
  controls.classList.add("controls");
  controlsWrapper.append(controls);
}

function handleButtonClick(index, color) {
  const light = lightArray[index];
  light.changeColor(color);
  console.log(index, color);
}

function handleRangeInput(range, index, i) {
  console.log();
  const light = lightArray[index];
  if (i === 0) {
    light.changePosition(range.value * 10, -1);
  } else {
    light.changePosition(-1, range.value * 2);
  }
}

function createScene() {
  renderer.setClearColor(0x0066ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(0, 1000, 0);
  camera.lookAt(scene.position);

  let geometry = new THREE.PlaneGeometry(100000, 100000);
  let texture = new THREE.TextureLoader().load("../mats/grass.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(400, 400);
  let material = new THREE.MeshPhongMaterial({
    // color: 0xff0000,
    specular: 0xffffff,
    shininess: 0,
    side: THREE.DoubleSide,
    map: texture,
  });
  let plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  //   const light = new Light(0).getLight();
  //   console.log(light);
  //   scene.add(light);

  const box = new Box().getBox();
  scene.add(box);
  render();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

createScene();
