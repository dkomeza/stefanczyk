export default class Box extends THREE.Object3D {
  constructor() {
    super();
    this.add(this.createBox());
  }
  createBox() {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("../mats/block.png"),
      side: THREE.DoubleSide,
      specular: "#ffffff",
      shininess: 1,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.y = 50;
    return box;
  }
  getBox() {
    return this;
  }
}
