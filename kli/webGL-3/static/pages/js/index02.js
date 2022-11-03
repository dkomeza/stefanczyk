let speedometer;
window.addEventListener("load", function () {
  speedometer = document.getElementById("speed");
  createScene();
});

const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(1000);
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

let x = 400;
let z = 400;
let rad = 0;

const car = new Car().getCar();

let ArrowLeft = false;
let ArrowDown = false;
let ArrowUp = false;
let ArrowRight = false;

let rotation = 0;
let speed = 0;
let maxSpeed = 80;
let vector = [0, 0];

const personHelper = new THREE.Mesh(
  new THREE.SphereGeometry(5, 20, 20),
  new THREE.MeshBasicMaterial({ color: "#FFFF00" })
);

function createScene() {
  renderer.setClearColor(0x0066ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(400, 400, 400);
  camera.lookAt(scene.position);

  let geometry = new THREE.PlaneGeometry(100000, 100000);
  let texture = new THREE.TextureLoader().load("../resources/01/top.jpg");
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
  car.position.set(200, 25, 220);
  const light = new THREE.AmbientLight(0xffff00, 0.4);
  scene.add(light);
  scene.add(car);
  scene.add(personHelper);
  render();
}

function render() {
  requestAnimationFrame(render);

  if (ArrowUp) {
    if (speed <= 1) {
      speed += 0.5;
    } else if (speed < 10) {
      speed += Math.log(speed) / 3;
    } else if (speed < 30) {
      speed += Math.log(speed) / 4;
    } else if (speed < 50) {
      speed += Math.log(speed) / 7;
    } else {
      speed += Math.log(maxSpeed - speed) / 10;
    }
  } else if (ArrowDown) {
    if (speed > 30) {
      speed -= Math.log(speed) / 6;
    } else if (speed > 10) {
      speed -= Math.log(speed) / 4;
    } else if (speed > 5) {
      speed -= Math.log(speed) / 2;
    } else if (speed > 1) {
      speed -= Math.log(speed);
    } else if (speed > 0) {
      speed -= 0.4;
    } else {
      speed = 0;
    }
  } else {
    if (speed > 0) {
      speed -= 0.1;
    } else {
      speed = 0;
    }
  }
  if (ArrowLeft) {
    if (speed > 10) {
      rotation += Math.PI / 90;
    } else if (speed > 0) {
      rotation += Math.PI / ((18 - speed) * 10);
    }
  } else if (ArrowRight) {
    if (speed > 10) {
      rotation -= Math.PI / 90;
    } else if (speed > 0) {
      rotation -= Math.PI / ((18 - speed) * 10);
    }
  }

  vector[0] = -Math.cos(rotation) * speed;
  vector[1] = -Math.sin(rotation) * speed;
  car.position.z += vector[0];
  car.position.x += vector[1];
  car.rotation.y = rotation;
  camera.position.set(car.position.x, 800, car.position.z + 1000);
  camera.lookAt(car.position.x, 90, car.position.z - 100);
  speedometer.innerText = `${Math.round(speed)} km/h`;
  renderer.render(scene, camera);
}

window.addEventListener("keydown", (e) => {
  switch (e.code) {
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
    default:
      return;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.code) {
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
    default:
      return;
  }
});
