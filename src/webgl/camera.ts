import { mat4, vec3, vec4 } from "gl-matrix";

const defaultPerspective: Perspective = {
  fieldOfView: (45 / 180) * Math.PI,
  aspectRatio: 1.0,
  viewRange: [0.1, 100.0],
};

type CameraCoordSystem = "u" | "v" | "n";
const cameraCoordVectors: CameraCoordSystem[] = ["u", "v", "n"];

/**
 * Camera defines what the viewer can see. Tracks the camera position, eye, the
 * eye's local coordinate system, eyeCoordinate (u, v, n), and what the camera
 * is looking at (which should always be at coordinate eye - n). The perspective
 * matrix defines the frustum that the viewer sees, and the transformation
 * matrix defines how the world should be rotated to align with the camera's
 * local coordinate system. The perspective matrix is accessed directly since it
 * does not change often; the transformation matrix needs to be created
 * everytime it is fetched (hence a function) since it updates frequently.
 */
export class Camera {
  perspectiveMatrix!: mat4;

  perspective: Perspective = defaultPerspective;

  eye: vec3;
  lookingAt: vec3;

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
    this.lookingAt = vec3.add(vec3.create(), this.eye, [0, 0, 1]);

    this.eyeCoordinate = {
      u: [1, 0, 0],
      v: [0, 1, 0],
      n: [0, 0, 1],
    };

    this.perspectiveMatrix = mat4.create();

    this.updatePerspective(options?.perspective ?? defaultPerspective);
    this.transformationMatrix();
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

  transformationMatrix(): mat4 {
    const { eye, lookingAt } = this;
    const { v } = this.eyeCoordinate;

    // Set the matrix to look straight forward
    return mat4.lookAt(mat4.create(), eye, lookingAt, v);
  }

  /**
   * move translates the camera by a given vector
   * @param vector the vector to move the camera by
   */
  move(vector: vec3) {
    // Move the eye, as well as the point the camera is looking at by the same
    // amount, since this is a translation
    this.eye = vec3.add(this.eye, this.eye, vector);

    this.lookingAt = vec3.add(this.lookingAt, this.lookingAt, vector);
  }

  /**
   * rotate rotates the camera's coordinate system around a given direction
   * (one of the system's unit vectors) by a given amount
   * @param amount the amount to rotate the system by, in radians
   * @param direction the coordinate system's unit vector to rotate by
   */
  rotate(amount: number, direction: CameraCoordSystem) {
    if (Math.abs(amount) < 0.0000001) {
      return;
    }
    const { lookingAt, eye } = this;

    // First define the rotation matrix
    const rotateAround = mat4.rotate(
      mat4.create(),
      mat4.create(),
      amount,
      this.eyeCoordinate[direction]
    );

    // Get the unit vectors that will be rotated
    const rotatedAxes = cameraCoordVectors.filter(
      (vector) => vector != direction
    );

    // Arbitrarily take one of the axes to rotate, and rotate it.
    const unitVector1 = this.eyeCoordinate[rotatedAxes[0]];
    const rotation1 = vec4.transformMat4(
      vec4.create(),
      vec4.set(
        vec4.create(),
        unitVector1[0],
        unitVector1[1],
        unitVector1[2],
        1
      ),
      rotateAround
    );
    this.eyeCoordinate[rotatedAxes[0]] = [
      rotation1[0],
      rotation1[1],
      rotation1[2],
    ];

    // Now use the cross product to rotate the last axis. This should prevent
    // any drift, since this transformation is directly dependent on the other
    // two unit vectors
    const unitVector2 = this.eyeCoordinate[rotatedAxes[1]];
    const rotation2 = vec4.transformMat4(
      vec4.create(),
      vec4.set(
        vec4.create(),
        unitVector2[0],
        unitVector2[1],
        unitVector2[2],
        1
      ),
      rotateAround
    );
    this.eyeCoordinate[rotatedAxes[1]] = [
      rotation2[0],
      rotation2[1],
      rotation2[2],
    ];

    // If rotating around unit vector n, don't rotate where the camera is
    // looking at since it will always be along that unit vector
    if (direction === "n") {
      return;
    }

    // Now rotate where the camera is looking at
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
