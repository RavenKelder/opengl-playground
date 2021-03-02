/**
 * Point generation algorithms, mostly based on strange attractors
 *   https://www.dynamicmath.xyz/strange-attractors/#intro
 */
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
  originalR = 28;
  originalB = 2.667;
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

    setInterval(() => {
      this.r =
        this.originalR +
        Math.sin((2 * Math.PI * new Date().getTime()) / 10000) * 30;
    }, 100);
    setInterval(() => {
      this.b =
        this.originalB +
        Math.sin((2 * Math.PI * new Date().getTime()) / 5000) * 2;
    }, 100);
  }

  coordinate(): [number, number, number] {
    const { x, y, z, s, r, b, dt } = this;
    var xNew = s * (y - x);
    var yNew = r * x - y - x * z;
    var zNew = x * y - b * z;
    this.x = x + xNew * dt;
    this.y = y + yNew * dt;
    this.z = z + zNew * dt;

    return [this.x, this.y, this.z].map((e) => e * 0.04) as [
      number,
      number,
      number
    ];
  }
}

export class DadrasAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  scale: number;
  dt: number = 0.01;
  clamp: number = 20;

  constructor(
    a: number = 3.0,
    b: number = 2.7,
    c: number = 1.7,
    d: number = 2.0,
    e: number = 9.0,
    scale: number = 2
  ) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.scale = scale;

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
  }

  coordinate(): [number, number, number] {
    const { x, y, z, clamp, dt, a, b, c, d, e } = this;
    var xNew = y - a * x + b * y * z;
    var yNew = c * y - x * z + z;
    var zNew = d * x * y - e * z;

    this.x += dt * xNew;
    this.y += dt * yNew;
    this.z += dt * zNew;
    if (x > clamp || y > clamp || z > clamp) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    return [this.x, this.y, this.z].map((e) => e * 0.1) as [
      number,
      number,
      number
    ];
  }
}

export class HalvorsenAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  a: number;
  scale: number;
  dt: number = 0.01;
  clamp: number = 20;

  constructor(a: number = 1.89, scale: number = 2) {
    super();
    this.a = a;
    this.scale = scale;

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
  }

  coordinate(): [number, number, number] {
    const { x, y, z, clamp, dt, a } = this;
    var xNew = -a * x - 4 * y - 4 * z - y * y;
    var yNew = -a * y - 4 * z - 4 * x - z * z;
    var zNew = -a * z - 4 * x - 4 * y - x * x;

    this.x += dt * xNew;
    this.y += dt * yNew;
    this.z += dt * zNew;
    if (x > clamp || y > clamp || z > clamp) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    return [this.x, this.y, this.z].map((e) => e * 0.1) as [
      number,
      number,
      number
    ];
  }
}

export class ThreeScrollAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  scale: number;
  maxDifference: number = 5;
  dt: number = 0.00075;
  clamp: number = 1000;

  constructor(
    a: number = 38.48,
    b: number = 45.84,
    c: number = 1.18,
    d: number = 0.13,
    e: number = 0.57,
    f: number = 14.7,
    scale: number = 0.01,
    enableJitter: boolean = true
  ) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this.scale = scale;

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();

    if (enableJitter) {
      setInterval(() => {
        const r = 6 * Math.random();
        const jitter = (5 * (Math.random() - 0.5) + 100) / 100;
        switch (Math.floor(r)) {
          case 0:
            this.a = this.a * jitter;
            break;
          case 1:
            this.b = this.b * jitter;
            break;
          case 2:
            this.c = this.c * jitter;
            break;
          case 3:
            this.d = this.d * jitter;
            break;
          case 4:
            this.e = this.e * jitter;
            break;
          case 5:
            this.f = this.f * jitter;
            break;
        }
      }, 10);
    }
  }

  coordinate(): [number, number, number] {
    const { x, y, z, clamp, dt, a, b, c, d, e, f, scale } = this;
    var xNew = a * (y - x) + d * x * y;
    var yNew = b * x - x * z + f * y;
    var zNew = c * z + x * y - e * x * x;

    this.x += dt * xNew;
    this.y += dt * yNew;
    this.z += dt * zNew;
    if (x > clamp || y > clamp || z > clamp) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    return [this.x, this.y, this.z].map((e) => e * scale) as [
      number,
      number,
      number
    ];
  }
}

