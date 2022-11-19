interface physics {
  weight: number;
  weightDistribution: number;
  wheelRadius: number;
  gravity: number;
  airResistance: number;
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
  currentPedalState: boolean;
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

interface tyre {
  currentForce: number[];
  weight: number;
  downforce: number;
  grip: number;
  width: number;
  finalForce: number;
}
interface kinematics {
  currentSpeed: number;
  currentForce: number;
  currentAcceleration: number;
  currentInertia: number;
  currentAirResistance: number;
  currentRollingResistance: number;
  currentWheelRPM: number;
  frontDownforce: number;
  rearDownforce: number;
}
interface engineClass {
  engine: engine;
  revLimit: (rpm: number) => number;
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
  adjustRPM: (rpm: number, previousGear: number, gear: number) => number;
  getWheelForce: (torque: number) => number;
  changeGear: (gear: "up" | "down") => void;
  getEngineRPM: (rpm: number, gear: number) => number;
}
interface kinematicsClass {
  kinematics: kinematics;
  updateKinematics: () => void;
  getWheelRPM: () => number;
}
interface tyresClass {
  tyres: {
    front: tyres;
    rear: tyres;
  };
  checkRearGrip: (force: number) => number;
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
      weightDistribution: 0.6,
      wheelRadius: 0.31,
      gravity: 9.81,
      airResistance: 0.5,
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
    this.Engine.updateEngine(
      this.Gearbox.getEngineRPM(
        this.Kinematics.getWheelRPM(),
        this.Gearbox.gearbox.currentGear
      )
    );
    this.Gearbox.updateGearbox(
      this.Engine.engine.currentRPM,
      this.Engine.engine.currentTorque
    );
    this.updateTime();
    this.Kinematics.updateKinematics();
    this.updatePhysicsData();
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

  setPedalState(state: boolean) {
    this.Engine.engine.currentPedalState = state;
  }
}

class Engine {
  engine: engine;
  constructor() {
    this.engine = {
      maxHP: 60000,
      minHP: 40,
      maxRPM: 8800,
      minRPM: 800,
      currentHP: 0,
      currentRPM: 800,
      currentTorque: 0,
      currentPedalState: false,
    };
  }
  revLimit(rpm: number) {
    return rpm < 800 ? 800 : rpm > 8800 ? 8750 : rpm;
  }
  updateEngine(rpm: number) {
    this.engine.currentRPM = this.revLimit(rpm);
    this.engine.currentHP = this.engine.currentPedalState
      ? this.getHP(this.engine.currentRPM)
      : 0;
    this.engine.currentTorque = this.getTorque();
  }
  getTorque() {
    return ((this.engine.currentHP * 5252) / this.engine.currentRPM) * 1.356;
  }
  getHP(rpm: number) {
    if (rpm < this.engine.minRPM) {
      return this.engine.minHP;
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
          0.96 * ((rpmScale - 1) / (Math.pow(rpmScale - 1, 2) + 1) + 0.5) * 1000
        ) /
          1000) *
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
      gearRatio: [3.5, 2.08, 1.54, 1.26, 1.1, 0.98, 0.88],
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
    if (gear === 0) {
      return 0;
    }
    return (
      torque *
      this.gearbox.gearRatio[gear - 1] *
      this.gearbox.finalDriveRatio *
      0.92
    );
  }
  getWheelRPM(rpm: number, gear: number) {
    if (gear === 0) {
      return 0;
    } else {
      return (
        rpm / (this.gearbox.gearRatio[gear - 1] * this.gearbox.finalDriveRatio)
      );
    }
  }
  adjustRPM(rpm: number, previousGear: number, gear: number) {
    return Math.round(
      rpm /
        (this.gearbox.gearRatio[previousGear - 1] /
          this.gearbox.gearRatio[gear - 1])
    );
  }
  getWheelForce(torque: number) {
    return Math.round(torque / 0.31);
  }
  changeGear(direction: "up" | "down") {
    if (direction === "up" && this.gearbox.currentGear < this.gearbox.maxGear) {
      this.gearbox.currentGear++;
    } else if (
      direction === "down" &&
      this.gearbox.currentGear > this.gearbox.minGear &&
      this.adjustRPM(
        this.gearbox.currentRPM,
        this.gearbox.currentGear,
        this.gearbox.currentGear - 1
      ) <= 8800
    ) {
      this.gearbox.currentGear--;
    }
  }
  getEngineRPM(wheelRPM: number, gear: number) {
    if (gear === 0) {
      return 800;
    }
    return (
      wheelRPM *
      (this.gearbox.gearRatio[gear - 1] * this.gearbox.finalDriveRatio)
    );
  }
}
class Kinematics {
  kinematics: kinematics;
  physics: physics;
  engine: engine;
  gearbox: gearbox;
  Tyres: tyresClass;
  constructor(physics: physics, engine: engine, gearbox: gearbox) {
    this.kinematics = {
      currentSpeed: 0,
      currentForce: 0,
      currentAcceleration: 0,
      currentInertia: 0,
      currentAirResistance: 0,
      currentRollingResistance: 0,
      currentWheelRPM: 0,
      frontDownforce: 0,
      rearDownforce: 0,
    };
    this.physics = physics;
    this.engine = engine;
    this.gearbox = gearbox;
    this.Tyres = new Tyres(this.kinematics);
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
    // console.log(this.kinematics.currentAcceleration);
    this.kinematics.currentSpeed = this.updateSpeed();
    this.kinematics.currentWheelRPM = this.getWheelRPM();
    this.kinematics.frontDownforce = this.getFrontDownforce();
    this.kinematics.rearDownforce = this.getRearDownforce();
  }

