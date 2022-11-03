class Car {
  constructor() {
    this.container = new THREE.Object3D();
    this.createCar();
    this.createLights();
  }
  createCar() {
    let body = new THREE.Mesh(
      new THREE.BoxGeometry(100, 60, 200),
      new THREE.MeshPhongMaterial({ color: "#FFF000" })
    );
    body.position.set(0, 20, 40);
    let upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(80, 30, 100),
      new THREE.MeshPhongMaterial({
        color: "#FFFF00",
        transparent: true,
        opacity: 0.5,
      })
    );
    upperBody.position.set(0, 65, 40);
    this.container.add(body);
    this.container.add(upperBody);
    for (let i = 0; i < 4; i++) {
      let wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(20, 20, 10, 100),
        new THREE.MeshPhongMaterial({ color: "#0f0f0f" })
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.rotation.z = Math.PI / 2;
      i % 2 === 0
        ? wheel.position.set(50, 0, i * 50)
        : wheel.position.set(-50, 0, (i - 1) * 50);

      this.container.add(wheel);
    }
  }
  createLights() {
    for (let i = 0; i < 2; i++) {
      let positionX = i === 0 ? -30 : 30;
      const lightHelper = new THREE.Mesh(
        new THREE.SphereGeometry(5, 20, 20),
        new THREE.MeshBasicMaterial({ color: "#FFFF00", visible: false })
      );
      lightHelper.position.set(positionX, 30, -80);
      let light = new THREE.SpotLight(
        "#ffffff",
        1,
        1000,
        Math.PI / 6,
        Math.PI / 2
      );
      light.position.set(positionX, 30, -60);
      light.target = lightHelper;
      this.container.add(lightHelper);
      this.container.add(light);
      const headLight = new THREE.Mesh(
        new THREE.BoxGeometry(20, 10, 5),
        new THREE.MeshPhongMaterial({ color: "#FFFFFF", shininess: 100 })
      );
      headLight.position.set(positionX, 30, -60);
      let light2 = new THREE.SpotLight(
        "#ffffff",
        1,
        60,
        Math.PI / 6,
        Math.PI / 2
      );
      light2.position.set(positionX, 30, -90);
      light2.target = headLight;
      light2.castShadow = true;
      this.container.add(light2);
      this.container.add(headLight);
    }
    for (let i = 0; i < 2; i++) {
      let positionX = i === 0 ? -30 : 30;
      const lightHelper = new THREE.Mesh(
        new THREE.SphereGeometry(5, 20, 20),
        new THREE.MeshBasicMaterial({ color: "#FFFF00", visible: false })
      );
      lightHelper.position.set(positionX, 30, 160);
      let light = new THREE.SpotLight(
        "#ff0000",
        1,
        1000,
        Math.PI / 6,
        Math.PI / 2
      );
      light.position.set(positionX, 30, 140);
      light.target = lightHelper;
      this.container.add(lightHelper);
      this.container.add(light);
      const headLight = new THREE.Mesh(
        new THREE.BoxGeometry(20, 10, 5),
        new THREE.MeshPhongMaterial({ color: "#FF0000", shininess: 100 })
      );
      headLight.position.set(positionX, 30, 138);
      let light2 = new THREE.SpotLight(
        "#ff0000",
        1,
        60,
        Math.PI / 6,
        Math.PI / 2
      );
      light2.position.set(positionX, 30, 140);
      light2.target = headLight;
      light2.castShadow = true;
      this.container.add(light2);
      this.container.add(headLight);
    }
  }
  getCar() {
    return this.container;
  }
}
