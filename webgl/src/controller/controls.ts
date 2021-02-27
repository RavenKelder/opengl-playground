import { mat4 } from "gl-matrix";
import { camera } from "../index";
import { Camera } from "../webgl/camera";
import { clock } from "./clock";

var sensitivity = {
  x: Math.PI / 240,
  y: Math.PI / 360,
  z: Math.PI / 240,
};

var movementSpeed = 0.03;

var movement = {
  x: 0,
  y: 0,
  z: 0,
};

const gravity = 0.0005;
var jumpCount = 0;
const maxJumps = 3;

const friction = 0.9;
const airResistance = 0.99;

clock.addEventListener("tick", () => {
  if (camera) {
    move(camera, movement.x, "x");
    move(camera, movement.y, "y");
    move(camera, movement.z, "z");
  }

  movement.x = movement.x * friction;
  movement.y = movement.y * airResistance;
  movement.z = movement.z * friction;

  if (camera) {
    if (camera.translation[1] < 0) {
      movement.y = movement.y + gravity;
    } else {
      movement.y = 0;
    }
  }

  if (Math.abs(movement.y) < 0.001) {
    jumpCount = 0;
  }
});

clock.start();

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case " ":
      if (jumpCount < maxJumps) {
        movement.y = -0.01;
        jumpCount++;
      }
      break;
    case "x":
      if (clock.enabled) {
        clock.stop();
      } else {
        clock.start();
      }
      break;
    case ".":
      break;
    case ",":
      break;
    case "ArrowUp":
      rotate(camera, sensitivity.x, "x");
      break;
    case "ArrowDown":
      rotate(camera, -sensitivity.x, "x");
      break;
    case "ArrowLeft":
      rotate(camera, -sensitivity.y, "y");
      break;
    case "ArrowRight":
      rotate(camera, sensitivity.y, "y");
      break;
    case "a":
      movement.x = movement.x + 0.01;
      break;
    case "d":
      movement.x = movement.x - 0.01;
      break;
    case "w":
      movement.z = movement.z + 0.01;
      break;
    case "s":
      movement.z = movement.z - 0.01;
      break;
    case "e":
      movement.y = movement.y - 0.01;
      break;
    case "c":
      movement.y = movement.y + 0.01;
    default:
      console.log(event.key);
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
  }
});

function move(camera: Camera, amount: number, axis: "x" | "y" | "z") {
  var axisIndex: number;

  switch (axis) {
    case "x":
      axisIndex = 0;
      break;
    case "y":
      axisIndex = 1;
      break;
    case "z":
      axisIndex = 2;
      break;
  }

  camera.transformationMatrix = mat4.translate(
    camera.transformationMatrix,
    camera.transformationMatrix,
    [
      axis === "x" ? amount : 0,
      axis === "y" ? amount : 0,
      axis === "z" ? amount : 0,
    ]
  );

  camera.translation[axisIndex] = camera.translation[axisIndex] + amount;
}

function rotate(camera: Camera, amount: number, axis: "x" | "y" | "z") {
  var axisIndex: number;

  switch (axis) {
    case "x":
      axisIndex = 0;
      break;
    case "y":
      axisIndex = 1;
      break;
    case "z":
      axisIndex = 2;
      break;
  }
  const { translation } = camera;

  camera.transformationMatrix = mat4.translate(
    camera.transformationMatrix,
    camera.transformationMatrix,
    [-translation[0], -translation[1], -translation[2]]
  );

  camera.transformationMatrix = mat4.rotate(
    camera.transformationMatrix,
    camera.transformationMatrix,
    amount,
    [axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0]
  );

  camera.transformationMatrix = mat4.translate(
    camera.transformationMatrix,
    camera.transformationMatrix,
    translation
  );
}

class MovementController extends EventTarget {}
