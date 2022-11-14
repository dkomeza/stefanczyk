// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Scene, Renderer, Camera, StatsClass } from "./Constructor.js";
import { Car } from "./Car.js";

import { Physics, Engine, Gearbox } from "./Physics.js";

import events from "./Events.js";

window.onload = function () {
  let camera: any, scene: any, renderer: any, controls: any, stats: any;
  let carClass: any, physics: any, engine: any, gearbox: any;
  let car: any;
  let keyDict = { w: false, a: false, s: false, d: false };
  let rpm = 8800;
  // let wheelRPM, wheelSpeed;
  let hp = 0;
  let torque = 0;
  let finalTorque = 0;
  let wheelForce = 0;
  let gear = 4;
  let speed = 0;

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
    engine = new Engine();
    gearbox = new Gearbox();
    physics.updatePhysics(2000, 1);
    events(keyDict);
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          console.log(gear);
          if (gear < 7) {
            gear++;
            rpm = gearbox.adjustRPM(rpm, gear - 1, gear);
          }
          break;
        case "ArrowDown":
          if (gear >= 0) {
            gear--;
            rpm = gearbox.adjustRPM(rpm, gear + 1, gear);
          }
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
    // hp = Math.round(engine.getHP(rpm));
    // engine.getEngine().currentHP = hp;
    // engine.getEngine().currentRPM = rpm;
    // torque = Math.round(engine.getTorque());
    // finalTorque = Math.round(gearbox.getTorque(torque, gear));
    // wheelForce = Math.round(physics.getWheelForce(finalTorque));
    // wheelRPM = Math.round(gearbox.getWheelRPM(rpm, gear));
    // wheelSpeed = Math.round(physics.getWheelSpeed(wheelRPM));

    speed +=
      Math.round(
        ((wheelForce + (-200 * Math.round(wheelForce / 30)) / 10) / 30) * 3.6
      ) / 10;

    statsContainer!.innerText = JSON.stringify(
      {
        rpm: rpm,
        // wheelRPM: wheelRPM,
        // wheelSpeed: wheelSpeed,
        hp: hp,
        acceleration:
          Math.round(
            (wheelForce + (-200 * Math.round(wheelForce / 30)) / 10) / 30
          ) / 10,
        speed: speed,
        inertia: (-300 * Math.round(wheelForce / 30)) / 10,
        torque: torque,
        finalTorque: finalTorque,
        gear: gear,
        wheelForce: wheelForce,
        finalForce: wheelForce + (-200 * Math.round(wheelForce / 30)) / 10,
      },
      null,
      2
    );
    renderer.render(scene, camera);
    stats.update();
  }

  init();
};
