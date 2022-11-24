// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import Stats from "three/addons/libs/stats.module.js";

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);
  }
  getScene() {
    return this.scene;
  }
}

class Renderer {
  constructor(render) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(render);
  }
  getRenderer() {
    return this.renderer;
  }
}

class Camera {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 40, 0);
  }
  getCamera() {
    return this.camera;
  }
}

class StatsClass {
  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
  }
  getStats() {
    return this.stats;
  }
}

export { Scene, Renderer, Camera, StatsClass };