export class AizawaAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  aBase: number = 0.95;
  bBase: number = 0.7;
  cBase: number = 0.6;
  dBase: number = 3.5;
  eBase: number = 0.25;
  fBase: number = 0.1;
  scale: number;
  dt: number = 0.009;
  clamp: number = 1000;
  maxDifference: number = 100;

  constructor(
    a: number = 0.2160420302524173,
    b: number = 0.1625624597701181,
    c: number = 0.09788907491111698,
    d: number = 6.537820178591627,
    e: number = 0.015052714668473131,
    f: number = 32.258124030301545,
    scale: number = 0.8,
    enableJitter: boolean = true
  ) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this.scale = scale;

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();

    if (enableJitter) {
      const { maxDifference } = this;
      setInterval(() => {
        const r = 6 * Math.random();
        const jitter = (1 * (Math.random() - 0.5) + 100) / 100;
        switch (Math.floor(r)) {
          case 0:
            this.a = this.a * jitter;
            if (Math.abs(this.a - this.aBase) > maxDifference) {
              this.a = this.aBase;
            }
            break;
          case 1:
            this.b = this.b * jitter;
            if (Math.abs(this.b - this.bBase) > maxDifference) {
              this.b = this.bBase;
            }
            break;
          case 2:
            this.c = this.c * jitter;
            if (Math.abs(this.c - this.cBase) > maxDifference) {
              this.c = this.cBase;
            }
            break;
          case 3:
            this.d = this.d * jitter;
            if (Math.abs(this.d - this.dBase) > maxDifference) {
              this.d = this.dBase;
            }
            break;
          case 4:
            this.e = this.e * jitter;
            if (Math.abs(this.e - this.eBase) > maxDifference) {
              this.e = this.eBase;
            }
            break;
          case 5:
            this.f = this.f + jitter;
            if (Math.abs(this.f - this.fBase) > maxDifference) {
              this.f = this.fBase;
            }
            break;
        }
      }, 10);
    }
  }

  coordinate(): [number, number, number] {
    const { x, y, z, clamp, dt, a, b, c, d, e, f, scale } = this;
    var xNew = (z - b) * x - d * y;
    var yNew = d * x + (z - b) * y;
    var zNew =
      c +
      a * z -
      Math.pow(z, 3) / 3 -
      (x * x + y * y) * (1 + e * z) +
      f * z * Math.pow(x, 3);

    this.x += dt * xNew;
    this.y += dt * yNew;
    this.z += dt * zNew;
    if (x > clamp || y > clamp || z > clamp) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    return [this.x, this.y, this.z].map((e) => e * scale) as [
      number,
      number,
      number
    ];
  }
}

export class SprottAttractor extends Vector {
  x: number;
  y: number;
  z: number;
  a: number;
  b: number;
  aBase: number = 2.07;
  bBase: number = 1.79;
  scale: number;
  dt: number = 0.2;
  clamp: number = 1000;
  maxDifference: number = 20;

  constructor(
    a: number = 2.07,
    b: number = 1.79,
    scale: number = 0.4,
    enableJitter: boolean = false
  ) {
    super();
    this.a = a;
    this.b = b;
    this.scale = scale;

    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();

    if (enableJitter) {
      const { maxDifference } = this;
      setInterval(() => {
        const r = 6 * Math.random();
        const jitter = (10 * (Math.random() - 0.5) + 100) / 100;
        switch (Math.floor(r)) {
          case 0:
            this.a = this.a * jitter;
            if (Math.abs(this.a - this.aBase) > maxDifference) {
              this.a = this.aBase;
            }
            break;
          case 1:
            this.b = this.b * jitter;
            if (Math.abs(this.b - this.bBase) > maxDifference) {
              this.b = this.bBase;
            }
            break;
        }
      }, 10);
    }
  }

  coordinate(): [number, number, number] {
    const { x, y, z, clamp, dt, a, b, scale } = this;
    var xNew = y + a * x * y + x * z;
    var yNew = 1 - b * x * x + y * z;
    var zNew = x - x * x - y * y;

    this.x += dt * xNew;
    this.y += dt * yNew;
    this.z += dt * zNew;
    if (x > clamp || y > clamp || z > clamp) {
      this.x = Math.random();
      this.y = Math.random();
      this.z = Math.random();
    }

    return [this.x, this.y, this.z].map((e) => e * scale) as [
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
  originalB = 0.208186;
  dt: number = 0.05;
  scale: number = 0.3;
  constructor(b?: number) {
    super();
    if (b) {
      this.b = b;
    }

    setInterval(() => {
      this.b =
        this.originalB +
        Math.sin((2 * Math.PI * new Date().getTime()) / 1000) * 0.02;
    }, 100);
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
