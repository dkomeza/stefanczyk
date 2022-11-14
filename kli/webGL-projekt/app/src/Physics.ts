interface physics {
  weight: number;
  wheelRadius: number;
  gravity: number;
  lastTime: number;
  timeDelta: number;
}
interface engine {
  maxHP: number;
  minHP: number;
  maxRPM: number;
  minRPM: number;
  currentHP: number;
  currentRPM: number;
  currentTorque: number;
}
interface gearbox {
  currentGear: number;
  previousGear: number;
  minGear: number;
  maxGear: number;
  gearRatio: number[];
  finalDriveRatio: number;
  currentTorque: number;
  currentRPM: number;
  wheelTorque: number;
  wheelRPM: number;
  wheelForce: number;
}
interface kinematics {
  currentSpeed: number;
  currentForce: number;
  currentAcceleration: number;
  currentInertia: number;
  currentAirResistance: number;
  currentRollingResistance: number;
}
interface engineClass {
  engine: engine;
  updateEngine: (rpm: number) => void;
  getTorque: () => number;
  getHP: (rpm: number) => number;
  calculateHP: (rpmScale: number, minHP: number, maxHP: number) => number;
}
interface gearboxClass {
  gearbox: gearbox;
  updateGearbox: (rpm: number, torque: number) => void;
  getWheelTorque: (torque: number, gear: number) => number;
  getWheelRPM: (rpm: number, gear: number) => number;
  adjustRPM: (rpm: number, previousGear: number, gear: number) => void;
  getWheelForce: (torque: number) => number;
  changeGear: (gear: "up" | "down") => void;
}
interface kinematicsClass {
  kinematics: kinematics;
  updateKinematics: () => void;
}
interface physicsData {
  currentHP: number;
  currentRPM: number;
  wheelForce: number;
  currentSpeed: number;
  currentGear: number;
  currentAcceleration: number;
}

class Physics {
  Engine: engineClass;
  Gearbox: gearboxClass;
  Kinematics: kinematicsClass;
  physics: physics;
  data: physicsData;
  constructor() {
    this.physics = {
      weight: 1000,
      wheelRadius: 0.31,
      gravity: 9.81,
      lastTime: performance.now(),
      timeDelta: 0,
    };
    this.Engine = new Engine();
    this.Gearbox = new Gearbox();
    this.Kinematics = new Kinematics(
      this.physics,
      this.Engine.engine,
      this.Gearbox.gearbox
    );
    this.data = {
      currentHP: this.Engine.engine.currentHP,
      currentRPM: this.Engine.engine.currentRPM,
      wheelForce: this.Gearbox.gearbox.wheelTorque,
      currentSpeed: this.Kinematics.kinematics.currentSpeed,
      currentGear: this.Gearbox.gearbox.currentGear,
      currentAcceleration: this.Kinematics.kinematics.currentAcceleration,
    };
  }

  updatePhysics() {
    this.Engine.updateEngine(this.Engine.engine.currentRPM);
    this.Gearbox.updateGearbox(
      this.Engine.engine.currentRPM,
      this.Engine.engine.currentTorque
    );
    console.log(this.Gearbox.gearbox.currentRPM);
    this.Engine.engine.currentRPM = this.Gearbox.gearbox.currentRPM;
    this.updateTime();
    this.Kinematics.updateKinematics();
    this.updatePhysicsData();
    console.log(this.data);
  }

  updateTime() {
    this.physics.timeDelta = performance.now() - this.physics.lastTime;
    this.physics.lastTime = performance.now();
  }

  updatePhysicsData() {
    this.data = {
      currentHP: this.Engine.engine.currentHP,
      currentRPM: this.Engine.engine.currentRPM,
      wheelForce: this.Gearbox.gearbox.wheelForce,
      currentSpeed: this.Kinematics.kinematics.currentSpeed,
      currentGear: this.Gearbox.gearbox.currentGear,
      currentAcceleration: this.Kinematics.kinematics.currentAcceleration,
    };
  }

  updateGearbox(direction: "up" | "down") {
    this.Gearbox.changeGear(direction);
  }
}

