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

  constructor(a: number, b: number) {
    super();
    this.a = a;
    this.b = b;
    this.x = 1.0;
    this.y = 1.0;
  }

  coordinate(): [number, number, number] {
    const { a, b, x, y, xOffset, yOffset } = this;
    var xNew =
      Math.sin((x * y) / b) + Math.cos(a * x - y);
    var yNew = x + Math.sin(y) / b;

    this.x = xNew;
    this.y = yNew;

    var z =
      0.2 * Math.sin(xNew * Math.PI * 4) +
      0.2 * Math.sin(yNew * Math.PI * 4);

    return [xNew + xOffset, yNew + yOffset, z];
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

  constructor(
    s: number = 10.0,
    r: number = 28.0,
    b: number = 2.667
  ) {
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

    return [this.x, this.y, this.z].map(
      (e) => e * 0.1
    ) as [number, number, number];
  }
}