  getWheelSpeed() {
    return (
      ((2 * Math.PI * this.physics.wheelRadius) / 60) * this.gearbox.wheelRPM
    );
  }

  getWheelRPM() {
    return (
      this.kinematics.currentSpeed /
      ((2 * Math.PI * this.physics.wheelRadius) / 60)
    );
  }

  getAcceleration(force: number, mass: number) {
    return force / mass;
  }

  getRollingResistance() {
    return this.kinematics.currentSpeed > 0
      ? 0.005 * this.physics.weight * this.physics.gravity
      : 0;
  }

  getAirResistance() {
    return (
      this.physics.airResistance * Math.pow(this.kinematics.currentSpeed, 2)
    );
  }

  getForce() {
    return (
      this.Tyres.checkRearGrip(this.gearbox.wheelForce) -
      this.kinematics.currentAirResistance -
      this.kinematics.currentRollingResistance
    );
  }

  getFrontDownforce() {
    return Math.pow(this.kinematics.currentSpeed, 2) * 0.2;
  }

  getRearDownforce() {
    return Math.pow(this.kinematics.currentSpeed, 2) * 0.3;
  }

  updateSpeed() {
    return (
      this.kinematics.currentSpeed +
      this.kinematics.currentAcceleration * (this.physics.timeDelta / 1000)
    );
  }
}
class Tyres {
  tyres: {
    front: {
      left: tyre;
      right: tyre;
    };
    rear: {
      left: tyre;
      right: tyre;
      finalForce: number;
    };
  };
  kinematics: kinematics;
  constructor(kinematics: kinematics) {
    this.tyres = {
      front: {
        left: {
          currentForce: [0, 0],
          weight: 0,
          downforce: 0,
          grip: 0.5,
          width: 0.225,
          finalForce: 0,
        },
        right: {
          currentForce: [0, 0],
          weight: 0,
          downforce: 0,
          grip: 0.5,
          width: 0.225,
          finalForce: 0,
        },
      },
      rear: {
        left: {
          currentForce: [0, 0],
          weight: 0,
          downforce: 0,
          grip: 0.5,
          width: 0.265,
          finalForce: 0,
        },
        right: {
          currentForce: [0, 0],
          weight: 0,
          downforce: 0,
          grip: 0.5,
          width: 0.265,
          finalForce: 0,
        },
        finalForce: 0,
      },
    };
    this.kinematics = kinematics;
  }

  updateTyres(engineForce: number, downforce: number[]) {
    this.tyres.rear.finalForce = this.getRearGrip(engineForce);
  }

  getRearGrip(engineForce: number) {
    this.tyres.rear.left.downforce;
    return 0;
  }

  checkRearGrip(force: number) {
    if (force > this.tyres.rear.left.finalForce) {
      return force;
    } else {
      return force;
    }
  }
}

export default Physics;
