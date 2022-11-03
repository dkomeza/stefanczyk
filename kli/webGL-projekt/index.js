import Stats from "three/addons/libs/stats.module.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

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

function createScene() {
  scene.add(axes);
  renderer.setClearColor(0x0066ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("root").appendChild(renderer.domElement);
  camera.position.set(200, 200, 200);
  camera.lookAt(scene.position);
  let car = loadCar();
  scene.add(car);
  render();
}

function loadCar() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("js/libs/draco/gltf/");

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "models/gltf/LittlestTokyo.glb",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(1, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();

      animate();
    },
    undefined,
    function (e) {
      console.error(e);
    }
  );
}

function render() {
  requestAnimationFrame(render);
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
