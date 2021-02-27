import { mat4, vec3 } from "gl-matrix";

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
    this.eye = [0, 0, -6];

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

    return m;
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
