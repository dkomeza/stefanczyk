interface physics {
  weight: number;
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
  updateGearbox: (rpm: number, torque: number, gear: number) => void;
  getWheelTorque: (torque: number, gear: number) => number;
  getWheelRPM: (rpm: number, gear: number) => number;
  adjustRPM: (rpm: number, previousGear: number, gear: number) => void;
  getWheelForce: (torque: number) => number;
}

interface kinematicsClass {
  kinematics: kinematics;
}

interface physicsData {
  currentHP: number;
  currentRPM: number;
  wheelForce: number;
  wheelSpeed: number;
  currentGear: number;
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
    };
    this.Engine = new Engine();
    this.Gearbox = new Gearbox();
    this.Kinematics = new Kinematics();
    this.data = {
      currentHP: this.Engine.engine.currentHP,
      currentRPM: this.Engine.engine.currentRPM,
      wheelForce: this.Gearbox.gearbox.wheelTorque,
      wheelSpeed: this.getWheelSpeed(),
      currentGear: this.Gearbox.gearbox.currentGear,
    };
  }
  updatePhysics(rpm: number, gear: number) {
    this.Engine.updateEngine(rpm);
    this.Gearbox.updateGearbox(
      this.Engine.engine.currentRPM,
      this.Engine.engine.currentTorque,
      gear
    );
    this.updateData();
    console.log(this.data);
  }

  updateData() {
    this.data = {
      currentHP: this.Engine.engine.currentHP,
      currentRPM: this.Engine.engine.currentRPM,
      wheelForce: this.Gearbox.gearbox.wheelForce,
      wheelSpeed: this.getWheelSpeed(),
      currentGear: this.Gearbox.gearbox.currentGear,
    };
  }

  getWheelSpeed() {
    return (this.Gearbox.gearbox.wheelRPM * 0.31 * 3 * Math.PI) / 25;
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
      currentRPM: 0,
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
      gearRatio: [3.42, 2.08, 1.36, 1, 0.74, 0.5, 0.34],
      finalDriveRatio: 3.42,
      currentTorque: 0,
      currentRPM: 0,
      wheelTorque: 0,
      wheelRPM: 0,
      wheelForce: 0,
    };
  }

  updateGearbox(rpm: number, torque: number, gear: number) {
    this.gearbox.currentRPM = rpm;
    this.gearbox.currentTorque = torque;
    this.gearbox.currentGear = gear;
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
}

class Kinematics {
  kinematics: kinematics;
  constructor() {
    this.kinematics = {
      currentSpeed: 0,
      currentForce: 0,
      currentAcceleration: 0,
      currentInertia: 0,
      currentAirResistance: 0,
      currentRollingResistance: 0,
    };
  }
}

export { Physics, Engine, Gearbox };
