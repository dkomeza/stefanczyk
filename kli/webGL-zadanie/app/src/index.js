// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Scene, Renderer, Camera, StatsClass } from "./Constructor.js";

import Hexagon from "./Hexagon.js";

window.onload = function () {
  let camera, scene, renderer, controls, stats;
  let hexagon;

  function init() {
    const container = document.getElementById("container");

    renderer = new Renderer(render).getRenderer();
    camera = new Camera().getCamera();
    scene = new Scene().getScene();
    stats = new StatsClass().getStats();

    container.appendChild(renderer.domElement);
    container.appendChild(stats.dom);

    window.addEventListener("resize", onWindowResize);

    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;
    controls.maxDistance = 120;
    controls.target.set(0, 0.5, 0);
    controls.update();

    hexagon = new Hexagon();
    scene.add(hexagon.getHexagon());
    document.getElementById("radius").oninput = function () {
      scene.remove(hexagon);
      hexagon = new Hexagon(Number(this.value));
      scene.add(hexagon.getHexagon());
    };
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // let statsContainer = document.getElementById("position");

  function render() {
    controls.update();
    renderer.render(scene, camera);
    stats.update();
  }

  init();
};
