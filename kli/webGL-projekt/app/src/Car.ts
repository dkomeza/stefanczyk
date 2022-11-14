// @ts-expect-error
import * as THREE from "three";

// @ts-expect-error
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// @ts-expect-error
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

class Car {
  static wheels: Array<any> = [];
  static container = new THREE.Object3D();
  car: void;
  constructor() {
    this.car = this.createCar();
  }
  createCar() {
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
    });

    const shadow = new THREE.TextureLoader().load("models/ferrari_ao.png");

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("modules/three.js/examples/js/libs/draco/gltf/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load("models/ferrari.glb", function (gltf: any) {
      const carModel = gltf.scene.children[0];

      carModel.getObjectByName("glass").material = glassMaterial;

      Car.wheels.push(
        carModel.getObjectByName("wheel_fl"),
        carModel.getObjectByName("wheel_fr"),
        carModel.getObjectByName("wheel_rl"),
        carModel.getObjectByName("wheel_rr")
      );

      // shadow
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
        new THREE.MeshBasicMaterial({
          map: shadow,
          blending: THREE.MultiplyBlending,
          toneMapped: false,
          transparent: true,
        })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 2;
      carModel.add(mesh);
      Car.container.add(carModel);
    });
  }
  getCar() {
    return Car.container;
  }
  getWheels() {
    return Car.wheels;
  }
  animateWheels(speed: number) {
    for (let i = 0; i < Car.wheels.length; i++) {
      Car.wheels[i].rotation.x -=
        ((25 * speed) / (Math.PI * 0.62 * 3) / 3600) * 2 * Math.PI;
    }
  }

  turnWheels(car: any, angle: number) {
    if (car.getObjectByName("wheel_fl")) {
      let angleS = car.getObjectByName("wheel_fl").rotation.x;
      car.getObjectByName("wheel_fl").rotation.z = -angle * Math.sin(angleS);
      car.getObjectByName("wheel_fr").rotation.z = -angle * Math.sin(angleS);
      car.getObjectByName("wheel_fl").rotation.y =
        angle * Math.cos(angleS) * 1.018;
      car.getObjectByName("wheel_fr").rotation.y =
        angle * Math.cos(angleS) * 1.018;
      car.getObjectByName("steering_wheel").rotation.y = -angle * 3;
    }
  }
}

export { Car };
