// @ts-expect-error
import * as THREE from "three";

class Hexagon extends THREE.Object3D {
  constructor(radius = 15) {
    super();
    this.createWalls(radius);
    this.createBase(radius);
  }
  createWalls(radius) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(radius, radius / 4, radius / 20),
      new THREE.MeshNormalMaterial({})
    );
    for (var i = 0; i < 6; i++) {
      var side = wall.clone();
      side.position.z = (radius - 0.15 * radius) * Math.sin(deg2rad(i * 60));
      side.position.x = (radius - 0.15 * radius) * Math.cos(deg2rad(i * 60));
      side.lookAt(this.position);
      this.add(side);
    }
  }
  createBase(radius) {
    let base = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, 0.1, 6),
      new THREE.MeshNormalMaterial({})
    );
    base.position.y = -1.25;
    this.add(base);
  }
  getHexagon() {
    return this;
  }
}

function deg2rad(degrees) {
  return degrees * (Math.PI / 180);
}

export default Hexagon;
