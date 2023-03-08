import * as THREE from "three";
import { Socket } from "socket.io-client";
import TWEEN from "@tweenjs/tween.js";

export default class Game {
  scene: Scene;
  board: Board;
  reycaster: Reycaster;
  selectedPawn: THREE.Object3D | null = null;
  boardPosition: number[] = [];
  color: "white" | "black" | null = null;
  socket: Socket | null = null;
  turn = "white";

  constructor(container: HTMLElement) {
    this.scene = new Scene(container);
    this.board = new Board(this.scene);
    this.reycaster = new Reycaster(this.scene.camera, this.scene.scene);
    this.createLight();
    this.handleClick();
    this.scene.renderer.setAnimationLoop(this.render.bind(this));
    for (let i = 0; i < 64; i++) {
      this.boardPosition.push(0);
    }
  }

  createLight() {
    const light = new THREE.AmbientLight("#FaFaFa", 0.8);
    // light.position.set(0, 10, 0);
    this.scene.scene.add(light);
  }

  addPlayer(color: "white" | "black", socket?: Socket) {
    this.color = color;
    if (color === "white") {
      this.scene.camera.position.set(25, 20, 0);
      this.scene.camera.lookAt(0, 0, 0);
    } else {
      this.scene.camera.position.set(-25, 20, 0);
      this.scene.camera.lookAt(0, 0, 0);
    }
    if (socket) {
      this.socket = socket;
      socket.emit("ready", "ready");
      socket.on("position", (data) => {
        this.boardPosition = data;
        this.board.updateBoard(data);
      });
      socket.on("move", (data) => {
        this.board.makeMove(data.data);
        this.board.removePawn(data.removePawns);
      });
      socket.on("timer", (data) => {
        console.log(data);
      });
    }
  }

  handleClick() {
    window.onmousedown = (e) => {
      const object: THREE.Object3D | undefined =
        this.reycaster.handleReycaster(e);
      if (!object) return;
      if (object.name === "pawn" && object.userData.color === this.color) {
        this.selectedPawn = object;
        this.board.hideLegalMoves();
        const material = (object as THREE.Mesh)
          .material as THREE.MeshPhongMaterial;
        material.emissive.setHex(0xffff00);
        this.board.showLegalMoves(
          this.selectedPawn.userData.square,
          this.socket!
        );
      }
      if (object.userData.available && this.selectedPawn) {
        this.board.hideLegalMoves();
        this.socket!.emit("move", {
          from: this.selectedPawn!.userData.square,
          to: object.userData.square,
        });
        this.selectedPawn = null;
      }
    };
  }

  render() {
    // this.scene.controls.update();
    TWEEN.update();
    this.scene.renderer.render(this.scene.scene, this.scene.camera);
  }
}

class Scene {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  // controls: OrbitControls;
  axes: THREE.AxesHelper;
  constructor(container: HTMLElement) {
    this.scene = this.createScene();
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();
    // this.controls = this.createControls(container);
    this.axes = this.createAxes();
    // this.scene.add(this.axes);
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
    camera.position.set(25, 20, 0);
    camera.lookAt(this.scene.position);
    return camera;
  }

