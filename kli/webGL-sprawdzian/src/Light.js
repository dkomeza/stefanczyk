export default class Light extends THREE.SpotLight {
  constructor(index) {
    super({ color: "#ffff00", intensity: 1, angle: 45 });
    this.index = index;
    this.lightDistance = 400;
    this.lightHeight = 100;
    this.add(this.createSphere());
    this.setPosition();
  }
  setPosition() {
    const angle = this.index * 60;
    const x = Math.sin(this.deg2rad(angle)) * this.lightDistance;
    const z = Math.cos(this.deg2rad(angle)) * this.lightDistance;
    this.position.x = x;
    this.position.z = z;
    this.position.y = this.lightHeight;
    console.log(this);
    this.lookAt(0, 0, 0);
  }
  createSphere() {
    const bulbGeometry = new THREE.SphereGeometry(15, 30, 30);
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    return bulb;
  }
  changePosition(distance, height) {
    if (distance === -1) {
      this.lightHeight = height;
    } else {
      this.lightDistance = distance;
    }
    this.setPosition();
    this.lookAt(0, 0, 0);
  }
  changeColor(color) {
    this.color.setColorName(color);
    this.lookAt(0, 0, 0);
    console.log(this);
  }
  getLight() {
    return this;
  }
  deg2rad(deg) {
    return (deg / 180) * Math.PI;
  }
}
