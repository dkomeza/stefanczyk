let helper;

window.addEventListener("load", function () {
  createScene();
  helper = document.querySelector(".helper");
});

const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

let angle = 0;
let rad = -Math.PI / 3;
let x = 0;
let y = 200;
let mouseX = 0;
let mouseY = 0;

let ArrowUp = false;
let ArrowDown = false;
let ArrowLeft = false;
let ArrowRight = false;
let keyQ = false;
let keyW = false;
let general = true;
let radius = 300;

let currentObject;

function createScene() {
  scene.add(axes);
  renderer.setClearColor(0xf0f0f0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(200, 200, 200);
  camera.lookAt(scene.position);
  render();
  for (let i = 0; i < 10; i++) {
    createCube(
      Math.floor(Math.random() * 1000 - 500),
      Math.floor(Math.random() * 1000 - 500),
      Math.floor(Math.random() * 1000 - 500),
      i
    );
  }
}

function createCube(x, y, z, index) {
  let geometry = new THREE.BoxGeometry(100, 100, 100);
  let materials = []; // [x, -x, y, -y, z, -z]

  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/top.jpg"),
    })
  );
  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/bottom.png"),
    })
  );
  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  let cube = new THREE.Mesh(geometry, materials);
  console.log(x, y, z);
  cube.position.x = x;
  cube.position.y = y;
  cube.position.z = z;
  cube.name = index;
  scene.add(cube);
}

function render() {
  requestAnimationFrame(render);
  function setSpin() {
    switch (true) {
      case ArrowUp:
        radius -= 10;
        break;
      case ArrowDown:
        radius += 10;
        break;
      case ArrowLeft:
        rad += Math.PI / 90;
        break;
      case ArrowRight:
        rad -= Math.PI / 90;
        break;
      case keyQ:
        y += 10;
        break;
      case keyW:
        y -= 10;
        break;
    }
    z = radius * Math.sin(rad);
    x = radius * Math.cos(rad);
    camera.position.z = z;
    camera.position.x = x;
    camera.position.y = y;
  }
  function moveCube() {
    switch (true) {
      case ArrowUp:
        currentObject.position.z -= 10;
        break;
      case ArrowDown:
        currentObject.position.z += 10;
        break;
      case ArrowLeft:
        currentObject.position.x -= 10;
        break;
      case ArrowRight:
        currentObject.position.x += 10;
        break;
      case keyQ:
        currentObject.position.y += 10;
        break;
      case keyW:
        currentObject.position.y -= 10;
        break;
    }
  }
  if (general) {
    setSpin();
  } else {
    moveCube();
  }

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

document.addEventListener("keydown", function (e) {
  let key = e.key;
  switch (key) {
    case "ArrowUp":
      ArrowUp = true;
      break;
    case "ArrowDown":
      ArrowDown = true;
      break;
    case "ArrowRight":
      ArrowRight = true;
      break;
    case "ArrowLeft":
      ArrowLeft = true;
      break;
    case "q":
      keyQ = true;
      break;
    case "Q":
      keyQ = true;
      break;
    case "w":
      keyW = true;
      break;
    case "W":
      keyW = true;
      break;
    case "Escape":
      helper.style.display = "none";
      general = true;
  }
});

document.addEventListener("keyup", function (e) {
  let key = e.key;
  switch (key) {
    case "ArrowUp":
      ArrowUp = false;
      break;
    case "ArrowDown":
      ArrowDown = false;
      break;
    case "ArrowRight":
      ArrowRight = false;
      break;
    case "ArrowLeft":
      ArrowLeft = false;
      break;
    case "q":
      keyQ = false;
      break;
    case "Q":
      keyQ = false;
      break;
    case "w":
      keyW = false;
      break;
    case "W":
      keyW = false;
      break;
  }
});

document.addEventListener("click", function (e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseVector.x = mouseX;
  mouseVector.y = mouseY;
  raycaster.setFromCamera(mouseVector, camera);
  intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    currentObject = intersects[0].object;
    general = false;
    helper.innerText = `Selected cube no. ${currentObject.name}`;
    helper.style.display = "block";
  }
});

// window.addEventListener("resize", function () {
//   //   camera.aspect = window.innerWidth / window.innerHeight;
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   console.log(camera);
// });
