import { mat4 } from "gl-matrix";
import { camera } from "../index";
import { Camera } from "../webgl/camera";

var sensitivity = {
  x: Math.PI / 240,
  y: Math.PI / 360,
  z: Math.PI / 240,
};

var movementSpeed = 0.03;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
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
      move(camera, movementSpeed, "x");
      break;
    case "d":
      move(camera, -movementSpeed, "x");
      break;
    case "w":
      move(camera, -movementSpeed, "y");
      break;
    case "s":
      move(camera, movementSpeed, "y");
      break;
    case "e":
      move(camera, movementSpeed, "z");
      break;
    case "q":
      move(camera, -movementSpeed, "z");
    default:
      console.log(event.key);
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
