// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import Stats from "three/addons/libs/stats.module.js";

// @ts-expect-error
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

class Scene {
  scene: any;
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
    this.scene.environment = new RGBELoader().load(
      "models/textures/venice_sunset_1k.hdr"
    );
    this.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  }
  getScene() {
    return this.scene;
  }
}

class Renderer {
  renderer: any;
  constructor(render: any) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(render);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85;
  }
  getRenderer() {
    return this.renderer;
  }
}

class Camera {
  camera: any;
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(4.25, 1.4, -4.5);
  }
  getCamera() {
    return this.camera;
  }
}

class StatsClass {
  stats: any;
  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
  }
  getStats() {
    return this.stats;
  }
}

export { Scene, Renderer, Camera, StatsClass };