class Engine {
  engine: engine;
  constructor() {
    this.engine = {
      maxHP: 600,
      minHP: 40,
      maxRPM: 8800,
      minRPM: 800,
      currentHP: 0,
      currentRPM: 800,
      currentTorque: 0,
    };
  }
  updateEngine(rpm: number) {
    this.engine.currentRPM = rpm;
    this.engine.currentHP = this.getHP(this.engine.currentRPM);
    this.engine.currentTorque = this.getTorque();
  }
  getTorque() {
    return ((this.engine.currentHP * 5252) / this.engine.currentRPM) * 1.356;
  }
  getHP(rpm: number) {
    if (rpm < this.engine.minRPM) {
      return 0;
    } else {
      let rmpScale =
        ((rpm - this.engine.minRPM) /
          (this.engine.maxRPM - this.engine.minRPM)) *
        2;
      return this.calculateHP(rmpScale, this.engine.minHP, this.engine.maxHP);
    }
  }
  calculateHP(rpmScale: number, minHP: number, maxHP: number) {
    if (rpmScale <= 0) {
      return minHP;
    } else if (rpmScale > 0 && rpmScale <= 2) {
      return (
        minHP +
        (Math.round(
          0.96 * ((rpmScale - 1) / (Math.pow(rpmScale - 1, 2) + 1) + 0.5) * 100
        ) /
          100) *
          (maxHP - minHP)
      );
    } else {
      return maxHP;
    }
  }
}
class Gearbox {
  gearbox: gearbox;
  constructor() {
    this.gearbox = {
      currentGear: 0,
      previousGear: 0,
      minGear: -1,
      maxGear: 7,
      gearRatio: [3.42, 2.08, 1.36, 1, 0.74, 0.5, 0.34],
      finalDriveRatio: 3.42,
      currentTorque: 0,
      currentRPM: 0,
      wheelTorque: 0,
      wheelRPM: 0,
      wheelForce: 0,
    };
  }

  updateGearbox(rpm: number, torque: number) {
    this.gearbox.currentRPM = rpm;
    this.gearbox.currentTorque = torque;
    this.gearbox.wheelRPM = this.getWheelRPM(
      this.gearbox.currentRPM,
      this.gearbox.currentGear
    );
    this.gearbox.wheelTorque = this.getWheelTorque(
      this.gearbox.currentTorque,
      this.gearbox.currentGear
    );
    this.gearbox.wheelForce = this.getWheelForce(this.gearbox.wheelTorque);
  }
  getWheelTorque(torque: number, gear: number) {
    return torque * this.gearbox.gearRatio[gear - 1] * 0.92;
  }
  getWheelRPM(rpm: number, gear: number) {
    return rpm / this.gearbox.gearRatio[gear - 1];
  }
  adjustRPM(rpm: number, previousGear: number, gear: number) {
    this.gearbox.currentRPM =
      Math.round(
        rpm /
          (this.gearbox.gearRatio[previousGear - 1] /
            this.gearbox.gearRatio[gear - 1])
      ) > 8800
        ? 8800
        : Math.round(
            rpm /
              (this.gearbox.gearRatio[previousGear - 1] /
                this.gearbox.gearRatio[gear - 1])
          );
  }
  getWheelForce(torque: number) {
    return torque / 0.31;
  }
  changeGear(direction: "up" | "down") {
    if (direction === "up" && this.gearbox.currentGear < this.gearbox.maxGear) {
      this.gearbox.previousGear = this.gearbox.currentGear;
      this.gearbox.currentGear++;
      this.adjustRPM(
        this.gearbox.currentRPM,
        this.gearbox.previousGear,
        this.gearbox.currentGear
      );
    } else if (
      direction === "down" &&
      this.gearbox.currentGear > this.gearbox.minGear
    ) {
      this.gearbox.previousGear = this.gearbox.currentGear;
      this.gearbox.currentGear--;
      this.adjustRPM(
        this.gearbox.currentRPM,
        this.gearbox.previousGear,
        this.gearbox.currentGear
      );
    }
  }
}
class Kinematics {
  kinematics: kinematics;
  physics: physics;
  engine: engine;
  gearbox: gearbox;
  constructor(physics: physics, engine: engine, gearbox: gearbox) {
    this.kinematics = {
      currentSpeed: 0,
      currentForce: 0,
      currentAcceleration: 0,
      currentInertia: 0,
      currentAirResistance: 0,
      currentRollingResistance: 0,
    };
    this.physics = physics;
    this.engine = engine;
    this.gearbox = gearbox;
  }

  updateKinematics() {
    this.kinematics.currentSpeed = this.getWheelSpeed();
    // this.kinematics.currentInertia = this.getInertia();
    this.kinematics.currentRollingResistance = this.getRollingResistance();
    this.kinematics.currentAirResistance = this.getAirResistance();
    this.kinematics.currentForce = this.getForce();
    this.kinematics.currentAcceleration = this.getAcceleration(
      this.kinematics.currentForce,
      this.physics.weight
    );
    this.kinematics.currentSpeed = this.updateSpeed();
  }

  getWheelSpeed() {
    return (
      ((2 * Math.PI * this.physics.wheelRadius) / 60) * this.gearbox.wheelRPM
    );
  }

  getAcceleration(force: number, mass: number) {
    return force / mass;
  }

  getRollingResistance() {
    return 0.005 * this.physics.weight * this.physics.gravity;
  }

  getAirResistance() {
    return 0.05 * Math.pow(this.kinematics.currentSpeed, 2);
  }

  getForce() {
    return (
      this.gearbox.wheelForce -
      this.kinematics.currentAirResistance -
      this.kinematics.currentRollingResistance
    );
  }

  updateSpeed() {
    return (
      this.kinematics.currentSpeed +
      this.kinematics.currentAcceleration * (this.physics.timeDelta / 1000)
    );
  }
}

export default Physics;
