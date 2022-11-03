window.addEventListener("load", function () {
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
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

let cube;
let angle = 0;
let rad = 0;
let x = 400;
let y = 400;
let mouseX = 0;
let mouseY = 0;

const bulbGeometry = new THREE.SphereGeometry(5, 20, 20);
const bulbMaterial = new THREE.MeshBasicMaterial({ color: "#FFFF00" });
const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
const light = new THREE.PointLight(0xffff0f, 1);

function createScene() {
  scene.add(axes);
  renderer.setClearColor(0x0066ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(400, 400, 400);
  camera.lookAt(scene.position);
  cube = createCube();

  let geometry = new THREE.PlaneGeometry(1000, 1000);
  let material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("../resources/01/top.jpg"),
    side: THREE.DoubleSide,
    specular: "#ffffff",
    shininess: 1,
  });
  let plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / 2;
  console.log(plane);
  scene.add(cube);
  scene.add(plane);

  // const light = new THREE.DirectionalLight(0xffff00, 10);
  // light.position.set(1, 1, 1);
  // light.intensity = 2;
  // const light = new THREE.AmbientLight(0xffff00, 1);
  bulb.position.set(200, 200, 0);
  light.position.set(200, 200, 0);
  scene.add(light);
  scene.add(bulb);
  render();
}

function createCube() {
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  let materials = []; // [x, -x, y, -y, z, -z]

  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/top.jpg"),
    })
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/bottom.png"),
    })
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      // color: 0xff0000,
      specular: 0xffffff,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load("../resources/01/side.jpg"),
    })
  );
  const cube = new THREE.Mesh(geometry, materials);
  cube.name = "Super";
  cube.position.y = 60;
  return cube;
}

function render() {
  requestAnimationFrame(render);
  mouseVector.x = mouseX;
  mouseVector.y = mouseY;
  raycaster.setFromCamera(mouseVector, camera);
  intersects = raycaster.intersectObjects(scene.children);
  spin();
  spinLight();

  function spin() {
    if (rad >= 2 * Math.PI) {
      rad = 0;
    } else {
      rad += Math.PI / 180;
    }
    y = 600 * Math.sin(rad);
    x = 600 * Math.cos(rad);
  }
  function spinLight() {
    light.position.set(400 * Math.sin(rad * 2), 200, 400 * Math.cos(rad * 2));
    bulb.position.set(400 * Math.sin(rad * 2), 200, 400 * Math.cos(rad * 2));
  }
  camera.position.z = y;
  camera.position.x = x;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

document.addEventListener("mousemove", getMousePosition);
function getMousePosition(e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}
