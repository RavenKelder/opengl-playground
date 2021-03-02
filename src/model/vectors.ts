import { vec3 } from "gl-matrix";
import { Camera } from "../webgl/camera";

export abstract class Vector {
  abstract coordinate(): [number, number, number];
}

export class BedheadAttractor extends Vector {
  a: number;
  b: number;
  x: number;
  y: number;
  xOffset: number = 0;
  yOffset: number = 0;

  constructor(a: number = -0.81, b: number = -0.92) {
    super();
    this.a = a;
    this.b = b;
    this.x = 1.0;
    this.y = 1.0;
  }

  coordinate(): [number, number, number] {
    const { a, b, x, y, xOffset, yOffset } = this;
    var xNew = Math.sin((x * y) / b) + Math.cos(a * x - y);
    var yNew = x + Math.sin(y) / b;

    this.x = xNew;
    this.y = yNew;

    return [xNew + xOffset, yNew + yOffset, 0];
  }
}

export class LorenzAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  s: number;
  r: number;
  b: number;
  dt: number = 0.01;

  constructor(s: number = 10.0, r: number = 28.0, b: number = 2.667) {
    super();
    this.x = 0.0;
    this.y = 1.0;
    this.z = 1.05;

    this.s = s;
    this.r = r;
    this.b = b;
  }

  coordinate(): [number, number, number] {
    const { x, y, z, s, r, b, dt } = this;
    var xNew = s * (y - x);
    var yNew = r * x - y - x * z;
    var zNew = x * y - b * z;
    this.x = x + xNew * dt;
    this.y = y + yNew * dt;
    this.z = z + zNew * dt;

    return [this.x, this.y, this.z].map((e) => e * 0.1) as [
      number,
      number,
      number
    ];
  }
}

export class Grid extends Vector {
  i: number = 0;
  j: number = 0;
  k: number = 0;
  scale: number;
  max: number;
  constructor(max: number, scale: number) {
    super();
    this.max = max;
    this.scale = scale;
  }
  coordinate(): [number, number, number] {
    const { i, j, k, max, scale } = this;
    this.i = i + 1;

    if (this.i > max) {
      this.j = j + 1;
      this.i = 0;

      if (this.j > max) {
        this.k = k + 1;
        this.j = 0;

        if (this.k > max) {
          this.k = 0;
        }
      }
    }
    return [
      (i / max) * scale - scale / 2,
      (j / max) * scale - scale / 2,
      (k / max) * scale - scale / 2,
    ];
  }
}

export class HenonAttractor extends Vector {
  x: number = 1;
  y: number = 1;

  constructor() {
    super();
  }

  coordinate(): [number, number, number] {
    const { x, y } = this;
    const newX = y + 1 - 1.4 * Math.pow(x, 2);
    const newY = 0.3 * x;

    this.x = newX;
    this.y = newY;

    return [newX, newY, 0];
  }
}

export class CyclicSymmetricAttractor extends Vector {
  x: number = -0.5;
  y: number = -0.5;
  z: number = -0.25;
  b: number = 0.208186;
  dt: number = 0.05;
  scale: number = 0.5;
  constructor(b?: number) {
    super();
    if (b) {
      this.b = b;
    }
  }

  coordinate(): [number, number, number] {
    const { x, y, z, b, dt, scale } = this;
    const dX = (Math.sin(y) - b * x) * dt;
    const dY = (Math.sin(z) - b * y) * dt;
    const dZ = (Math.sin(x) - b * z) * dt;

    this.x = x + dX;
    this.y = y + dY;
    this.z = z + dZ;

    return [this.x * scale, this.y * scale, this.z * scale];
  }
}

export class MergedVectors extends Vector {
  counter: number = 0;
  vectors: Vector[] = [];

  constructor(...vectors: Vector[]) {
    super();
    this.vectors = vectors;
  }

  coordinate(): [number, number, number] {
    const { counter, vectors } = this;
    this.counter = counter % vectors.length;
    const index = this.counter;
    this.counter++;

    return vectors[index].coordinate();
  }
}

