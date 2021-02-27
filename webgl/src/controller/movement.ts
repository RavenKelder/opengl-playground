import { vec3 } from "gl-matrix";
import { Camera } from "../webgl/camera";

export class Movement {
  element: HTMLElement;
  camera: Camera;
  velocity: vec3;
  enabled: boolean = false;
  unitsPerSecond: number;

  moving: vec3;
  isPressed: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    e: boolean;
    c: boolean;
  } = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false,
    c: false,
  };

  acceleration: number = 0.01;
  maxSpeed: number = 0.03;
  friction: number = 0.8;

  constructor(element: HTMLElement, camera: Camera, unitsPerSecond: number) {
    this.element = element;
    this.velocity = [0, 0, 0];
    this.moving = [0, 0, 0];

    this.camera = camera;
    this.unitsPerSecond = unitsPerSecond;

    element.addEventListener("keydown", (event) => {
      event.preventDefault();
      switch (event.key) {
        case "d":
          this.isPressed.d = true;
          break;
        case "a":
          this.isPressed.a = true;
          break;
        case "w":
          this.isPressed.w = true;
          break;
        case "s":
          this.isPressed.s = true;
          break;
        case "e":
          this.isPressed.e = true;
          break;
        case "c":
          this.isPressed.c = true;
          break;
        case "Shift":
          this.maxSpeed = 0.01;
          break;
      }

      console.log("down", event.key);
    });

    element.addEventListener("keyup", (event) => {
      event.preventDefault();
      switch (event.key) {
        case "d":
          this.isPressed.d = false;
          break;
        case "a":
          this.isPressed.a = false;
          break;
        case "w":
          this.isPressed.w = false;
          break;
        case "s":
          this.isPressed.s = false;
          break;
        case "e":
          this.isPressed.e = false;
          break;
        case "c":
          this.isPressed.c = false;
          break;
        case "Shift":
          this.maxSpeed = 0.03;
          break;
      }

      console.log("up", event.key);
    });
  }

  start(): boolean {
    if (this.enabled) {
      return false;
    }

    this.enabled = true;

    (async () => {
      while (this.enabled) {
        this.updateMovement();
        this.camera.eye = vec3.add(
          this.camera.eye,
          this.camera.eye,
          this.velocity
        );

        var n = vec3.dot(
          this.velocity,
          vec3.normalize(
            this.camera.eyeCoordinate.n,
            this.camera.eyeCoordinate.n
          )
        );

        this.camera.lookingAt = vec3.add(
          this.camera.lookingAt,
          this.camera.lookingAt,
          vec3.scale(vec3.create(), this.camera.eyeCoordinate.n, n)
        );

        var u = vec3.dot(
          this.velocity,
          vec3.normalize(
            this.camera.eyeCoordinate.u,
            this.camera.eyeCoordinate.u
          )
        );

        this.camera.lookingAt = vec3.add(
          this.camera.lookingAt,
          this.camera.lookingAt,
          vec3.scale(vec3.create(), this.camera.eyeCoordinate.u, u)
        );

        var v = vec3.dot(
          this.velocity,
          vec3.normalize(
            this.camera.eyeCoordinate.v,
            this.camera.eyeCoordinate.v
          )
        );

        this.camera.lookingAt = vec3.add(
          this.camera.lookingAt,
          this.camera.lookingAt,
          vec3.scale(vec3.create(), this.camera.eyeCoordinate.v, v)
        );

        await new Promise((res) => setTimeout(res, 1000 / this.unitsPerSecond));
      }
    })();

    return true;
  }
  stop(): boolean {
    if (!this.enabled) {
      return false;
    }

    this.enabled = false;
    return true;
  }

  updateMovement() {
    var movementU = 0;
    const { w, a, s, d, e, c } = this.isPressed;
    if (a) {
      movementU = movementU + this.acceleration;
    }
    if (d) {
      movementU = movementU - this.acceleration;
    }
    this.move(movementU, "u");

    var movementN = (w ? this.acceleration : 0) - (s ? this.acceleration : 0);
    this.move(movementN, "n");

    var movementV = (e ? this.acceleration : 0) - (c ? this.acceleration : 0);
    this.move(movementV, "v");

    this.velocity = [
      this.velocity[0] * this.friction,
      this.velocity[1] * this.friction,
      this.velocity[2] * this.friction,
    ];
  }

  move(amount: number, direction: "u" | "v" | "n") {
    var movement = vec3.create();
    vec3.normalize(movement, this.camera.eyeCoordinate[direction]);

    this.velocity = vec3.scaleAndAdd(
      this.velocity,
      this.velocity,
      movement,
      amount
    );

    if (vec3.dist([0, 0, 0], this.velocity) > this.maxSpeed) {
      vec3.normalize(this.velocity, this.velocity);
      vec3.scale(this.velocity, this.velocity, this.maxSpeed);
    }
  }
}
