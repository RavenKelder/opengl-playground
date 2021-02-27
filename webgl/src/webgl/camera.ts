import { mat4, vec3, vec4 } from "gl-matrix";

const defaultPerspective: Perspective = {
  fieldOfView: (45 / 180) * Math.PI,
  aspectRatio: 1.0,
  viewRange: [0.1, 100.0],
};

const defaultTransformation: Transformation = {
  rotation: [0.0, 0.0, 0.0],
  translation: [0.0, 0.0, -6.0],
};

export class Camera {
  perspectiveMatrix!: mat4;

  perspective: Perspective = defaultPerspective;
  transformation: Transformation = defaultTransformation;

  eye: vec3;
  lookingAt: vec3 = [0, 0, 0];

  eyeCoordinate: {
    u: vec3;
    v: vec3;
    n: vec3;
  };

  constructor(options?: {
    perspective?: Partial<Perspective>;
    transformation?: Partial<Transformation>;
  }) {
    this.eye = [0, 0, -1];

    this.eyeCoordinate = {
      u: [1, 0, 0],
      v: [0, 1, 0],
      n: [0, 0, 1],
    };

    this.perspectiveMatrix = mat4.create();

    this.updatePerspective(options?.perspective ?? defaultPerspective);
    this.updateTransformation();
  }

  updatePerspective(perspective: Partial<Perspective>): mat4 {
    const [fieldOfView, aspectRatio, viewRange] = [
      perspective?.fieldOfView ?? this.perspective.fieldOfView,
      perspective?.aspectRatio ?? this.perspective.aspectRatio,
      perspective?.viewRange ?? this.perspective.viewRange,
    ];

    this.perspective = {
      fieldOfView,
      aspectRatio,
      viewRange,
    };

    this.perspectiveMatrix = mat4.create();
    this.perspectiveMatrix = mat4.perspective(
      this.perspectiveMatrix,
      fieldOfView,
      aspectRatio,
      viewRange[0],
      viewRange[1]
    );

    console.log(this.perspective.aspectRatio);

    return this.perspectiveMatrix;
  }

  updateTransformation(): mat4 {
    const { eye, lookingAt } = this;
    const { u, v, n } = this.eyeCoordinate;

    var m = mat4.create();

    m = mat4.lookAt(m, eye, lookingAt, v);

    var newN = vec3.subtract(vec3.create(), lookingAt, eye);
    newN = vec3.normalize(newN, newN);
    this.eyeCoordinate.n = newN;

    var newU = vec3.create();
    vec3.cross(newU, v, this.eyeCoordinate.n);
    vec3.normalize(newU, newU);
    this.eyeCoordinate.u = newU;

    var newV = vec3.create();
    vec3.cross(newV, newN, newU);
    vec3.normalize(newV, newV);
    this.eyeCoordinate.v = newV;

    return m;
  }

  move(vector: vec3) {
    this.eye = vec3.add(this.eye, this.eye, vector);

    this.lookingAt = vec3.add(this.lookingAt, this.lookingAt, vector);
  }

  rotate(amount: number, direction: "u" | "v" | "n") {
    if (Math.abs(amount) < 0.0000001) {
      return;
    }
    const { lookingAt, eye } = this;
    const { v } = this.eyeCoordinate;
    const rotateAround = mat4.rotate(
      mat4.create(),
      mat4.create(),
      amount,
      this.eyeCoordinate[direction]
    );

    // If rotating through n vector, only the v vector needs to be
    // rotated, as the updateTransformation function already updates the
    // rest of the coordinates based on v. This is safe as long as change
    // in v is small (i.e. it does not become parallel to n).
    // TODO: fix this problem accordingly
    if (direction === "n") {
      const rotation = vec4.transformMat4(
        vec4.create(),
        vec4.set(vec4.create(), v[0], v[1], v[2], 1),
        rotateAround
      );

      this.eyeCoordinate.v = [rotation[0], rotation[1], rotation[2]];
      return;
    }

    const originLookingAt = vec3.subtract(vec3.create(), lookingAt, eye);
    const newLookingAt = vec4.transformMat4(
      vec4.create(),
      vec4.set(
        vec4.create(),
        originLookingAt[0],
        originLookingAt[1],
        originLookingAt[2],
        1
      ),
      rotateAround
    );

    this.lookingAt = vec3.add(
      vec3.create(),
      [newLookingAt[0], newLookingAt[1], newLookingAt[2]],
      eye
    );
  }
}

export interface Perspective {
  fieldOfView: number;
  aspectRatio: number;
  viewRange: [number, number];
}

export interface Transformation {
  translation: [number, number, number];
  rotation: [number, number, number];
}

const camera = new Camera();
export { camera };
