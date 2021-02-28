import { vec3 } from "gl-matrix";
import { Camera } from "../webgl/camera";
import { Clock, ClockEvent } from "./clock";

export class Movement {
  element: HTMLElement;
  camera: Camera;
  velocity: vec3;
  rotation: vec3 = [0, 0, 0];
  enabled: boolean = false;

  moving: vec3;
  isPressed: {
    moveForward: boolean;
    moveLeft: boolean;
    moveBack: boolean;
    moveRight: boolean;
    moveUp: boolean;
    moveDown: boolean;
    yawLeft: boolean;
    yawRight: boolean;
    pitchUp: boolean;
    pitchDown: boolean;
    rollLeft: boolean;
    rollRight: boolean;
  } = {
    moveForward: false,
    moveLeft: false,
    moveBack: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    yawLeft: false,
    yawRight: false,
    pitchUp: false,
    pitchDown: false,
    rollLeft: false,
    rollRight: false,
  };

  acceleration: number = 0.005;
  rotationAcceleration: number = 0.02;
  maxSpeed: number = 0.03;
  friction: number = 0.99;

  constructor(element: HTMLElement, camera: Camera, clock: Clock) {
    this.element = element;
    this.velocity = [0, 0, 0];
    this.moving = [0, 0, 0];

    this.camera = camera;

    element.addEventListener("keydown", (event) => {
      event.preventDefault();
      switch (event.key) {
        case "d":
          this.isPressed.moveRight = true;
          break;
        case "a":
          this.isPressed.moveLeft = true;
          break;
        case "w":
          this.isPressed.moveForward = true;
          break;
        case "s":
          this.isPressed.moveBack = true;
          break;
        case " ":
          this.isPressed.moveUp = true;
          break;
        case "Shift":
          this.isPressed.moveDown = true;
          break;
        case "ArrowLeft":
          this.isPressed.yawLeft = true;
          break;
        case "ArrowRight":
          this.isPressed.yawRight = true;
          break;
        case "ArrowUp":
          this.isPressed.pitchUp = true;
          break;
        case "ArrowDown":
          this.isPressed.pitchDown = true;
          break;
        case "q":
          this.isPressed.rollLeft = true;
          break;
        case "e":
          this.isPressed.rollRight = true;
          break;
      }
    });

    element.addEventListener("keyup", (event) => {
      event.preventDefault();
      switch (event.key) {
        case "d":
          this.isPressed.moveRight = false;
          break;
        case "a":
          this.isPressed.moveLeft = false;
          break;
        case "w":
          this.isPressed.moveForward = false;
          break;
        case "s":
          this.isPressed.moveBack = false;
          break;
        case " ":
          this.isPressed.moveUp = false;
          break;
        case "Shift":
          this.isPressed.moveDown = false;
          break;
        case "ArrowLeft":
          this.isPressed.yawLeft = false;
          break;
        case "ArrowRight":
          this.isPressed.yawRight = false;
          break;
        case "ArrowUp":
          this.isPressed.pitchUp = false;
          break;
        case "ArrowDown":
          this.isPressed.pitchDown = false;
          break;
        case "q":
          this.isPressed.rollLeft = false;
          break;
        case "e":
          this.isPressed.rollRight = false;
          break;
      }
    });

    clock.addEventListener("tick", (event: Event) => {
      if (event instanceof ClockEvent) {
        this.updateMovement(event.sinceLastTick / 1000);
      } else {
        console.log("Invalid event type");
      }
      this.camera.move(this.velocity);
      this.camera.rotate(this.rotation[0], "u");
      this.camera.rotate(this.rotation[1], "v");
      this.camera.rotate(this.rotation[2], "n");
    });
  }

  updateMovement(dt: number) {
    const {
      moveForward,
      moveLeft,
      moveBack,
      moveRight,
      moveUp,
      moveDown,
      yawLeft,
      yawRight,
      pitchUp,
      pitchDown,
      rollLeft,
      rollRight,
    } = this.isPressed;

    var movement: vec3 = vec3.set(
      vec3.create(),
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      (moveForward ? 1 : 0) - (moveBack ? 1 : 0),
      (moveUp ? 1 : 0) - (moveDown ? 1 : 0)
    );

    vec3.normalize(movement, movement);

    vec3.scale(movement, movement, this.acceleration * dt);

    this.move(movement[0], "u");
    this.move(movement[1], "n");
    this.move(movement[2], "v");

    this.velocity = [
      this.velocity[0] * this.friction,
      this.velocity[1] * this.friction,
      this.velocity[2] * this.friction,
    ];

    var rotation: vec3 = vec3.set(
      vec3.create(),
      (pitchUp ? 1 : 0) - (pitchDown ? 1 : 0),
      (yawLeft ? 1 : 0) - (yawRight ? 1 : 0),
      (rollRight ? 1 : 0) - (rollLeft ? 1 : 0)
    );

    vec3.normalize(rotation, rotation);
    vec3.scale(rotation, rotation, this.rotationAcceleration * dt);

    this.rotation = vec3.add(this.rotation, this.rotation, rotation);

    this.rotation = [
      this.rotation[0] * this.friction,
      this.rotation[1] * this.friction,
      this.rotation[2] * this.friction,
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
