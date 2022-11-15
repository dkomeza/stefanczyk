// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Scene, Renderer, Camera, StatsClass } from "./Constructor.js";
import { Car } from "./Car.js";

import Physics from "./Physics.js";

import events from "./Events.js";

window.onload = function () {
  let camera: any, scene: any, renderer: any, controls: any, stats: any;
  let carClass: any, physics: any;
  let car: any;
  let keyDict = { w: false, a: false, s: false, d: false };
  let rpm = 8800;

  function init() {
    const container = document.getElementById("container");

    renderer = new Renderer(render).getRenderer();
    camera = new Camera().getCamera();
    scene = new Scene().getScene();
    stats = new StatsClass().getStats();

    container!.appendChild(renderer.domElement);
    container!.appendChild(stats.dom);

    window.addEventListener("resize", onWindowResize);

    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;
    controls.maxDistance = 9;
    controls.target.set(0, 0.5, 0);
    controls.update();

    carClass = new Car();
    car = carClass.getCar();
    scene.add(car);
    physics = new Physics();
    events(keyDict);
    // document.getElementById("air-resistance")!.oninput = function () {
    //   // @ts-expect-error
    //   physics.physics.airResistance = Number(this.value);
    // };
    // document.getElementById("air-resistance")!.oninput = function () {
    //   // @ts-expect-error
    //   physics.physics.airResistance = Number(this.value);
    // };
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          physics.updateGearbox("up");
          break;
        case "ArrowDown":
          physics.updateGearbox("down");
          break;
        case "KeyW":
          physics.setPedalState(true);
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "KeyW":
          physics.setPedalState(false);
      }
    });
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  let statsContainer = document.getElementById("position");

  function render() {
    controls.update();
    if (keyDict["w"]) {
      if (rpm < 8800) {
        rpm += 60;
      } else {
        rpm = 8800;
      }
    } else if (keyDict["s"]) {
      if (rpm > 800) {
        rpm -= 35;
      }
    } else {
      if (rpm > 800) {
        rpm -= 35;
      }
    }
    statsContainer!.innerHTML = JSON.stringify(
      {
        rpm: Math.round(physics.data.currentRPM),
        hp: Math.round(physics.data.currentHP),
        wheelForce: Math.round(physics.data.wheelForce),
        speed: Math.round(physics.data.currentSpeed * 3.6),
        gear: Math.round(physics.data.currentGear),
        acceleration: Math.round(physics.data.currentAcceleration * 100) / 100,
      },
      null,
      2
    );
    physics.updatePhysics(2000);
    renderer.render(scene, camera);
    stats.update();
  }

  init();
};