  // createControls(container: HTMLElement) {
  //   const controls = new OrbitControls(this.camera, container);
  //   controls.enableDamping = true;
  //   controls.maxDistance = 120;
  //   controls.target.set(0, 0.5, 0);
  //   return controls;
  // }

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
  board: Pawn[][] = [];
  constructor(scene: Scene) {
    super();
    this.createBoard();
    scene.scene.add(this);
  }
  createBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const color = this.getColor(i, j);
        const square = new Square(color, i, j);
        this.add(square);
      }
    }
    this.position.set(-7, -0.5, -7);
    this.name = "board";
  }

  updateBoard(boardPosition: number[][]) {
    // delete pawns
    while (this.children.length > 64) {
      this.remove(this.children[64]);
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (boardPosition[i][j] === 1) {
          const pawn = new Pawn("white", i, j, false);
          this.add(pawn);
        } else if (boardPosition[i][j] === 2) {
          const pawn = new Pawn("black", i, j, false);
          // this.board[i][j] = pawn;
          this.add(pawn);
        } else if (boardPosition[i][j] === 3) {
          const pawn = new Pawn("white", i, j, true);
          // this.board[i][j] = pawn;
          this.add(pawn);
        } else if (boardPosition[i][j] === 4) {
          const pawn = new Pawn("black", i, j, true);
          // this.board[i][j] = pawn;
          this.add(pawn);
        }
      }
    }
  }

  showLegalMoves(square: { x: number; y: number }, socket: Socket) {
    socket.emit("legalMoves", square);
    socket.on("legalMoves", (data) => {
      for (let i = 0; i < data.length; i++) {
        const index = data[i].y * 8 + data[i].x;
        const block = this.children[index] as Square;
        const material = block.material as THREE.MeshPhongMaterial;
        material.emissive.set(0x00ff00);
        block.userData.available = true;
      }
    });
  }

  hideLegalMoves() {
    for (let i = 0; i < 64; i++) {
      (
        (this.children[i] as Square).material as THREE.MeshPhongMaterial
      ).emissive.set(0x000000);
      this.children[i].userData.available = false;
    }
    const pawns = this.children.filter((child) => child.name === "pawn");
    for (let i = 0; i < pawns.length; i++) {
      const material = (pawns[i] as THREE.Mesh)
        .material as THREE.MeshPhongMaterial;
      material.emissive.set(0x000000);
    }
  }

  makeMove(data: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  }) {
    const pawns = this.children.filter((child) => child.name === "pawn");
    pawns.forEach((pawn) => {
      if (
        pawn.userData.square.x === data.from.x &&
        pawn.userData.square.y === data.from.y
      ) {
        new TWEEN.Tween(pawn.position)
          .to(
            {
              x: data.to.y * 2,
              z: data.to.x * 2,
            },
            500
          )
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();
        pawn.userData.square.x = data.to.x;
        pawn.userData.square.y = data.to.y;
        // pawn.position.set(data.to.y * 2, 0.5, data.to.x * 2);
      }
    });
  }

  removePawn(data: { x: number; y: number }[]) {
    const pawns = this.children.filter((child) => child.name === "pawn");
    data.forEach((square) => {
      pawns.forEach((pawn) => {
        if (
          pawn.userData.square.x === square.x &&
          pawn.userData.square.y === square.y
        ) {
          this.remove(pawn);
        }
      });
    });
  }

  private getColor(i: number, j: number) {
    return (i + j) % 2 ? "black" : "white";
  }
}

class Square extends THREE.Mesh {
  constructor(color: "white" | "black", x: number, z: number) {
    super();
    const geometry = new THREE.BoxGeometry(2, 1, 2);
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load(
        `./src/assets/${color}-block-texture.jpg`
      ),
    });
    this.geometry = geometry;
    this.material = material;
    this.position.set(x * 2, 0, z * 2);
    this.name = "square";
    this.userData = {
      square: {
        x: z,
        y: x,
      },
      available: false,
    };
  }
}

class Pawn extends THREE.Mesh {
  pawnColor: "white" | "black";
  constructor(color: "white" | "black", i: number, j: number, queen: boolean) {
    super();
    this.material = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0,
      roughness: 0.1,
      specularIntensity: 1,
    });
    const height = queen ? 1.5 : 1;
    this.geometry = new THREE.CylinderGeometry(0.75, 0.75, height, 32);
    this.position.set(i * 2, 0.5, j * 2);
    this.pawnColor = color;
    this.name = "pawn";
    this.userData = {
      square: {
        x: j,
        y: i,
      },
      color: color,
    };
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
    if (!intersects.length) return;
    return intersects[0].object;
  }
}
