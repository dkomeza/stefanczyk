window.addEventListener("load", function () {
  createScene();
});

const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(1000);
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

let cube;
let angle = 0;
let rad = 0;
let x = 0;
let y = 0;
let mouseX = 0;
let mouseY = 0;

// czwarty materiał tak samo
// piąty materiał tak samo
// szósty materiał tak samo

function createScene() {
  //   scene.add(axes);
  renderer.setClearColor(0x0066ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(200, 200, 200);
  camera.lookAt(scene.position);
  cube = createCube();
  scene.add(cube);
  render();
}

function createCube() {
  const geometry = new THREE.BoxGeometry(100, 100, 100);
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
  const cube = new THREE.Mesh(geometry, materials);
  cube.name = "Super";
  return cube;
}

function render() {
  requestAnimationFrame(render);
  mouseVector.x = mouseX;
  mouseVector.y = mouseY;
  raycaster.setFromCamera(mouseVector, camera);
  intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    spin();
  }

  function spin() {
    if (rad >= 2 * Math.PI) {
      rad = 0;
    } else {
      rad += Math.PI / 180;
    }
    y = 300 * Math.sin(rad);
    x = 300 * Math.cos(rad);
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
