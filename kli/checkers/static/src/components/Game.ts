import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Game {
  scene: Scene;
  board: Board;
  reycaster: Reycaster;
  players: Player[] = [];
  selectedPawn: THREE.Object3D | null = null;

  constructor(container: HTMLElement) {
    this.scene = new Scene(container);
    this.board = new Board(this.scene);
    this.reycaster = new Reycaster(this.scene.camera, this.scene.scene);
    this.createLight();
    this.handleClick();
    this.scene.renderer.setAnimationLoop(this.render.bind(this));
  }

  createLight() {
    const light = new THREE.DirectionalLight("#FaFaFa", 1);
    light.position.set(10, 10, 0);
    this.scene.scene.add(light);
  }

  addPlayer(color: "white" | "black") {
    const player = new Player(color);
    this.players.push(player);
    this.scene.scene.add(player);
  }

  handleClick() {
    window.onmousedown = (e) => {
      const object: THREE.Object3D = this.reycaster.handleReycaster(e);
      if (object.name === "pawn") {
        this.selectedPawn = object;
      }
      if (object.name === "square" && this.selectedPawn) {
        const { x, z } = object.position;
        this.selectedPawn.position.set(x, 0, z);
        this.selectedPawn = null;
      }
    };
  }

  render() {
    // this.scene.controls.update();
    this.scene.renderer.render(this.scene.scene, this.scene.camera);
  }
}

class Scene {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  axes: THREE.AxesHelper;
  constructor(container: HTMLElement) {
    this.scene = this.createScene();
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();
    this.controls = this.createControls(container);
    this.axes = this.createAxes();
    this.scene.add(this.axes);
    window.onresize = this.handleResize.bind(this);
    container.appendChild(this.renderer.domElement);
  }

  createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    return scene;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(20, 20, 0);
    return camera;
  }

  createControls(container: HTMLElement) {
    const controls = new OrbitControls(this.camera, container);
    controls.enableDamping = true;
    controls.maxDistance = 120;
    controls.target.set(0, 0.5, 0);
    return controls;
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createAxes() {
    const axes = new THREE.AxesHelper(1000);
    return axes;
  }
}

class Board extends THREE.Object3D {
  constructor(scene: Scene) {
    super();
    this.createBoard();
    scene.scene.add(this);
  }
  createBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = this.getColor(i, j);
        const x = i * 2;
        const z = j * 2;
        const block = new Square(color, x, z);
        this.add(block);
      }
    }
    this.position.set(-7, -0.5, -7);
  }

  private getColor(i: number, j: number) {
    return (i + j) % 2 ? "black" : "white";
  }
}

class Square extends THREE.Mesh {
  constructor(color: "white" | "black", x: number, z: number) {
    super();
    const geometry = new THREE.BoxGeometry(2, 1, 2);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load(
        `./src/assets/${color}-block-texture.jpg`
      ),
    });
    this.geometry = geometry;
    this.material = material;
    this.position.set(x, 0, z);
    this.name = "square";
  }
}

class Player extends THREE.Object3D {
  color: "white" | "black";
  pawns: Pawn[] = [];
  constructor(color: "white" | "black") {
    super();
    this.color = color;
    this.createPawns();
    this.position.set(-7, 0, -7);
  }

  createPawns() {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const { x, z } = this.getPosition(i, j, this.color);
        const pawn = new Pawn(this.color, x, z);
        this.pawns.push(pawn);
        this.add(pawn);
      }
    }
  }

  getPosition(i: number, j: number, color: "white" | "black") {
    if (color === "white") {
      const x = 12 + i * 2;
      const translation = (1 - i) * 2;
      const z = j * 4 + translation;
      return { x, z };
    } else {
      const x = i * 2;
      const translation = (1 - i) * 2;
      const z = j * 4 + translation;
      return { x, z };
    }
  }
}

class Pawn extends THREE.Mesh {
  pawnColor: "white" | "black";
  constructor(color: "white" | "black", x: number, z: number) {
    super();
    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0,
      roughness: 0.1,
      specularIntensity: 1,
    });
    this.geometry = new THREE.CylinderGeometry(0.75, 0.75, 1, 32);
    this.position.set(x, 0, z);
    this.pawnColor = color;
    this.name = "pawn";
  }
}

class Reycaster extends THREE.Raycaster {
  camera: THREE.Camera;
  scene: THREE.Scene;
  mouseVector: THREE.Vector2;
  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    super();
    this.camera = camera;
    this.scene = scene;
    this.mouseVector = new THREE.Vector2();
  }
  handleReycaster(e: MouseEvent) {
    this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.setFromCamera(this.mouseVector, this.camera);
    const intersects = this.intersectObjects(this.scene.children);
    return intersects[0].object;
  }
}