export class CameraVector extends Vector {
  camera: Camera;
  scale: number;
  index: number;
  pointsPerDirection: number;
  maxIndex: number;

  constructor(camera: Camera, scale = 5, pointsPerDirection = 300) {
    super();
    this.camera = camera;
    this.scale = scale;
    this.index = 0;
    this.pointsPerDirection = pointsPerDirection;
    this.maxIndex = pointsPerDirection * 3 + 2;
  }

  coordinate(): [number, number, number] {
    const { camera, scale, index, pointsPerDirection, maxIndex } = this;
    var result: vec3 = vec3.create();
    if (index === maxIndex - 2) {
      vec3.set(result, camera.eye[0], camera.eye[1], camera.eye[2]);
    } else if (index === maxIndex - 1) {
      vec3.set(
        result,
        camera.lookingAt[0],
        camera.lookingAt[1],
        camera.lookingAt[2]
      );
      vec3.sub(result, camera.eye, result);
    } else {
      const dir = Math.floor(index / pointsPerDirection);
      switch (dir) {
        case 0:
          vec3.set(
            result,
            camera.eyeCoordinate["u"][0],
            camera.eyeCoordinate["u"][1],
            camera.eyeCoordinate["u"][2]
          );
          break;
        case 1:
          vec3.set(
            result,
            camera.eyeCoordinate["v"][0],
            camera.eyeCoordinate["v"][1],
            camera.eyeCoordinate["v"][2]
          );
          break;
        case 2:
          vec3.set(
            result,
            camera.eyeCoordinate["n"][0],
            camera.eyeCoordinate["n"][1],
            camera.eyeCoordinate["n"][2]
          );
          break;
        default:
          result = [0, 0, 0];
          console.log("Warning: Invalid direction vector");
      }
      vec3.scale(
        result,
        result,
        (scale * (index % pointsPerDirection)) / pointsPerDirection
      );
      vec3.add(result, result, camera.eye);
    }

    this.index = this.index + 1;
    if (this.index >= maxIndex) {
      this.index = 0;
    }

    return [result[0], result[1], result[2]];
  }
}

export class CoordinatesVector extends Vector {
  camera: Camera;
  scale: number;
  index: number;
  maxIndex: number = 8;

  constructor(camera: Camera, scale = 0.2) {
    super();
    this.camera = camera;
    this.scale = scale;
    this.index = 0;
  }

  coordinate(): [number, number, number] {
    const { camera, scale, index, maxIndex } = this;
    var result: vec3 = vec3.create();
    switch (index) {
      case 0:
      case 2:
      case 4:
      case 6:
        vec3.set(result, camera.eye[0], camera.eye[1], camera.eye[2]);
        break;
      case 1:
        vec3.set(result, 0, 0, 1);
        vec3.scale(result, result, scale);
        vec3.add(result, result, camera.eye);
        break;
      case 3:
        vec3.set(result, 0, 1, 0);
        vec3.scale(result, result, scale);
        vec3.add(result, result, camera.eye);
        break;
      case 5:
        vec3.set(result, 1, 0, 0);
        vec3.scale(result, result, scale);
        vec3.add(result, result, camera.eye);
        break;
      case 7:
        vec3.set(
          result,
          camera.lookingAt[0],
          camera.lookingAt[1],
          camera.lookingAt[2]
        );
        vec3.scale(result, result, scale);
        vec3.sub(result, camera.eye, result);
    }

    vec3.scaleAndAdd(result, result, camera.eyeCoordinate["n"], 0.1);
    vec3.scaleAndAdd(result, result, camera.eyeCoordinate["u"], -0.02);
    vec3.scaleAndAdd(result, result, camera.eyeCoordinate["v"], -0.02);

    this.index = this.index + 1;
    if (this.index >= maxIndex) {
      this.index = 0;
    }

    return [result[0], result[1], result[2]];
  }
}
