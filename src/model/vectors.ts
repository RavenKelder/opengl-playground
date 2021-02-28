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
  x: number = 1;
  y: number = 0;
  z: number = 2;
  b: number = 0.108186;
  dt: number = 0.005;
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
